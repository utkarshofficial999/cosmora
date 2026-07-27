"""Cosmos Platform — Story Category Schemas.

Defines Pydantic v2 schemas for Story Categories.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    """Base StoryCategory schema attributes."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Category name",
        json_schema_extra={"example": "Space History"},
    )
    description: str | None = Field(None, description="Detailed category description")
    icon: str | None = Field(None, max_length=100, description="Category icon code")


class CategoryCreate(CategoryBase):
    """Schema for creating a new StoryCategory."""

    slug: str | None = Field(None, max_length=120, description="Custom slug")


class CategoryUpdate(BaseModel):
    """Schema for updating an existing StoryCategory."""

    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, max_length=120)
    description: str | None = Field(None)
    icon: str | None = Field(None, max_length=100)


class CategoryResponse(CategoryBase):
    """Schema for StoryCategory API response."""

    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
