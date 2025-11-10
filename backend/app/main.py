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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    yield
    # Shutdown


app = FastAPI(
    title="Mefta Sadat - Professional Bio",
    description="Professional portfolio website for Mefta Sadat",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
static_path = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# API routes
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(blog.router, prefix="/api/blog", tags=["blog"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to Mefta Sadat's Professional Bio API"}


@app.get("/api/resume/download")
async def download_resume():
    """Download resume PDF."""
    resume_path = static_path / "resume.pdf"
    if not resume_path.exists():
        raise HTTPException(status_code=404, detail="Resume not found")

    return FileResponse(
        path=resume_path,
        filename="Mefta_Sadat_Resume.pdf",
        media_type="application/pdf",
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
