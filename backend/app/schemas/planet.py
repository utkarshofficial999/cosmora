"""Cosmos Platform — Planet Schemas.

Defines Pydantic v2 schemas for Planet requests, responses, and full planet overview.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.moon import MoonResponse
from app.schemas.planet_fact import PlanetFactResponse


class PlanetBase(BaseModel):
    """Base Planet schema attributes."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name of the planet",
        json_schema_extra={"example": "Mars"},
    )
    description: str | None = Field(
        None,
        description="Detailed description of the planet",
        json_schema_extra={"example": "The fourth planet from the Sun and the second-smallest planet in the Solar System."},
    )
    diameter_km: float | None = Field(
        None,
        description="Equatorial diameter in kilometers",
        json_schema_extra={"example": 6779.0},
    )
    mass: str | None = Field(
        None,
        max_length=100,
        description="Mass representation",
        json_schema_extra={"example": "6.4171 × 10^23 kg"},
    )
    gravity: float | None = Field(
        None,
        description="Surface gravity in m/s²",
        json_schema_extra={"example": 3.721},
    )
    escape_velocity: float | None = Field(
        None,
        description="Escape velocity in km/s",
        json_schema_extra={"example": 5.027},
    )
    orbital_period: float | None = Field(
        None,
        description="Orbital period in Earth days",
        json_schema_extra={"example": 686.98},
    )
    rotation_period: float | None = Field(
        None,
        description="Rotation period in hours",
        json_schema_extra={"example": 24.62},
    )
    average_temperature: float | None = Field(
        None,
        description="Average temperature in °C",
        json_schema_extra={"example": -63.0},
    )
    distance_from_sun: float | None = Field(
        None,
        description="Distance from Sun in million kilometers",
        json_schema_extra={"example": 227.9},
    )
    number_of_moons: int = Field(
        0,
        ge=0,
        description="Number of known natural satellites",
        json_schema_extra={"example": 2},
    )
    atmosphere: str | None = Field(
        None,
        description="Atmospheric composition summary",
        json_schema_extra={"example": "95.32% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon"},
    )
    color: str | None = Field(
        None,
        max_length=50,
        description="Display theme color",
        json_schema_extra={"example": "#C1440E"},
    )
    image_url: str | None = Field(None, max_length=512, description="2D image URL")
    texture_url: str | None = Field(None, max_length=512, description="3D texture map URL")
    model_url: str | None = Field(None, max_length=512, description="3D glTF/GLB model URL")
    is_habitable: bool = Field(False, description="Flag indicating potential habitability")


class PlanetCreate(PlanetBase):
    """Schema for creating a new Planet."""

    slug: str | None = Field(
        None,
        max_length=120,
        description="Optional custom slug; generated from name if omitted",
        json_schema_extra={"example": "mars"},
    )


class PlanetUpdate(BaseModel):
    """Schema for updating an existing Planet."""

    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, max_length=120)
    description: str | None = Field(None)
    diameter_km: float | None = Field(None)
    mass: str | None = Field(None, max_length=100)
    gravity: float | None = Field(None)
    escape_velocity: float | None = Field(None)
    orbital_period: float | None = Field(None)
    rotation_period: float | None = Field(None)
    average_temperature: float | None = Field(None)
    distance_from_sun: float | None = Field(None)
    number_of_moons: int | None = Field(None, ge=0)
    atmosphere: str | None = Field(None)
    color: str | None = Field(None, max_length=50)
    image_url: str | None = Field(None, max_length=512)
    texture_url: str | None = Field(None, max_length=512)
    model_url: str | None = Field(None, max_length=512)
    is_habitable: bool | None = Field(None)


class PlanetResponse(PlanetBase):
    """Schema for Planet API response."""

    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PlanetListResponse(BaseModel):
    """Paginated list response for Planets."""

    items: list[PlanetResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")


class PlanetOverviewResponse(BaseModel):
    """Aggregated response containing planet details, moons, and facts for 3D visualization."""

    planet: PlanetResponse
    moons: list[MoonResponse] = []
    facts: list[PlanetFactResponse] = []

    model_config = ConfigDict(from_attributes=True)
