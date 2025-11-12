"""
Content repository responsible for retrieving markdown files from local disk or GitHub.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List
import time

import httpx

from ..core.config import Settings


@dataclass
class CachedFile:
    """Cached file metadata."""

    content: str
    etag: str | None = None
    mtime: float | None = None
    last_checked: float = time.time()


@dataclass
class CachedDirectory:
    """Cached directory listing metadata."""

    files: List[str]
    etag: str | None = None
    last_checked: float = time.time()


class ContentRepository:
    """Repository that abstracts markdown retrieval and caching."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.source = (settings.content_source or "local").lower()
        if self.source not in {"local", "github"}:
            raise ValueError("CONTENT_SOURCE must be 'local' or 'github'.")
        self._file_cache: Dict[str, CachedFile] = {}
        self._dir_cache: Dict[str, CachedDirectory] = {}
        self._client = httpx.Client(timeout=10)

    def read_text(self, relative_path: str) -> str:
        """Read markdown text for the provided relative path."""
        normalized_path = self._normalize_relative_path(relative_path)
        if self.source == "github":
            return self._read_text_from_github(normalized_path)
        return self._read_text_from_disk(normalized_path)

    def list_markdown_files(self, relative_dir: str) -> List[str]:
        """List markdown file names inside the provided directory."""
        normalized_dir = self._normalize_relative_path(relative_dir, allow_directory=True)
        if self.source == "github":
            return self._list_files_from_github(normalized_dir)
        return self._list_files_from_disk(normalized_dir)

    def clear_cache(self) -> None:
        """Clear cached file and directory metadata."""
        self._file_cache.clear()
        self._dir_cache.clear()
        self._client.close()
        self._client = httpx.Client(timeout=10)

    # Internal helpers -----------------------------------------------------

    def _normalize_relative_path(
        self, relative_path: str, allow_directory: bool = False
    ) -> str:
        sanitized = relative_path.strip().lstrip("/")
        if ".." in Path(sanitized).parts:
            raise ValueError("Relative paths cannot traverse directories.")
        if not sanitized and not allow_directory:
            raise ValueError("A file path must be provided.")
        return sanitized

    # Local filesystem operations -----------------------------------------

    def _read_text_from_disk(self, relative_path: str) -> str:
        base_path = self.settings.local_content_path
        full_path = (base_path / relative_path).resolve()
        if not str(full_path).startswith(str(base_path.resolve())):
            raise FileNotFoundError("Access outside of content directory is forbidden.")

        cached = self._file_cache.get(relative_path)
        mtime = full_path.stat().st_mtime if full_path.exists() else None
        if cached and mtime and cached.mtime == mtime:
            return cached.content

        content = full_path.read_text(encoding="utf-8")
        self._file_cache[relative_path] = CachedFile(
            content=content, mtime=mtime, last_checked=time.time()
        )
        return content

    def _list_files_from_disk(self, relative_dir: str) -> List[str]:
        base_path = self.settings.local_content_path
        directory = (base_path / relative_dir).resolve()
        if not directory.exists():
            return []
        if not str(directory).startswith(str(base_path.resolve())):
            raise FileNotFoundError("Access outside of content directory is forbidden.")

        files = [entry.name for entry in directory.iterdir() if entry.is_file()]
        return files

    # GitHub operations ----------------------------------------------------

    def _read_text_from_github(self, relative_path: str) -> str:
        cached = self._file_cache.get(relative_path)
        now = time.time()

        if cached and now - cached.last_checked < self.settings.content_refresh_interval_seconds:
            return cached.content

        headers = {}
        if cached and cached.etag:
            headers["If-None-Match"] = cached.etag

        url = self._github_raw_url(relative_path)
        response = self._client.get(url, headers=self._auth_headers(headers))

        if response.status_code == httpx.codes.NOT_MODIFIED and cached:
            cached.last_checked = now
            return cached.content

        response.raise_for_status()
        content = response.text
        etag = response.headers.get("ETag")

        self._file_cache[relative_path] = CachedFile(
            content=content,
            etag=etag,
            last_checked=now,
        )
        return content

    def _list_files_from_github(self, relative_dir: str) -> List[str]:
        cached = self._dir_cache.get(relative_dir)
        now = time.time()
        if cached and now - cached.last_checked < self.settings.content_refresh_interval_seconds:
            return cached.files

        headers = {}
        if cached and cached.etag:
            headers["If-None-Match"] = cached.etag

        url = self._github_api_url(relative_dir)
        response = self._client.get(url, headers=self._auth_headers(headers))
        if response.status_code == httpx.codes.NOT_MODIFIED and cached:
            cached.last_checked = now
            return cached.files

        response.raise_for_status()
        payload = response.json()
        files = [item["name"] for item in payload if item.get("type") == "file"]
        etag = response.headers.get("ETag")
        self._dir_cache[relative_dir] = CachedDirectory(
            files=files,
            etag=etag,
            last_checked=now,
        )
        return files

    def _github_raw_url(self, relative_path: str) -> str:
        repo = self.settings.github_repo
        if not repo:
            raise RuntimeError("CONTENT_GITHUB_REPO must be set when using GitHub source.")
        base = f"https://raw.githubusercontent.com/{repo}/{self.settings.github_branch}"
        return "/".join([base, self.settings.github_subdir.strip("/"), relative_path])

    def _github_api_url(self, relative_dir: str) -> str:
        repo = self.settings.github_repo
        if not repo:
            raise RuntimeError("CONTENT_GITHUB_REPO must be set when using GitHub source.")
        base = f"https://api.github.com/repos/{repo}/contents"
        path = "/".join([self.settings.github_subdir.strip("/"), relative_dir]).rstrip("/")
        return f"{base}/{path}?ref={self.settings.github_branch}"

    def _auth_headers(self, headers: Dict[str, str]) -> Dict[str, str]:
        combined = dict(headers)
        if self.settings.github_token:
            combined["Authorization"] = f"Bearer {self.settings.github_token}"
        combined["Accept"] = "application/vnd.github+json"
        return combined

    def __del__(self):
        try:
            self._client.close()
        except Exception:
            pass
