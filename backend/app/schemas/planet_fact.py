"""Cosmos Platform — PlanetFact Schemas.

Defines Pydantic v2 schemas for Planet Facts.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class PlanetFactBase(BaseModel):
    """Base PlanetFact schema attributes."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Title of the fact",
        json_schema_extra={"example": "The Red Planet"},
    )
    description: str = Field(
        ...,
        min_length=1,
        description="Detailed text explanation of the fact",
        json_schema_extra={"example": "Mars gets its reddish color from iron oxide (rust) on its surface."},
    )
    display_order: int = Field(
        0,
        description="Display sorting order priority",
        json_schema_extra={"example": 1},
    )


class PlanetFactCreate(PlanetFactBase):
    """Schema for creating a new PlanetFact."""

    planet_id: UUID = Field(..., description="ID of the parent planet")


class PlanetFactUpdate(BaseModel):
    """Schema for updating an existing PlanetFact."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None, min_length=1)
    display_order: int | None = Field(None)


class PlanetFactResponse(PlanetFactBase):
    """Schema for PlanetFact API response."""

    id: UUID
    planet_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
