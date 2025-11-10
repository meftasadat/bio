from fastapi import APIRouter, HTTPException
import os
from ..content.markdown_reader import MarkdownReader

router = APIRouter()

# Cache the bio data to avoid re-reading files on every request
_bio_data = None

def get_bio_data():
    """Get bio data, loading from markdown files if not cached."""
    global _bio_data
    if _bio_data is None:
        markdown_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'markdown')
        _bio_data = MarkdownReader.load_bio_data(markdown_dir)
    return _bio_data

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
