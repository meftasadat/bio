"""
Application configuration utilities.
"""
from functools import lru_cache
from pathlib import Path
from typing import List
import os

from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Typed application settings loaded from environment variables."""

    app_name: str = "Mefta Sadat - Professional Bio"
    description: str = (
        "Professional portfolio website for Mefta Sadat powered by FastAPI"
    )
    version: str = "1.0.0"

    cors_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
        ]
    )

    content_source: str = Field(
        default=os.getenv("CONTENT_SOURCE", "local"),
        description="Where markdown content is loaded from (local or github).",
    )
    content_refresh_interval_seconds: int = Field(
        default=int(os.getenv("CONTENT_REFRESH_INTERVAL_SECONDS", "60")),
        description="Minimum seconds between remote content revalidation checks.",
    )
    local_content_path: Path = Field(
        default=Path(
            os.getenv(
                "CONTENT_LOCAL_PATH",
                str(Path(__file__).resolve().parent.parent / "content" / "markdown"),
            )
        )
    )

    github_repo: str | None = Field(
        default=os.getenv("CONTENT_GITHUB_REPO"),
        description="GitHub repo in the format owner/name containing markdown files.",
    )
    github_branch: str = Field(
        default=os.getenv("CONTENT_GITHUB_BRANCH", "main"),
        description="Branch that hosts markdown files.",
    )
    github_subdir: str = Field(
        default=os.getenv("CONTENT_GITHUB_SUBDIR", "backend/app/content/markdown"),
        description="Subdirectory inside the repo that contains markdown files.",
    )
    github_token: str | None = Field(
        default=os.getenv("CONTENT_GITHUB_TOKEN"),
        description="Optional GitHub token for private repos or higher rate limits.",
    )

    reload_token: str | None = Field(
        default=os.getenv("CONTENT_RELOAD_TOKEN"),
        description="Optional secret token used to force content cache refreshes.",
    )


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()
