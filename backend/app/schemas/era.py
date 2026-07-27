"""Cosmos Platform — Era Schemas.

Defines Pydantic v2 schemas for Era requests and responses.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class EraBase(BaseModel):
    """Base Era schema attributes."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name of the space era",
        json_schema_extra={"example": "Space Race"},
    )
    description: str | None = Field(
        None,
        description="Detailed description of the era",
        json_schema_extra={"example": "Period of intense space competition between USA and USSR."},
    )
    start_year: int | None = Field(
        None,
        description="Start year of the era (can be negative for BCE/ancient times)",
        json_schema_extra={"example": 1955},
    )
    end_year: int | None = Field(
        None,
        description="End year of the era",
        json_schema_extra={"example": 1975},
    )
    color: str | None = Field(
        None,
        max_length=50,
        description="Display theme hex code or color name",
        json_schema_extra={"example": "#FF5733"},
    )


class EraCreate(EraBase):
    """Schema for creating a new Era."""

    slug: str | None = Field(
        None,
        max_length=120,
        description="Optional custom slug; generated from name if omitted",
        json_schema_extra={"example": "space-race"},
    )


class EraUpdate(BaseModel):
    """Schema for updating an existing Era."""

    name: str | None = Field(None, min_length=1, max_length=100, description="Updated era name")
    slug: str | None = Field(None, max_length=120, description="Updated era slug")
    description: str | None = Field(None, description="Updated era description")
    start_year: int | None = Field(None, description="Updated start year")
    end_year: int | None = Field(None, description="Updated end year")
    color: str | None = Field(None, max_length=50, description="Updated theme color")


class EraResponse(EraBase):
    """Schema for Era API response."""

    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EraListResponse(BaseModel):
    """Paginated list response for Eras."""

    items: list[EraResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
