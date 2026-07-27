"""Cosmos Platform — Story Chapter Schemas.

Defines Pydantic v2 schemas for Story Chapters.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ChapterBase(BaseModel):
    """Base StoryChapter schema attributes."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Chapter title",
        json_schema_extra={"example": "The Red Planet Beckons"},
    )
    chapter_number: int = Field(1, ge=1, description="Chapter sequence order number")
    content: str = Field(..., min_length=1, description="Markdown body content of chapter")
    estimated_read_time: int = Field(3, ge=1, description="Estimated reading time in minutes")


class ChapterCreate(ChapterBase):
    """Schema for creating a new StoryChapter."""

    story_id: UUID | None = Field(None, description="Optional parent story ID")


class ChapterUpdate(BaseModel):
    """Schema for updating an existing StoryChapter."""

    title: str | None = Field(None, min_length=1, max_length=255)
    chapter_number: int | None = Field(None, ge=1)
    content: str | None = Field(None, min_length=1)
    estimated_read_time: int | None = Field(None, ge=1)


class ChapterResponse(ChapterBase):
    """Schema for StoryChapter API response."""

    id: UUID
    story_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
