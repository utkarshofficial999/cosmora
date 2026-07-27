"""Cosmos Platform — Story Schemas.

Defines Pydantic v2 schemas for Stories.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.category import CategoryResponse
from app.schemas.chapter import ChapterResponse
from app.schemas.tag import TagResponse


class StoryBase(BaseModel):
    """Base Story schema attributes."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Story title",
        json_schema_extra={"example": "The Journey of Chandrayaan-3"},
    )
    category_id: UUID | None = Field(None, description="Category ID")
    summary: str | None = Field(None, description="Short executive summary")
    content: str = Field(..., min_length=1, description="Full story content in Markdown format")
    cover_image: str | None = Field(None, max_length=512, description="Cover image URL")
    estimated_read_time: int = Field(5, ge=1, description="Estimated total reading time in minutes")
    author: str | None = Field(None, max_length=100, description="Author or curator name")
    source: str | None = Field(None, max_length=255, description="Attribution source")
    language: str = Field("en", max_length=10, description="ISO language code")
    difficulty: str = Field(
        "Intermediate",
        max_length=30,
        description="Target audience difficulty level (Beginner, Intermediate, Advanced)",
        json_schema_extra={"example": "Beginner"},
    )
    story_type: str = Field(
        "General",
        max_length=50,
        description="Story classification (History, Exploration, Discovery, Mission, Planet)",
        json_schema_extra={"example": "Exploration"},
    )
    status: str = Field(
        "Draft",
        max_length=30,
        description="Publication status (Draft, Published, Archived)",
        json_schema_extra={"example": "Published"},
    )
    is_featured: bool = Field(False, description="Featured highlight flag")


class StoryCreate(StoryBase):
    """Schema for creating a new Story."""

    slug: str | None = Field(None, max_length=255, description="Custom slug")
    tag_ids: list[UUID] = Field(default_factory=list, description="IDs of tags to attach")


class StoryUpdate(BaseModel):
    """Schema for updating an existing Story."""

    category_id: UUID | None = Field(None)
    title: str | None = Field(None, min_length=1, max_length=255)
    slug: str | None = Field(None, max_length=255)
    summary: str | None = Field(None)
    content: str | None = Field(None, min_length=1)
    cover_image: str | None = Field(None, max_length=512)
    estimated_read_time: int | None = Field(None, ge=1)
    author: str | None = Field(None, max_length=100)
    source: str | None = Field(None, max_length=255)
    language: str | None = Field(None, max_length=10)
    difficulty: str | None = Field(None, max_length=30)
    story_type: str | None = Field(None, max_length=50)
    status: str | None = Field(None, max_length=30)
    is_featured: bool | None = Field(None)
    tag_ids: list[UUID] | None = Field(None)


class StoryResponse(StoryBase):
    """Schema for Story API response."""

    id: UUID
    slug: str
    view_count: int
    published_at: datetime | None = None
    category: CategoryResponse | None = None
    tags: list[TagResponse] = []
    chapters: list[ChapterResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StoryListResponse(BaseModel):
    """Paginated list response for Stories."""

    items: list[StoryResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
