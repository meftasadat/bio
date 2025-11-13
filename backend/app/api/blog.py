from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from ..services.medium_scraper import MediumScraper

router = APIRouter()


def load_blog_posts():
    """Load blog posts from Medium."""
    return MediumScraper.get_medium_posts()

@router.get("/")
async def get_blog_posts_api(
    limit: int = Query(10, description="Number of posts to return"),
    offset: int = Query(0, description="Number of posts to skip"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    featured: Optional[bool] = Query(None, description="Filter featured posts only")
):
    """Get blog posts with optional filtering."""
    all_posts = [post for post in load_blog_posts() if post.published]
    filtered_posts = all_posts

    if tag:
        filtered_posts = [post for post in filtered_posts if tag in post.tags]

    if featured is not None:
        filtered_posts = [post for post in filtered_posts if post.featured == featured]

    # Apply pagination
    total = len(filtered_posts)
    posts = filtered_posts[offset:offset + limit]

    return {
        "posts": posts,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@router.get("/{post_id}")
async def get_blog_post(post_id: str):
    """Get a specific blog post by ID."""
    posts = load_blog_posts()
    post = next((p for p in posts if p.id == post_id and p.published), None)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.get("/slug/{slug}")
async def get_blog_post_by_slug(slug: str):
    """Get a specific blog post by slug."""
    posts = load_blog_posts()
    post = next((p for p in posts if p.slug == slug and p.published), None)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.get("/tags/all")
async def get_all_tags():
    """Get all unique tags from blog posts."""
    posts = [post for post in load_blog_posts() if post.published]
    tags = set()
    for post in posts:
        tags.update(post.tags)
    return {"tags": sorted(list(tags))}
