"""
Main FastAPI application for the professional bio website.
"""
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .api import content, blog
from .core.config import get_settings
from .services.resume_generator import generate_resume_latex, compile_latex_to_pdf
from .api.content import get_bio_data
from .api.blog import load_blog_posts


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


class ResumeRequest(BaseModel):
    """Request body for dynamic resume generation."""
    sections: Dict[str, bool] = {
        "summary": True,
        "experience": True,
        "education": True,
        "talks": True,
        "publications": True,
        "blogs": True,
    }
    experience_ids: Optional[List[str]] = None


@app.post("/api/resume/generate")
async def generate_resume(request: ResumeRequest):
    """Generate a dynamic resume PDF from portfolio data."""
    try:
        bio = get_bio_data()
        blog_posts = None
        if request.sections.get("blogs"):
            all_posts = [p for p in load_blog_posts() if p.published]
            blog_posts = all_posts[:10]  # Limit to 10 most recent

        latex_source = generate_resume_latex(
            bio=bio,
            sections=request.sections,
            experience_ids=request.experience_ids,
            blog_posts=blog_posts,
        )
        pdf_path = compile_latex_to_pdf(latex_source)
        return FileResponse(
            path=pdf_path,
            filename="Mefta_Sadat_Resume.pdf",
            media_type="application/pdf",
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


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
