"""Exceptions package — Centralized error handling for the Cosmos Platform."""

from app.exceptions.handlers import register_exception_handlers
from app.exceptions.auth import (
    AuthBaseException,
    AuthenticationError,
    PermissionDeniedError,
    InvalidTokenError,
    TokenExpiredError,
    UserAlreadyExistsError,
    RoleNotFoundError,
    PasswordValidationError,
)

__all__ = [
    "register_exception_handlers",
    "AuthBaseException",
    "AuthenticationError",
    "PermissionDeniedError",
    "InvalidTokenError",
    "TokenExpiredError",
    "UserAlreadyExistsError",
    "RoleNotFoundError",
    "PasswordValidationError",
]

