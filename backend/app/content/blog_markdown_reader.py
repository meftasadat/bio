"""
Markdown content reader for blog posts.
Parses YAML frontmatter and markdown content from blog post files.
"""
import yaml
import os
from datetime import datetime
from typing import List, Dict, Any
from ..models.blog import BlogPost


class BlogMarkdownReader:
    """Reads and parses markdown blog post files with YAML frontmatter."""

    @staticmethod
    def parse_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
        """Parse YAML frontmatter from markdown content."""
        if not content.startswith('---'):
            return {}, content

        try:
            # Find the end of frontmatter
            end_idx = content.find('---', 3)
            if end_idx == -1:
                return {}, content

            frontmatter_str = content[3:end_idx].strip()
            body = content[end_idx + 3:].strip()

            # Parse YAML
            frontmatter = yaml.safe_load(frontmatter_str) or {}

            return frontmatter, body
        except yaml.YAMLError:
            return {}, content

    @staticmethod
    def read_blog_post(filepath: str) -> BlogPost:
        """Read and parse a blog post markdown file."""
        frontmatter, content = BlogMarkdownReader.parse_frontmatter(open(filepath, 'r', encoding='utf-8').read())

        # Parse datetime
        published_at = frontmatter.get('published_at')
        if isinstance(published_at, str):
            published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
        elif not isinstance(published_at, datetime):
            published_at = datetime.now()

        # Parse updated_at if present
        updated_at = frontmatter.get('updated_at')
        if updated_at and isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
        elif not isinstance(updated_at, datetime):
            updated_at = None

        return BlogPost(
            id=frontmatter.get('id', ''),
            title=frontmatter.get('title', ''),
            slug=frontmatter.get('slug', ''),
            content=content,
            excerpt=frontmatter.get('excerpt', ''),
            author=frontmatter.get('author', ''),
            published_at=published_at,
            updated_at=updated_at,
            tags=frontmatter.get('tags', []),
            featured=frontmatter.get('featured', False),
            published=frontmatter.get('published', True)
        )

    @staticmethod
    def load_blog_posts(blog_dir: str) -> List[BlogPost]:
        """Load all blog posts from markdown files in the directory."""
        posts = []

        if not os.path.exists(blog_dir):
            return posts

        for filename in os.listdir(blog_dir):
            if filename.endswith('.md'):
                filepath = os.path.join(blog_dir, filename)
                try:
                    post = BlogMarkdownReader.read_blog_post(filepath)
                    posts.append(post)
                except Exception as e:
                    print(f"Error reading blog post {filename}: {e}")

        # Sort by publication date (newest first)
        posts.sort(key=lambda x: x.published_at, reverse=True)

        return posts
