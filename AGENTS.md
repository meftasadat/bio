# AGENTS.md

Instructions, guidelines, testing gotchas, and preferences for AI agents and developers working on the **Bio** codebase.

---

## 1. Project Overview & Architecture

This repository is a full-stack portfolio and bio website for **Mefta Sadat** (Staff ML Developer at Priceline).

- **Backend** (`backend/`):
  - **Framework**: FastAPI (Python >= 3.13) with Pydantic v2 data models.
  - **Package Manager**: [`uv`](https://github.com/astral-sh/uv).
  - **Content Pipeline**: Markdown files with YAML frontmatter in `backend/app/content/markdown/` rendered via `markdown-it-py` and sanitized using `bleach`.
  - **Resume Generator**: Dynamic LaTeX-to-PDF compilation via `pdflatex` in `backend/app/services/resume_generator.py`.
- **Frontend** (`frontend/`):
  - **Framework**: React 18 with Vite and React Router (`react-router-dom`).
  - **Styling**: Vanilla CSS scoped per component (e.g. `ComponentName.css`), dark-mode aesthetics.
  - **Fallback Layer**: `frontend/src/lib/fallback-data.js` provides static fallback content if the backend API is unavailable.
- **Dual Deployment / Serving Model**:
  - **Local Development**: FastAPI runs on port 8000; Vite dev server runs on port 5173 and proxies `/api` and `/static` to port 8000.
  - **Production / Container**: Vite builds to `frontend/dist`, synced to `backend/app/static/web/`. FastAPI serves the frontend bundle directly from root `/` and catches client-side routes, while serving the API on `/api/*`.

---

## 2. Quick Reference Commands

### Running Locally
```bash
# Start both backend and frontend dev servers (kills stale ports 8000/5173 first)
./run-local.sh dev

# Build frontend and serve everything through FastAPI
./run-local.sh build
```

### Backend (`backend/`)
```bash
# Sync dependencies
uv sync --project backend

# Run backend development server
uv run --project backend uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run one-off python command in backend venv
uv run --project backend python -c "<script>"
```

### Frontend (`frontend/`)
```bash
cd frontend
npm ci          # Install dependencies
npm run dev     # Start Vite dev server on http://localhost:5173
npm run build   # Production bundle in frontend/dist
npm run preview # Preview production build
```

### Docker / Podman
```bash
./run-podman.sh
# Access containerized app on http://localhost:8080
```

### Regenerating Static Resume PDFs
When updating experience or bio content, regenerate the static resume files:
```bash
cd backend
uv run python -c "
import shutil
from pathlib import Path
from app.services.resume_generator import generate_resume_latex, compile_latex_to_pdf
from app.api.content import get_bio_data

bio = get_bio_data()
sections = {'summary': True, 'experience': True, 'education': True, 'talks': True, 'publications': True, 'blogs': False}
experience_ids = ['priceline', 'loblaw-digital', 'zonetv', 'ibm-cas', 'tmu-research']

latex = generate_resume_latex(bio, sections, experience_ids=experience_ids)
pdf_path = compile_latex_to_pdf(latex)

targets = [
    Path('app/static/resume.pdf'),
    Path('app/content/MS_RESUME.pdf'),
    Path('../frontend/public/MS_RESUME.pdf')
]
for target in targets:
    shutil.copy(pdf_path, target)
    print(f'✅ Updated {target}')
"
```

---

## 3. Testing Strategies & Gotchas

### Backend Testing
- **Test Runner**: Pytest is not installed globally by default in the `uv.lock`. When running tests on-demand, use `uv run --with`:
  ```bash
  uv run --with pytest --with httpx --project backend pytest
  ```
  Or add test dependencies as needed via `uv add --dev pytest httpx`.
- **FastAPI TestClient**:
  - Always use `httpx` or `from fastapi.testclient import TestClient`.
  - When testing routes, remember that non-`/api` and non-`/static` requests attempt to serve `backend/app/static/web/index.html`. If the frontend is not built, these routes will raise a `404 Frontend build not found`.
- **Mocking LaTeX in CI / Tests**:
  - `compile_latex_to_pdf` executes `/usr/bin/pdflatex` or `/opt/homebrew/bin/pdflatex` via `subprocess.run`.
  - If testing `resume_generator.py` or `/api/resume/generate` in environments without LaTeX installed, **always mock `compile_latex_to_pdf`** or catch `RuntimeError` to prevent test failures.

### Frontend Testing & Verification
- **Build Verification**:
  - Always verify that changes compile cleanly before finishing tasks:
    ```bash
    cd frontend && npm run build
    ```
- **Port Conflict Gotcha**:
  - Ports `8000` (FastAPI) and `5173` (Vite) can be left open by orphan processes.
  - `run-local.sh` automatically executes `lsof -ti :8000 :5173 | xargs kill -9`. If running manually, ensure ports are cleared before launching.
- **Client-Side Routing**:
  - React Router handles navigation (`/`, `/blog`, `/apps`, etc.).
  - When serving through FastAPI, verify that refreshing a subpath (e.g., `/blog`) resolves through `serve_frontend_app` in `backend/app/main.py` rather than throwing a 404.

---

## 4. Key Gotchas & Nuances

### 1. Resume PDF Triplication
There are **three copies** of the static resume PDF across the codebase:
1. `backend/app/static/resume.pdf` — served by `/api/resume/download`
2. `backend/app/content/MS_RESUME.pdf` — content-backed static copy
3. `frontend/public/MS_RESUME.pdf` — direct download link in frontend components
> **Important**: When updating resume content or regenerating PDFs, ensure all three locations stay in sync!

### 2. LaTeX Generation Escaping & Markdown Compatibility
In `backend/app/services/resume_generator.py`:
- Markdown bullet items are parsed using `_parse_bullet_with_links`.
- Any raw HTML tags (e.g., `<img>`, `<br/>`) inside markdown descriptions are stripped out with regex (`re.sub(r'<[^>]+>', '', stripped)`).
- Markdown links `[text](url)` are converted to LaTeX `\href{url}{text}`.
- Special LaTeX characters (`%`, `_`, `&`, `#`, `$`, `{`, `}`, `\`, `~`, `^`) must be escaped properly; unescaped characters in markdown text will cause `pdflatex` compilation to fail.

### 3. Bleach Sanitization in Markdown Renderer
In `backend/app/services/markdown_renderer.py`:
- Markdown is rendered with `markdown-it-py` and sanitized using `bleach`.
- If you add custom HTML tags or attributes into markdown files (e.g. `bio.md` or `experience.md`), you **must** ensure the tags and attributes are explicitly allowed in `ALLOWED_TAGS` and `ALLOWED_ATTRIBUTES` in `markdown_renderer.py`.
- Otherwise, `bleach` will silently strip them.

### 4. Blog Posts Data Source
- `backend/app/services/medium_scraper.py` loads blog posts.
- For stability and speed, `get_medium_posts()` currently uses predefined cached metadata rather than fetching from the live web on every request. Keep this in mind when debugging blog endpoints.

### 5. Frontend Static Bundle Location
- Vite builds into `frontend/dist/`.
- In production/container mode, files must be copied to `backend/app/static/web/`.
- `backend/app/static/web/` is ignored in `.gitignore`. Do not commit built web assets unless explicitly requested.

### 6. Workspace Path Gotcha
- Note that legacy workflow scripts or notes may reference an older path (`Documents/bio`).
- The current working workspace is located at:
  `/Users/meftasadat/coding-projects/bio`
  Always use repository-relative paths when executing scripts.

---

## 5. Coding Preferences & Style Guidelines

### Python (Backend)
- Python 3.13+ syntax (use built-in generic types like `list[str]`, `dict[str, Any]`, `str | None`).
- Use Pydantic v2 models for data validation and serialization.
- Manage dependencies using `uv` (`uv add`, `uv sync`).
- Maintain clean modular architecture:
  - `app/api/`: Route definitions and handlers.
  - `app/core/`: Configuration, environment settings.
  - `app/models/`: Pydantic models.
  - `app/services/`: Business logic, renderers, scrapers.
  - `app/content/`: Markdown reader and content repository.

### JavaScript / React (Frontend)
- Functional components with React hooks (`useState`, `useEffect`, `useRef`, `useContext`).
- Keep styling clean and modular using component CSS files (`ComponentName.css`).
- Use `frontend/src/lib/api.js` for API configuration and maintain graceful degradation with `frontend/src/lib/fallback-data.js`.
- Clean imports, consistent formatting, and no unnecessary third-party npm packages.

### Git & Commits
- Follow Conventional Commits convention:
  - `feat:` new feature / enhancement
  - `fix:` bug fix
  - `chore:` maintenance / update dependencies / resume regeneration
  - `style:` CSS and visual tweaks
  - `refactor:` code restructuring without feature change
- Be mindful of git status and avoid committing unrelated changes.

### Agent Workflow Best Practices
- **Concise communication**: State what was done, what was verified, and link relevant files.
- **Verification**: Always verify frontend (`npm run build`) and backend (`uv run ...`) integrity after making changes.
- **File Links**: Use GitHub-style markdown links with the `file://` scheme (e.g. `[main.py](file:///Users/meftasadat/coding-projects/bio/backend/app/main.py)`).
