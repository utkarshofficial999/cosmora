"""Cosmos Platform — Story Tag Schemas.

Defines Pydantic v2 schemas for Story Tags.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class TagCreate(BaseModel):
    """Schema for creating a new StoryTag."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Tag name",
        json_schema_extra={"example": "Mars"},
    )
    slug: str | None = Field(None, max_length=60, description="Custom slug")


class TagResponse(BaseModel):
    """Schema for StoryTag API response."""

    id: UUID
    name: str
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
