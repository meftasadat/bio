from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import os
from ..content.blog_markdown_reader import BlogMarkdownReader

router = APIRouter()

# Cache the blog posts to avoid re-reading files on every request
_blog_posts = None

def get_blog_posts():
    """Get blog posts, loading from markdown files if not cached."""
    global _blog_posts
    if _blog_posts is None:
        blog_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'markdown', 'blogs')
        _blog_posts = BlogMarkdownReader.load_blog_posts(blog_dir)
    return _blog_posts

@router.get("/")
async def get_blog_posts_api(
    limit: int = Query(10, description="Number of posts to return"),
    offset: int = Query(0, description="Number of posts to skip"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    featured: Optional[bool] = Query(None, description="Filter featured posts only")
):
    """Get blog posts with optional filtering."""
    all_posts = get_blog_posts()
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
    posts = get_blog_posts()
    post = next((p for p in posts if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.get("/slug/{slug}")
async def get_blog_post_by_slug(slug: str):
    """Get a specific blog post by slug."""
    posts = get_blog_posts()
    post = next((p for p in posts if p.slug == slug), None)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.get("/tags/all")
async def get_all_tags():
    """Get all unique tags from blog posts."""
    posts = get_blog_posts()
    tags = set()
    for post in posts:
        tags.update(post.tags)
    return {"tags": sorted(list(tags))}
