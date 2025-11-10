"""
Markdown content reader for portfolio data.
Parses YAML frontmatter and markdown content from files.
"""
import yaml
import os
from datetime import date
from typing import Dict, List, Any, Optional
from ..models.portfolio import Bio, Contact, Skill, Experience, Education


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
    def read_markdown_file(filepath: str) -> tuple[Dict[str, Any], str]:
        """Read and parse a markdown file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            return MarkdownReader.parse_frontmatter(content)
        except FileNotFoundError:
            return {}, ""

    @staticmethod
    def load_bio_data(markdown_dir: str) -> Bio:
        """Load bio data from markdown files."""
        # Load bio info
        bio_frontmatter, bio_content = MarkdownReader.read_markdown_file(
            os.path.join(markdown_dir, 'bio.md')
        )

        # Load contact info
        contact_frontmatter, _ = MarkdownReader.read_markdown_file(
            os.path.join(markdown_dir, 'contact.md')
        )

        # Load skills
        skills_frontmatter, _ = MarkdownReader.read_markdown_file(
            os.path.join(markdown_dir, 'skills.md')
        )

        # Load experience
        experience_frontmatter, _ = MarkdownReader.read_markdown_file(
            os.path.join(markdown_dir, 'experience.md')
        )

        # Load education
        education_frontmatter, _ = MarkdownReader.read_markdown_file(
            os.path.join(markdown_dir, 'education.md')
        )

        # Create contact object
        contact = Contact(
            email=contact_frontmatter.get('email', ''),
            linkedin=contact_frontmatter.get('linkedin', ''),
            github=contact_frontmatter.get('github', ''),
            location=contact_frontmatter.get('location', '')
        )

        # Create skills objects
        skills = []
        for skill_data in skills_frontmatter.get('skills', []):
            skills.append(Skill(
                name=skill_data['name'],
                category=skill_data['category'],
                proficiency=skill_data['proficiency']
            ))

        # Create experience objects
        experiences = []
        for exp_data in experience_frontmatter.get('experiences', []):
            end_date_value = exp_data.get('end_date')
            if end_date_value is None:
                parsed_end_date = None
            elif isinstance(end_date_value, date):
                parsed_end_date = end_date_value
            else:
                parsed_end_date = date.fromisoformat(end_date_value)

            experiences.append(Experience(
                id=exp_data['id'],
                company=exp_data['company'],
                position=exp_data['position'],
                start_date=exp_data['start_date'] if isinstance(exp_data['start_date'], date) else date.fromisoformat(exp_data['start_date']),
                end_date=parsed_end_date,
                description=exp_data['description'],
                technologies=exp_data.get('technologies', [])
            ))

        # Create education objects
        educations = []
        for edu_data in education_frontmatter.get('education', []):
            end_date_value = edu_data.get('end_date')
            if end_date_value is None:
                parsed_end_date = None
            elif isinstance(end_date_value, date):
                parsed_end_date = end_date_value
            else:
                parsed_end_date = date.fromisoformat(end_date_value)

            educations.append(Education(
                id=edu_data['id'],
                institution=edu_data['institution'],
                degree=edu_data['degree'],
                field_of_study=edu_data['field_of_study'],
                start_date=edu_data['start_date'] if isinstance(edu_data['start_date'], date) else date.fromisoformat(edu_data['start_date']),
                end_date=parsed_end_date
            ))

        # Create bio object
        bio = Bio(
            name=bio_frontmatter.get('name', ''),
            title=bio_frontmatter.get('title', ''),
            summary=bio_frontmatter.get('summary', ''),
            about=bio_content,
            contact=contact,
            skills=skills,
            experience=experiences,
            education=educations,
            projects=[]  # No projects as per requirements
        )

        return bio
