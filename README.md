# Your Name – A Professional Bio & Portfolio Template

This is a full-stack, batteries-included portfolio application designed to be easily deployed and maintained. It serves a React frontend and a FastAPI backend from a single container, making it perfect for platforms like Google Cloud Run. The content for your bio, blog, talks, and publications is driven by local or remote Markdown files, allowing for quick updates without redeploying.

This repository is designed to be a template. Fork it, customize it, and deploy your own professional bio in minutes.

## Features
- **Single Deployment Artifact**: Vite builds the frontend, and FastAPI serves it. This means you only need one container image for your entire application.
- **Markdown-Driven Content**: Your professional information lives in Markdown files. You can edit them locally or, for a more advanced setup, host them in a separate GitHub repository. The backend can be configured to pull updates automatically.
- **Rich Blog & Content Rendering**: Markdown is rendered on the server-side, supporting features like tables, checklists, footnotes, and syntax-highlighted code blocks.
- **Built-in Sections**: Comes with pre-built sections for your resume, conference talks, and publications.
- **Automated Builds**: A GitHub Actions workflow is included to build and push a container image to GitHub Container Registry (GHCR) on every push to the `main` branch.

## Tech Stack
- **Backend**: FastAPI, Pydantic, uvicorn, `uv` for dependency management.
- **Frontend**: React 18 + Vite with React Router.
- **Content Pipeline**: `markdown-it-py`, `mdit-py-plugins`, and `bleach`.
- **Container**: A multi-stage Docker build suitable for any container runtime, optimized for Google Cloud Run.

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+
- [`uv`](https://github.com/astral-sh/uv) installed globally
- Docker or a compatible container runtime (like Podman).
- `gcloud` CLI (for deployment)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/bio.git
    cd bio
    ```

2.  **Run the development server:**
    ```bash
    # This script handles both backend and frontend setup.
    ./run-local.sh
    ```
    - The backend will be available at `http://localhost:8000`.
    - The frontend (with hot-reloading) will be at `http://localhost:5173`.

3.  **To preview the production build locally:**
    ```bash
    ./run-local.sh build
    ```
    This will build the frontend and serve it from the FastAPI backend, just like in production.

## Deployment to Google Cloud Run

This project is optimized for deployment on Google Cloud Run.

### 1. Build and Push the Container Image

The included GitHub Actions workflow in `.github/workflows/container.yml` will automatically build and push the container image to GitHub Container Registry (GHCR) every time you push to the `main` branch.

The image will be tagged as `ghcr.io/<your-github-username>/bio:latest`.

### 2. Deploy to Cloud Run

Once your image is on GHCR, you can deploy it using the `gcloud` command-line tool.

```bash
# Replace <your-github-username> with your GitHub username
# Replace <your-gcp-project-id> with your Google Cloud project ID
# Replace <your-region> with your desired GCP region (e.g., us-central1)

gcloud run deploy bio-app \
  --image ghcr.io/<your-github-username>/bio:latest \
  --platform managed \
  --project <your-gcp-project-id> \
  --region <your-region> \
  --allow-unauthenticated \
  --set-env-vars="CORS_ORIGINS=https://your-domain.com"
```

This command deploys your application and makes it publicly accessible.

### 3. Setting Environment Variables

You can set environment variables directly in the `gcloud` command or configure them in the Cloud Run console. The most important one to configure for a production deployment is `CORS_ORIGINS`.

| Variable | Description | Example |
| --- | --- | --- |
| `CORS_ORIGINS` | Comma-separated list of allowed origins. | `https://your-domain.com,https://www.your-domain.com` |
| `CONTENT_SOURCE` | `local` or `github`. Use `github` to pull from a remote repo. | `github` |
| `CONTENT_GITHUB_REPO` | `owner/name` for the repo hosting your Markdown files. | `your-username/my-portfolio-content` |

For a full list of environment variables, see the "Environment Configuration" section below.

## Customizing the Content

To make this portfolio your own, you'll want to edit the content.

- **Bio, Experience, etc.**: Edit the Markdown files in `backend/app/content/markdown/`.
- **Resume**: Replace the placeholder `backend/app/static/resume.pdf` with your own resume.
- **Images**: Add your own images to `backend/app/static/` and update the references in the frontend components (e.g., `frontend/src/components/Experience.jsx`).

For more advanced customization, you can modify the React components in `frontend/src/components/`.

## API Overview
- `GET /api/content` – The entire bio payload.
- `GET /api/blog` – Paginated blog posts.
- `GET /api/resume/download` – Serves your resume file.
- `GET /health` – A health check endpoint for Cloud Run.

For a full list of API endpoints, see the code in `backend/app/api/`.

## Project Structure
```
bio/
├── backend/
│   ├── app/
│   │   ├── api/                # FastAPI routers
│   │   ├── content/            # Markdown content and loaders
│   │   └── services/           # Content repository and renderers
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   └── lib/api.js              # API configuration
├── .github/workflows/container.yml # GitHub Actions workflow for CI/CD
├── Dockerfile                  # Multi-stage Dockerfile
└── run-local.sh                # Local development script
```

This project is licensed under the terms of the MIT license. See LICENSE for more details.