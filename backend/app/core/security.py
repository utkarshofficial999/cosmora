"""Cosmos Platform — Security Utilities.

Provides password hashing, strength validation, and JWT token management.
"""

from datetime import datetime, timedelta, timezone
import re
import uuid
from typing import Any

import jwt
from passlib.context import CryptContext

from app.config.settings import get_settings
from app.exceptions.auth import InvalidTokenError, TokenExpiredError, PasswordValidationError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> None:
    """Validate that a password meets complexity requirements.

    Requirements:
      - Minimum 8 characters long
      - At least 1 uppercase letter
      - At least 1 lowercase letter
      - At least 1 digit
      - At least 1 special character
    """
    if len(password) < 8:
        raise PasswordValidationError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise PasswordValidationError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise PasswordValidationError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise PasswordValidationError("Password must contain at least one digit.")
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]", password):
        raise PasswordValidationError(
            "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)."
        )


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode.update(
        {
            "exp": expire,
            "iat": now,
            "type": "access",
        }
    )
    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """Create a JWT refresh token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.refresh_token_expire_days)

    to_encode.update(
        {
            "exp": expire,
            "iat": now,
            "type": "refresh",
            "jti": str(uuid.uuid4()),
        }
    )
    return jwt.encode(
        to_encode,
        settings.jwt_refresh_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_token(
    token: str,
    secret_key: str | None = None,
    expected_type: str = "access",
) -> dict[str, Any]:
    """Decode and validate a JWT token."""
    if secret_key is None:
        secret_key = (
            settings.jwt_secret_key
            if expected_type == "access"
            else settings.jwt_refresh_secret_key
        )

    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        token_type = payload.get("type")
        if token_type != expected_type:
            raise InvalidTokenError(
                f"Invalid token type. Expected '{expected_type}', got '{token_type}'."
            )
        return payload
    except jwt.ExpiredSignatureError as err:
        raise TokenExpiredError("Token has expired.") from err
    except jwt.PyJWTError as err:
        raise InvalidTokenError("Invalid token format or signature.") from err
