"""Cosmos Platform — Timeline Event Schemas.

Defines Pydantic v2 schemas for Timeline events and associated media attachments.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.era import EraResponse


class EventMediaCreate(BaseModel):
    """Schema for adding media attachment to a timeline event."""

    media_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Media type (image, video, 3d_model, audio)",
        json_schema_extra={"example": "image"},
    )
    url: str = Field(
        ...,
        min_length=1,
        max_length=512,
        description="Direct URL to media resource",
        json_schema_extra={"example": "https://assets.cosmora.org/images/apollo11.jpg"},
    )
    caption: str | None = Field(
        None,
        max_length=255,
        description="Optional image/video caption",
        json_schema_extra={"example": "Buzz Aldrin on the Moon"},
    )


class EventMediaResponse(BaseModel):
    """Schema for Event Media API response."""

    id: UUID
    timeline_event_id: UUID
    media_type: str
    url: str
    caption: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TimelineBase(BaseModel):
    """Base attributes for Timeline events."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Title of the timeline event",
        json_schema_extra={"example": "Apollo 11 Moon Landing"},
    )
    short_description: str | None = Field(
        None,
        description="Brief summary of the event",
        json_schema_extra={"example": "First humans land on the Moon."},
    )
    content: str = Field(..., min_length=1, description="Detailed narrative and historical content about the event")
    event_date: str | None = Field(
        None,
        max_length=100,
        description="Exact or display date string",
        json_schema_extra={"example": "July 20, 1969"},
    )
    year: int = Field(
        ...,
        description="Calender year of the event (can be negative for ancient times)",
        json_schema_extra={"example": 1969},
    )
    importance: int = Field(
        1,
        ge=1,
        le=5,
        description="Historical significance scale (1=Minor, 5=Pivotal)",
        json_schema_extra={"example": 5},
    )
    image_url: str | None = Field(None, max_length=512, description="Primary cover image URL")
    thumbnail: str | None = Field(None, max_length=512, description="Thumbnail image URL")
    era_id: UUID = Field(..., description="ID of the parent Era")
    is_featured: bool = Field(False, description="Flag indicating if the event should be highlighted on the homepage/timeline")


class TimelineCreate(TimelineBase):
    """Schema for creating a new Timeline Event."""

    slug: str | None = Field(
        None,
        max_length=255,
        description="Optional custom slug; generated from title if omitted",
        json_schema_extra={"example": "apollo-11-moon-landing"},
    )
    media: list[EventMediaCreate] | None = Field(default=[], description="Optional list of media items to attach")


class TimelineUpdate(BaseModel):
    """Schema for updating an existing Timeline Event."""

    title: str | None = Field(None, min_length=1, max_length=255)
    slug: str | None = Field(None, max_length=255)
    short_description: str | None = Field(None)
    content: str | None = Field(None, min_length=1)
    event_date: str | None = Field(None, max_length=100)
    year: int | None = Field(None)
    importance: int | None = Field(None, ge=1, le=5)
    image_url: str | None = Field(None, max_length=512)
    thumbnail: str | None = Field(None, max_length=512)
    era_id: UUID | None = Field(None)
    is_featured: bool | None = Field(None)


class TimelineResponse(TimelineBase):
    """Schema for Timeline Event API response."""

    id: UUID
    slug: str
    era: EraResponse | None = None
    media: list[EventMediaResponse] = []
    created_by: UUID | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TimelineListResponse(BaseModel):
    """Paginated list response for Timeline Events."""

    items: list[TimelineResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
