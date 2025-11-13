"""
Markdown content reader for portfolio data.
Parses YAML frontmatter and markdown content from files.
"""
from datetime import date as date_type
from typing import Any, Dict

import yaml

from ..models.portfolio import (
    Bio,
    Education,
    Experience,
    Talk,
    Publication,
)
from ..services.content_repository import ContentRepository
from ..services.markdown_renderer import render_markdown


class MarkdownReader:
    """Reads and parses markdown files with YAML frontmatter."""

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
    def read_markdown_from_repository(
        repository: ContentRepository, relative_path: str
    ) -> tuple[Dict[str, Any], str]:
        """Read markdown content through the repository abstraction."""
        try:
            content = repository.read_text(relative_path)
            return MarkdownReader.parse_frontmatter(content)
        except FileNotFoundError:
            return {}, ""

    @staticmethod
    def load_bio_data(repository: ContentRepository) -> Bio:
        """Load bio data from markdown files."""
        bio_frontmatter, bio_content = MarkdownReader.read_markdown_from_repository(
            repository, "bio.md"
        )

        experience_frontmatter, _ = MarkdownReader.read_markdown_from_repository(
            repository, "experience.md"
        )

        education_frontmatter, _ = MarkdownReader.read_markdown_from_repository(
            repository, "education.md"
        )

        talks_frontmatter, _ = MarkdownReader.read_markdown_from_repository(
            repository, "talks.md"
        )

        publications_frontmatter, _ = MarkdownReader.read_markdown_from_repository(
            repository, "publications.md"
        )

        # Create experience objects
        experiences = []
        for exp_data in experience_frontmatter.get('experiences', []):
            end_date_value = exp_data.get('end_date')
            if end_date_value is None:
                parsed_end_date = None
            elif isinstance(end_date_value, date_type):
                parsed_end_date = end_date_value
            else:
                parsed_end_date = date_type.fromisoformat(end_date_value)

            description_markdown = exp_data.get("description", "")
            experiences.append(Experience(
                id=exp_data['id'],
                company=exp_data['company'],
                position=exp_data['position'],
                start_date=exp_data['start_date'] if isinstance(exp_data['start_date'], date_type) else date_type.fromisoformat(exp_data['start_date']),
                end_date=parsed_end_date,
                description=description_markdown,
                description_html=render_markdown(description_markdown),
                technologies=exp_data.get('technologies', [])
            ))

        # Create education objects
        educations = []
        for edu_data in education_frontmatter.get('education', []):
            end_date_value = edu_data.get('end_date')
            if end_date_value is None:
                parsed_end_date = None
            elif isinstance(end_date_value, date_type):
                parsed_end_date = end_date_value
            else:
                parsed_end_date = date_type.fromisoformat(end_date_value)

            educations.append(Education(
                id=edu_data['id'],
                institution=edu_data['institution'],
                degree=edu_data['degree'],
                field_of_study=edu_data['field_of_study'],
                start_date=edu_data['start_date'] if isinstance(edu_data['start_date'], date_type) else date_type.fromisoformat(edu_data['start_date']),
                end_date=parsed_end_date
            ))

        # Create talks objects
        talks = []
        for talk_data in talks_frontmatter.get('talks', []):
            talk_date = talk_data.get('date')
            if isinstance(talk_date, date_type):
                parsed_talk_date = talk_date
            else:
                parsed_talk_date = date_type.fromisoformat(talk_date)

            description_md = talk_data.get('description')
            talks.append(
                Talk(
                    id=talk_data['id'],
                    title=talk_data['title'],
                    event=talk_data.get('event', ''),
                    date=parsed_talk_date,
                    location=talk_data.get('location'),
                    link=talk_data.get('link'),
                    video_url=talk_data.get('video_url'),
                    description=description_md,
                    description_html=render_markdown(description_md) if description_md else None,
                )
            )

        # Create publications objects
        publications = []
        for pub_data in publications_frontmatter.get('publications', []):
            pub_date = pub_data.get('date')
            if isinstance(pub_date, date_type):
                parsed_pub_date = pub_date
            else:
                parsed_pub_date = date_type.fromisoformat(pub_date)

            summary_md = pub_data.get('summary')
            publications.append(
                Publication(
                    id=pub_data['id'],
                    title=pub_data['title'],
                    venue=pub_data.get('venue', ''),
                    date=parsed_pub_date,
                    authors=pub_data.get('authors', []),
                    url=pub_data.get('url'),
                    summary=summary_md,
                    summary_html=render_markdown(summary_md) if summary_md else None,
                )
            )

        # Create bio object
        bio = Bio(
            name=bio_frontmatter.get('name', ''),
            title=bio_frontmatter.get('title', ''),
            summary=bio_frontmatter.get('summary', ''),
            about=bio_content,
            experience=experiences,
            education=educations,
            talks=talks,
            publications=publications,
        )

        return bio
