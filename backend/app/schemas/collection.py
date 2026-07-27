"""Cosmos Platform — Collection Schemas.

Defines Pydantic v2 schemas for User Collections and Collection Items.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class CollectionItemCreate(BaseModel):
    """Schema for adding an item to a collection."""

    resource_type: str = Field(..., min_length=1, max_length=50, description="Resource type (Story, Planet, Mission, etc.)")
    resource_id: str = Field(..., min_length=1, max_length=255, description="Resource ID or slug")
    display_order: int = Field(0, ge=0, description="Display sorting order")


class CollectionItemResponse(BaseModel):
    """Schema for CollectionItem API response."""

    id: UUID
    collection_id: UUID
    resource_type: str
    resource_id: str
    display_order: int
    title: str | None = None
    cover_image: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CollectionBase(BaseModel):
    """Base Collection schema attributes."""

    title: str = Field(..., min_length=1, max_length=255, description="Collection title", json_schema_extra={"example": "My Lunar Missions"})
    description: str | None = Field(None, description="Collection description")
    is_public: bool = Field(True, description="Public visibility flag")
    cover_image: str | None = Field(None, max_length=512, description="Cover image URL")


class CollectionCreate(CollectionBase):
    """Schema for creating a new Collection."""

    items: list[CollectionItemCreate] = Field(default_factory=list, description="Initial items to add")


class CollectionUpdate(BaseModel):
    """Schema for updating an existing Collection."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None)
    is_public: bool | None = Field(None)
    cover_image: str | None = Field(None, max_length=512)


class CollectionResponse(CollectionBase):
    """Schema for Collection API response."""

    id: UUID
    user_id: UUID
    items: list[CollectionItemResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CollectionListResponse(BaseModel):
    """Paginated list response for Collections."""

    items: list[CollectionResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
