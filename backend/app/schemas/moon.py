"""Cosmos Platform — Moon Schemas.

Defines Pydantic v2 schemas for Moon requests and responses.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class MoonBase(BaseModel):
    """Base Moon schema attributes."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name of the moon",
        json_schema_extra={"example": "Europa"},
    )
    diameter: float | None = Field(
        None,
        description="Diameter in kilometers",
        json_schema_extra={"example": 3121.6},
    )
    orbital_period: float | None = Field(
        None,
        description="Orbital period in Earth days",
        json_schema_extra={"example": 3.55},
    )
    description: str | None = Field(
        None,
        description="Description of the moon",
        json_schema_extra={"example": "An icy moon of Jupiter with a subsurface ocean."},
    )
    image_url: str | None = Field(
        None,
        max_length=512,
        description="Image URL for the moon",
        json_schema_extra={"example": "https://assets.cosmora.org/moons/europa.jpg"},
    )


class MoonCreate(MoonBase):
    """Schema for creating a new Moon."""

    planet_id: UUID = Field(..., description="ID of the parent planet")
    slug: str | None = Field(
        None,
        max_length=120,
        description="Optional custom slug; generated from name if omitted",
        json_schema_extra={"example": "europa"},
    )


class MoonUpdate(BaseModel):
    """Schema for updating an existing Moon."""

    planet_id: UUID | None = Field(None)
    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, max_length=120)
    diameter: float | None = Field(None)
    orbital_period: float | None = Field(None)
    description: str | None = Field(None)
    image_url: str | None = Field(None, max_length=512)


class MoonResponse(MoonBase):
    """Schema for Moon API response."""

    id: UUID
    planet_id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MoonListResponse(BaseModel):
    """Paginated list response for Moons."""

    items: list[MoonResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
