"""Cosmos Platform — Reading Progress Schemas.

Defines Pydantic v2 schemas for User Reading Progress.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ProgressCreate(BaseModel):
    """Schema for recording or updating story reading progress."""

    last_chapter: int = Field(1, ge=1, description="Last chapter number read")
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0, description="Reading completion percentage")
    completed: bool = Field(False, description="Whether story reading is fully completed")


class ProgressResponse(BaseModel):
    """Schema for StoryProgress API response."""

    id: UUID
    user_id: UUID
    story_id: UUID
    last_chapter: int
    progress_percentage: float
    completed: bool
    last_read_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReadingHistoryResponse(BaseModel):
    """Schema for reading history and continue-reading lists."""

    progress: ProgressResponse
    story_title: str
    story_slug: str
    cover_image: str | None = None
    category_name: str | None = None
