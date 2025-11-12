"""
Utility helpers for rendering markdown to sanitized HTML.
"""
from functools import lru_cache
from typing import Iterable

import bleach
from markdown_it import MarkdownIt
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_plugins.tasklists import tasklists_plugin


def _build_renderer() -> MarkdownIt:
    return (
        MarkdownIt("commonmark", {"html": False, "linkify": True, "typographer": True})
        .enable("table")
        .enable("strikethrough")
        .use(footnote_plugin)
        .use(tasklists_plugin)
    )


@lru_cache
def _renderer() -> MarkdownIt:
    return _build_renderer()


ALLOWED_TAGS: Iterable[str] = bleach.sanitizer.ALLOWED_TAGS.union(
    {
        "p",
        "pre",
        "code",
        "hr",
        "span",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "ul",
        "ol",
        "li",
        "strong",
        "em",
        "img",
    }
)

ALLOWED_ATTRIBUTES = {
    **bleach.sanitizer.ALLOWED_ATTRIBUTES,
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title"],
    "code": ["class"],
    "pre": ["class"],
    "span": ["class"],
}

ALLOWED_PROTOCOLS = tuple(bleach.sanitizer.ALLOWED_PROTOCOLS) + ("mailto",)


def render_markdown(markdown_text: str) -> str:
    """Render markdown text into sanitized HTML."""
    html = _renderer().render(markdown_text)
    cleaned = bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
    )
    return cleaned
