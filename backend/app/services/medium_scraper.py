"""
Medium article scraper service.
Extracts metadata and content from Medium URLs.
"""
import re
from datetime import datetime
from typing import Dict, Any, Optional
from urllib.parse import urlparse

from ..models.blog import BlogPost


class MediumScraper:
    """Scrapes Medium articles for metadata and content."""

    @staticmethod
    def extract_article_id(url: str) -> str:
        """Extract article ID from Medium URL."""
        parsed = urlparse(url)
        path_parts = parsed.path.strip('/').split('/')
        # Medium URLs typically end with the article ID
        return path_parts[-1] if path_parts else ""

    @staticmethod
    def create_blog_post_from_medium_data(medium_data: Dict[str, Any]) -> BlogPost:
        """Create a BlogPost from scraped Medium data."""
        metadata = medium_data.get('metadata', {})
        jsonld = medium_data.get('jsonld', {})

        # Extract title
        title = (
            metadata.get('og:title') or
            metadata.get('title', '').split(' | ')[0] or
            jsonld.get('headline') or
            jsonld.get('name', '')
        )

        # Extract author - prefer the main author from jsonld
        author = jsonld.get('author', {}).get('name', '')
        if not author:
            # Fallback to metadata author
            author = metadata.get('author', '')

        # Extract description/excerpt
        excerpt = (
            metadata.get('og:description') or
            metadata.get('description') or
            jsonld.get('description', '')
        )

        # Clean up excerpt (remove co-author info if present)
        if excerpt.startswith(title):
            excerpt = excerpt[len(title):].strip()
        if excerpt.startswith('Co-authored by:'):
            # Keep the co-author info as it's relevant
            pass
        elif len(excerpt) > 300:
            excerpt = excerpt[:300].rstrip() + "..."

        # Extract published date
        published_at = None
        date_str = (
            jsonld.get('datePublished') or
            jsonld.get('dateCreated') or
            metadata.get('article:published_time')
        )
        if date_str:
            try:
                # Handle different date formats
                if 'T' in date_str:
                    published_at = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                else:
                    published_at = datetime.fromisoformat(date_str)
            except (ValueError, AttributeError):
                published_at = datetime.now()

        # Extract thumbnail URL
        thumbnail_url = (
            metadata.get('og:image') or
            (jsonld.get('image', [None])[0] if jsonld.get('image') else None)
        )

        # Extract Medium URL
        medium_url = metadata.get('og:url') or metadata.get('al:web:url', '')

        # Generate slug from title
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[\s_-]+', '-', slug).strip('-')

        # Generate ID from URL
        article_id = MediumScraper.extract_article_id(medium_url)

        return BlogPost(
            id=article_id,
            title=title,
            slug=slug,
            medium_url=medium_url,
            excerpt=excerpt,
            author=author,
            published_at=published_at or datetime.now(),
            thumbnail_url=thumbnail_url,
            tags=["Medium"],  # Default tag
            featured=False,
            published=True
        )

    @staticmethod
    def get_medium_posts() -> list[BlogPost]:
        """Get predefined Medium blog posts."""
        # These are the two articles provided by the user
        medium_urls = [
            "https://medium.com/loblaw-digital/unlocking-experimentation-with-helios-recommendation-engine-ff91d697b943",
            "https://medium.com/loblaw-digital/enriching-the-online-shopping-experience-with-helios-recommendation-engine-dc85d80ca688"
        ]

        posts = []
        for url in medium_urls:
            # In a real implementation, you'd scrape each URL here
            # For now, we'll use the data we already scraped
            if "unlocking-experimentation" in url:
                # Data from first article
                medium_data = {
                    "metadata": {
                        "og:title": "Unlocking Experimentation with Helios Recommendation Engine",
                        "author": "Samara Xiang",
                        "og:description": "Co-authored by: Samara Xiang, Yuhan Qin, Mefta Sadat, JC Seok, Alex Yip",
                        "article:published_time": "2024-10-22T19:08:15Z",
                        "og:image": "https://miro.medium.com/v2/resize:fit:1200/1*m_8gxkI8M7xoVDmdwifKhw.png",
                        "og:url": url
                    },
                    "jsonld": {
                        "headline": "Unlocking Experimentation with Helios Recommendation Engine",
                        "author": {"name": "Samara Xiang"},
                        "datePublished": "2024-10-22T19:08:15Z",
                        "description": "Co-authored by: Samara Xiang, Yuhan Qin, Mefta Sadat, JC Seok, Alex Yip"
                    }
                }
            elif "enriching-the-online-shopping" in url:
                # Data from second article
                medium_data = {
                    "metadata": {
                        "og:title": "Enriching the online shopping experience with Helios Recommendation Engine",
                        "author": "Alex Yip",
                        "og:description": "Co-authored by: JC Seok, Mefta Sadat, Alex Yip, Indrani Gorti, Julia Lee",
                        "article:published_time": "2023-06-26T17:01:57Z",
                        "og:image": "https://miro.medium.com/v2/resize:fit:1200/1*tEMfO2p9c_fJBJfa2TJDXg.png",
                        "og:url": url
                    },
                    "jsonld": {
                        "headline": "Enriching the online shopping experience with Helios Recommendation Engine",
                        "author": {"name": "Alex Yip"},
                        "datePublished": "2023-06-26T17:01:57Z",
                        "description": "Co-authored by: JC Seok, Mefta Sadat, Alex Yip, Indrani Gorti, Julia Lee"
                    }
                }
            else:
                continue

            post = MediumScraper.create_blog_post_from_medium_data(medium_data)
            posts.append(post)

        # Sort by published date (newest first)
        posts.sort(key=lambda x: x.published_at, reverse=True)
        return posts
