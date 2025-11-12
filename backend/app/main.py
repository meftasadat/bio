"""
Main FastAPI application for the professional bio website.
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .api import content, blog
from .core.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    yield
    # Shutdown


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=settings.description,
    version=settings.version,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
static_path = Path(__file__).parent / "static"
frontend_path = static_path / "web"
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# API routes
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(blog.router, prefix="/api/blog", tags=["blog"])


@app.get("/api/resume/download")
async def download_resume():
    """Download resume PDF."""
    candidate_files = [
        static_path / "resume.pdf",
        static_path / "resume.txt",
    ]
    for candidate in candidate_files:
        if candidate.exists():
            media_type = "application/pdf" if candidate.suffix == ".pdf" else "text/plain"
            download_name = f"Mefta_Sadat_Resume{candidate.suffix}"
            return FileResponse(
                path=candidate,
                filename=download_name,
                media_type=media_type,
            )
    raise HTTPException(status_code=404, detail="Resume not found")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


def _frontend_index() -> Path:
    index_file = frontend_path / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend build not found")
    return index_file


def _resolve_frontend_asset(path_fragment: str) -> Path | None:
    target = (frontend_path / path_fragment).resolve()
    if frontend_path.exists() and target.is_file():
        if str(target).startswith(str(frontend_path.resolve())):
            return target
    return None


@app.get("/", include_in_schema=False)
async def serve_frontend_root():
    """Serve the compiled React application."""
    return FileResponse(_frontend_index())


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend_app(full_path: str):
    """Serve frontend assets or fall back to index.html for client-side routes."""
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="Endpoint not found")

    asset = _resolve_frontend_asset(full_path)
    if asset:
        return FileResponse(asset)
    return FileResponse(_frontend_index())
