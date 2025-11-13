# Mefta Sadat – Professional Bio

Full-stack portfolio application that serves the React frontend and FastAPI backend from a single container. Markdown content (bio sections + blog posts) can be edited locally or sourced directly from a GitHub repo for near real-time updates without redeploying.

## Features
- **Single deployment artifact**: Vite build output is served by FastAPI, so Cloud Run (or any container runtime) only needs one image.
- **Markdown-driven content**: Bio sections and blog posts live in markdown files with YAML frontmatter. When `CONTENT_SOURCE=github`, the API fetches files from GitHub using ETags for lightweight hot reloads.
- **Rich blog rendering**: Markdown is rendered server-side via `markdown-it-py` (tables, checklists, footnotes, fenced code) and sanitized with Bleach before being sent to the client.
- **Talks & Publications**: Share conference talks (with optional YouTube embeds) via `talks.md` and highlight scientific papers via `publications.md`.
- **Resume delivery**: `/api/resume/download` automatically serves `resume.pdf` (preferred) or falls back to a text version if the PDF isn’t available yet.
- **Automated builds**: GitHub Actions builds and pushes the container to GitHub Container Registry (GHCR) on every push to `main` or version tag.

## Tech Stack
- **Backend**: FastAPI, Pydantic, uvicorn, `uv` for dependency management.
- **Frontend**: React 18 + Vite with React Router.
- **Content pipeline**: `markdown-it-py`, `mdit-py-plugins`, and `bleach`.
- **Container**: Multi-stage Docker build (Node 18 + Python 3.13) suitable for Cloud Run.

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+
- [`uv`](https://github.com/astral-sh/uv) installed globally
- Podman or Docker (optional, for container builds)

### Local Development

```bash
# Fast dev loop (default): backend + Vite dev server
./run-local.sh

# Serve the compiled frontend via FastAPI (production preview)
./run-local.sh build
```

In `dev` mode the script:
1. Syncs backend deps with `uv sync` inside `backend/` and runs FastAPI (`http://localhost:8000`).
2. Installs frontend deps with `npm ci|install` and launches Vite dev on `http://localhost:5173` (proxying `/api`).

`build` mode compiles the Vite app, copies `dist/` into `backend/app/static/web`, syncs backend deps, and serves the bundled site from FastAPI—handy for Cloud Run parity testing. Stop with `Ctrl+C`; both modes clean up child processes automatically.

### Environment Configuration

The backend reads configuration from environment variables (defaults shown):

| Variable | Description | Default |
| --- | --- | --- |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `http://localhost:3000,http://localhost:5173` |
| `CONTENT_SOURCE` | `local` or `github` | `local` |
| `CONTENT_LOCAL_PATH` | Absolute path to markdown dir when `local` | `backend/app/content/markdown` |
| `CONTENT_GITHUB_REPO` | `owner/name` for repo hosting markdown | _unset_ |
| `CONTENT_GITHUB_BRANCH` | Branch for markdown files | `main` |
| `CONTENT_GITHUB_SUBDIR` | Subdirectory containing markdown in repo | `backend/app/content/markdown` |
| `CONTENT_GITHUB_TOKEN` | Optional token for private repos / higher rate limits | _unset_ |
| `CONTENT_REFRESH_INTERVAL_SECONDS` | Minimum seconds between GitHub revalidation | `60` |
| `CONTENT_RELOAD_TOKEN` | Optional shared secret for `/api/content/reload` | _unset_ |

Frontend API requests default to `/api`. Override with `VITE_API_BASE_URL` (see `frontend/.env.example`).  
New content sections live in:

| File | Contents |
| --- | --- |
| `backend/app/content/markdown/talks.md` | List of public talks with event metadata, links, and optional `video_url` |
| `backend/app/content/markdown/publications.md` | List of publications with venue, authors, summary |

### Content Reloading from GitHub
1. Push markdown changes to the configured repository/branch.
2. The backend fetches files via GitHub’s raw/API endpoints. It stores ETags and only re-downloads when content changes (or when `CONTENT_REFRESH_INTERVAL_SECONDS` elapses).
3. For instant cache busting, hit `POST /api/content/reload` with header `X-Reload-Token: <CONTENT_RELOAD_TOKEN>`. You can trigger this via a GitHub Actions workflow after content merges.

### Building the Container & Running Locally

```bash
# Build the multi-stage image
docker build -t bio .

# Run it
docker run --rm -p 8000:8000 bio
```

Or with Podman:

```bash
./run-podman.sh
```

Published images on GHCR are multi-architecture (`linux/amd64` + `linux/arm64`), so you can pull and run them on Intel/AMD servers or Apple Silicon Macs without emulation:

```bash
docker pull ghcr.io/<your-gh-username-or-org>/bio:latest
docker run --rm -p 8000:8000 ghcr.io/<your-gh-username-or-org>/bio:latest
```

Cloud Run will inject `$PORT`; the container entrypoint already respects it.

### GitHub Actions / GHCR
The workflow in `.github/workflows/container.yml`:
- Logs in to GHCR.
- Builds the container with Buildx (multi-arch manifest pushed on non-PR builds).
- Pushes tags `ghcr.io/<owner>/bio:latest` and `ghcr.io/<owner>/bio:<sha>` (skips pushing on PRs).

Set Cloud Run (or your orchestrator) to pull from GHCR with the token of your choice.

## API Overview
- `GET /api/content` – entire bio payload (bio, contact, skills, experience, education).
- `GET /api/content/bio|skills|experience|education` – section-specific slices.
- `GET /api/content/talks` – public speaking engagements + video links.
- `GET /api/content/publications` – research publications.
- `POST /api/content/reload` – clears markdown caches (requires `CONTENT_RELOAD_TOKEN`).
- `GET /api/blog?limit=&offset=&tag=&featured=` – paginated, filtered posts (published only).
- `GET /api/blog/{id}` / `/api/blog/slug/{slug}` – individual post.
- `GET /api/blog/tags/all` – unique tags across published posts.
- `GET /api/resume/download` – resume file (PDF preferred; falls back to text).
- `GET /health` – health check for Cloud Run.

## Project Structure
```
bio/
├── backend/
│   ├── app/
│   │   ├── api/                # FastAPI routers
│   │   ├── content/            # Markdown loaders
│   │   ├── core/               # Settings
│   │   ├── models/             # Pydantic schemas
│   │   └── services/           # Content repo + Markdown renderer
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── lib/api.js          # API base config
│   ├── vite.config.js
│   └── package.json
├── Dockerfile
├── .github/workflows/container.yml
├── run-local.sh
└── run-podman.sh
```

## Next Steps
- Drop your real `resume.pdf` into `backend/app/static/`.
- Point `CONTENT_SOURCE` to `github`, set repo details, and automate `POST /api/content/reload` after merges.
- Wire Cloud Run to the GHCR image for one-command deployments.
