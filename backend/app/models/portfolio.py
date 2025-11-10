"""
Portfolio data models using Pydantic.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date


class Skill(BaseModel):
    """Skill model."""
    name: str = Field(..., description="Skill name")
    category: str = Field(..., description="Skill category (e.g., 'Programming', 'Tools', 'Soft Skills')")
    proficiency: int = Field(..., ge=1, le=5, description="Proficiency level (1-5)")


class Experience(BaseModel):
    """Work experience model."""
    id: str = Field(..., description="Unique experience identifier")
    company: str = Field(..., description="Company name")
    position: str = Field(..., description="Job position/title")
    start_date: date = Field(..., description="Start date")
    end_date: Optional[date] = Field(None, description="End date (None for current position)")
    description: str = Field(..., description="Job description")
    technologies: List[str] = Field(default_factory=list, description="Technologies used")


class Education(BaseModel):
    """Education model."""
    id: str = Field(..., description="Unique education identifier")
    institution: str = Field(..., description="Institution name")
    degree: str = Field(..., description="Degree obtained")
    field_of_study: str = Field(..., description="Field of study")
    start_date: date = Field(..., description="Start date")
    end_date: Optional[date] = Field(None, description="End date")
    gpa: Optional[float] = Field(None, description="GPA (if applicable)")


class Contact(BaseModel):
    """Contact information model."""
    email: str = Field(..., description="Email address")
    linkedin: Optional[str] = Field(None, description="LinkedIn profile URL")
    github: Optional[str] = Field(None, description="GitHub profile URL")
    twitter: Optional[str] = Field(None, description="Twitter profile URL")
    location: str = Field(..., description="Location")


class Bio(BaseModel):
    """Bio/About information model."""
    name: str = Field(..., description="Full name")
    title: str = Field(..., description="Professional title")
    summary: str = Field(..., description="Professional summary")
    about: str = Field(..., description="Detailed about section")
    contact: Contact = Field(..., description="Contact information")
    skills: List[Skill] = Field(default_factory=list, description="Skills list")
    experience: List[Experience] = Field(default_factory=list, description="Work experience")
    education: List[Education] = Field(default_factory=list, description="Education history")
