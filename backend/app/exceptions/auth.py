"""Cosmos Platform — Custom Authentication & Authorization Exceptions.

Provides specific exceptions for auth failures, token validation,
and permission enforcement.
"""

from fastapi import status


class AuthBaseException(Exception):
    """Base exception for authentication and authorization errors."""

    def __init__(
        self,
        detail: str = "Authentication error",
        status_code: int = status.HTTP_401_UNAUTHORIZED,
    ) -> None:
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class AuthenticationError(AuthBaseException):
    """Raised when authentication fails (invalid credentials, inactive account)."""

    def __init__(self, detail: str = "Invalid email/username or password") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class PermissionDeniedError(AuthBaseException):
    """Raised when a user lacks permission for an action."""

    def __init__(self, detail: str = "Permission denied") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)


class InvalidTokenError(AuthBaseException):
    """Raised when a token is malformed, invalid, or forged."""

    def __init__(self, detail: str = "Could not validate credentials") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class TokenExpiredError(AuthBaseException):
    """Raised when a JWT token signature has expired."""

    def __init__(self, detail: str = "Token has expired") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class UserAlreadyExistsError(AuthBaseException):
    """Raised when registering a user with an existing email or username."""

    def __init__(self, detail: str = "User with this email or username already exists") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


class RoleNotFoundError(AuthBaseException):
    """Raised when a specified role does not exist."""

    def __init__(self, detail: str = "Role not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class PasswordValidationError(AuthBaseException):
    """Raised when a password fails policy validation requirements."""

    def __init__(self, detail: str = "Password does not meet complexity requirements") -> None:
        super().__init__(detail=detail, status_code=422)

