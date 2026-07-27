"""Cosmos Platform — SpaceAgency Schemas.

Defines Pydantic v2 schemas for Space Agencies.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class AgencyBase(BaseModel):
    """Base SpaceAgency schema attributes."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Name of the space agency",
        json_schema_extra={"example": "ISRO"},
    )
    country: str | None = Field(
        None,
        max_length=100,
        description="Country of origin",
        json_schema_extra={"example": "India"},
    )
    description: str | None = Field(
        None,
        description="Detailed description of the agency",
        json_schema_extra={"example": "Indian Space Research Organisation, national space agency of India."},
    )
    founded_year: int | None = Field(
        None,
        description="Year the agency was founded",
        json_schema_extra={"example": 1969},
    )
    logo_url: str | None = Field(None, max_length=512, description="Agency logo URL")
    website: str | None = Field(None, max_length=512, description="Official website URL")
    headquarters: str | None = Field(None, max_length=255, description="Headquarters location")


class AgencyCreate(AgencyBase):
    """Schema for creating a new SpaceAgency."""

    slug: str | None = Field(
        None,
        max_length=120,
        description="Optional custom slug; generated from name if omitted",
        json_schema_extra={"example": "isro"},
    )


class AgencyUpdate(BaseModel):
    """Schema for updating an existing SpaceAgency."""

    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, max_length=120)
    country: str | None = Field(None, max_length=100)
    description: str | None = Field(None)
    founded_year: int | None = Field(None)
    logo_url: str | None = Field(None, max_length=512)
    website: str | None = Field(None, max_length=512)
    headquarters: str | None = Field(None, max_length=255)


class AgencyResponse(AgencyBase):
    """Schema for SpaceAgency API response."""

    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AgencyListResponse(BaseModel):
    """Paginated list response for Space Agencies."""

    items: list[AgencyResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
