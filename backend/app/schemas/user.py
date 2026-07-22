"""Cosmos Platform — User Schemas.

Pydantic models for User registration, profile management, and password update.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.role import RoleResponse


class UserBase(BaseModel):
    """Base fields for User models."""

    email: EmailStr = Field(..., examples=["explorer@cosmos.org"])
    username: str = Field(..., min_length=3, max_length=50, examples=["stargazer"])
    first_name: str | None = Field(default=None, max_length=50, examples=["Neil"])
    last_name: str | None = Field(default=None, max_length=50, examples=["Armstrong"])


class UserCreate(UserBase):
    """Schema for registering a new user."""

    password: str = Field(
        ...,
        min_length=8,
        description="Must be at least 8 chars long with uppercase, lowercase, digit, and special char.",
        examples=["SecureP@ss123"],
    )
    role_name: str = Field(
        default="Customer",
        description="Role name for the new user (Customer, Seller, Admin).",
        examples=["Customer"],
    )


class UserUpdate(BaseModel):
    """Schema for updating user profile info."""

    first_name: str | None = Field(default=None, max_length=50, examples=["Neil"])
    last_name: str | None = Field(default=None, max_length=50, examples=["Armstrong"])


class ChangePasswordRequest(BaseModel):
    """Schema for updating user password."""

    current_password: str = Field(..., min_length=1, examples=["CurrentP@ss123"])
    new_password: str = Field(
        ...,
        min_length=8,
        description="Must meet complexity rules (8+ chars, upper, lower, digit, special char).",
        examples=["NewSecureP@ss456"],
    )


class UserResponse(UserBase):
    """Response model representing user profile details."""

    id: UUID
    is_active: bool
    is_superuser: bool
    role: RoleResponse
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
