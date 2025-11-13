"""
Blog data models using Pydantic.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class BlogPost(BaseModel):
    """Blog post model."""
    id: str = Field(..., description="Unique post identifier")
    title: str = Field(..., description="Post title")
    slug: str = Field(..., description="URL-friendly slug")
    medium_url: str = Field(..., description="Medium article URL")
    excerpt: str = Field(..., description="Post excerpt/summary")
    author: str = Field(..., description="Post author")
    published_at: datetime = Field(..., description="Publication date")
    updated_at: Optional[datetime] = Field(None, description="Last update date")
    tags: List[str] = Field(default_factory=list, description="Post tags")
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail image URL")
    featured: bool = Field(default=False, description="Whether this is a featured post")
    published: bool = Field(default=True, description="Whether post is published")
