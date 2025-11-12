"""
Shared content repository instance.
"""
from ..core.config import get_settings
from .content_repository import ContentRepository

content_repository = ContentRepository(settings=get_settings())
