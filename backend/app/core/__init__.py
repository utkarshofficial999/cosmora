"""Core package — cross-cutting concerns and shared utilities."""

from app.core.dependencies import get_db

__all__ = ["get_db"]
