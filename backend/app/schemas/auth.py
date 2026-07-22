"""Cosmos Platform — Authentication Schemas.

Pydantic models for authentication requests, token responses, and payload structures.
"""

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Payload for user login using email or username."""

    username: str = Field(
        ...,
        description="User email or username.",
        examples=["stargazer", "explorer@cosmos.org"],
    )
    password: str = Field(..., examples=["SecureP@ss123"])


class Token(BaseModel):
    """OAuth2 compatible token response."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")


class RefreshTokenRequest(BaseModel):
    """Payload for refreshing an access token."""

    refresh_token: str = Field(..., description="Valid JWT refresh token")


class TokenPayload(BaseModel):
    """Decoded JWT payload data."""

    sub: str | None = None
    email: str | None = None
    role: str | None = None
    exp: int | None = None
    type: str | None = None


class MessageResponse(BaseModel):
    """Generic message response."""

    message: str = Field(..., examples=["Operation completed successfully."])
