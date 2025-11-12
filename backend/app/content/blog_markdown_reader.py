"""
Markdown content reader for blog posts.
Parses YAML frontmatter and markdown content from blog post files.
"""
from datetime import datetime
from typing import Any, Dict, List

import yaml

from ..models.blog import BlogPost
from ..services.content_repository import ContentRepository
from ..services.markdown_renderer import render_markdown


class BlogMarkdownReader:
    """Reads and parses markdown blog post files with YAML frontmatter."""

    @staticmethod
    def parse_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
        """Parse YAML frontmatter from markdown content."""
        if not content.startswith('---'):
            return {}, content

        try:
            end_idx = content.find('---', 3)
            if end_idx == -1:
                return {}, content

            frontmatter_str = content[3:end_idx].strip()
            body = content[end_idx + 3:].strip()

            frontmatter = yaml.safe_load(frontmatter_str) or {}

            return frontmatter, body
        except yaml.YAMLError:
            return {}, content

    @staticmethod
    def read_blog_post(repository: ContentRepository, relative_path: str) -> BlogPost:
        """Read and parse a blog post markdown file via the repository."""
        content = repository.read_text(relative_path)
        frontmatter, body = BlogMarkdownReader.parse_frontmatter(content)

        published_at = BlogMarkdownReader._parse_datetime(
            frontmatter.get('published_at')
        )
        updated_at = BlogMarkdownReader._parse_datetime(
            frontmatter.get('updated_at'), allow_none=True
        )

        raw_excerpt = frontmatter.get('excerpt') or BlogMarkdownReader._build_excerpt(body)

        return BlogPost(
            id=frontmatter.get('id', ''),
            title=frontmatter.get('title', ''),
            slug=frontmatter.get('slug', ''),
            content=body,
            content_html=render_markdown(body),
            excerpt=raw_excerpt,
            author=frontmatter.get('author', ''),
            published_at=published_at,
            updated_at=updated_at,
            tags=frontmatter.get('tags', []),
            featured=frontmatter.get('featured', False),
            published=frontmatter.get('published', True)
        )

    @staticmethod
    def load_blog_posts(repository: ContentRepository, blog_dir: str = "blogs") -> List[BlogPost]:
        """Load all blog posts from markdown files in the directory."""
        posts: List[BlogPost] = []
        filenames = repository.list_markdown_files(blog_dir)

        for filename in filenames:
            if not filename.endswith(".md"):
                continue
            relative_path = "/".join([blog_dir.rstrip("/"), filename])
            try:
                post = BlogMarkdownReader.read_blog_post(repository, relative_path)
                posts.append(post)
            except Exception as exc:  # noqa: BLE001 - log and continue
                print(f"Error reading blog post {filename}: {exc}")

        posts.sort(key=lambda x: x.published_at, reverse=True)
        return posts

    @staticmethod
    def _parse_datetime(value: Any, allow_none: bool = False) -> datetime | None:
        if value is None and allow_none:
            return None
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        if allow_none:
            return None
        return datetime.now()

    @staticmethod
    def _build_excerpt(body: str, max_chars: int = 240) -> str:
        clean_text = body.strip().split("\n\n")[0]
        return clean_text[:max_chars].rstrip() + ("..." if len(clean_text) > max_chars else "")
