"""Exceptions package — Centralized error handling for the Cosmos Platform."""

from app.exceptions.handlers import register_exception_handlers

__all__ = ["register_exception_handlers"]
