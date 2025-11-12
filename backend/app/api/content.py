from fastapi import APIRouter, Header, HTTPException

from ..content.markdown_reader import MarkdownReader
from ..core.config import get_settings
from ..services.content_store import content_repository

router = APIRouter()
settings = get_settings()


def get_bio_data():
    """Load the bio data using the shared content repository."""
    return MarkdownReader.load_bio_data(content_repository)

@router.get("/")
async def get_content():
    """Get all portfolio content."""
    return get_bio_data()

@router.get("/bio")
async def get_bio():
    """Get bio information."""
    bio_data = get_bio_data()
    return {
        "name": bio_data.name,
        "title": bio_data.title,
        "summary": bio_data.summary,
        "about": bio_data.about,
        "contact": bio_data.contact
    }

@router.get("/skills")
async def get_skills():
    """Get skills list."""
    bio_data = get_bio_data()
    return {"skills": bio_data.skills}

@router.get("/experience")
async def get_experience():
    """Get work experience."""
    bio_data = get_bio_data()
    return {"experience": bio_data.experience}

@router.get("/education")
async def get_education():
    """Get education history."""
    bio_data = get_bio_data()
    return {"education": bio_data.education}


@router.get("/talks")
async def get_talks():
    """Get public talks."""
    bio_data = get_bio_data()
    return {"talks": bio_data.talks}


@router.get("/publications")
async def get_publications():
    """Get publications."""
    bio_data = get_bio_data()
    return {"publications": bio_data.publications}


@router.post("/reload", status_code=204)
async def reload_content(x_reload_token: str | None = Header(default=None)):
    """Clear cached markdown (requires CONTENT_RELOAD_TOKEN)."""
    if not settings.reload_token:
        raise HTTPException(status_code=404, detail="Reload endpoint not configured")
    if x_reload_token != settings.reload_token:
        raise HTTPException(status_code=403, detail="Invalid reload token")
    content_repository.clear_cache()
