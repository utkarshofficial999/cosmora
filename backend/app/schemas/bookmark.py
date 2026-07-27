"""Cosmos Platform — Bookmark Schemas.

Defines Pydantic v2 schemas for User Bookmarks.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class BookmarkCreate(BaseModel):
    """Schema for creating a new user bookmark."""

    resource_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Type of resource (Story, Timeline Event, Planet, Moon, Mission, Agency)",
        json_schema_extra={"example": "Planet"},
    )
    resource_id: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Resource UUID primary key or unique slug",
        json_schema_extra={"example": "mars"},
    )


class BookmarkResponse(BaseModel):
    """Schema for Bookmark API response."""

    id: UUID
    user_id: UUID
    resource_type: str
    resource_id: str
    title: str | None = None
    cover_image: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
