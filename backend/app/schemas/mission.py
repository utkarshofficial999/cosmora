"""Cosmos Platform — Mission Schemas.

Defines Pydantic v2 schemas for Missions and attached Media.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.agency import AgencyResponse
from app.schemas.milestone import MilestoneResponse


class MissionMediaCreate(BaseModel):
    """Schema for creating a Mission Media attachment."""

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
        description="Direct resource URL",
        json_schema_extra={"example": "https://assets.cosmora.org/missions/chandrayaan3_landing.jpg"},
    )
    caption: str | None = Field(
        None,
        max_length=255,
        description="Optional media caption",
        json_schema_extra={"example": "Vikram lander touch down on the lunar south pole."},
    )


class MissionMediaResponse(BaseModel):
    """Schema for Mission Media API response."""

    id: UUID
    mission_id: UUID
    media_type: str
    url: str
    caption: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MissionBase(BaseModel):
    """Base Mission schema attributes."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Name of the mission",
        json_schema_extra={"example": "Chandrayaan-3"},
    )
    agency_id: UUID = Field(..., description="ID of the governing space agency")
    mission_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Type of mission (Lunar, Mars, Satellite, Human Spaceflight, Telescope, Rover, Probe, Space Station, Deep Space)",
        json_schema_extra={"example": "Lunar"},
    )
    description: str | None = Field(None, description="Detailed description of the mission")
    objective: str | None = Field(None, description="Primary mission objective")
    destination: str | None = Field(None, max_length=100, description="Target destination (e.g. Moon, Mars, Low Earth Orbit)")
    spacecraft: str | None = Field(None, max_length=150, description="Spacecraft name")
    rocket: str | None = Field(None, max_length=150, description="Launch vehicle rocket name")
    launch_site: str | None = Field(None, max_length=255, description="Launch site location")
    launch_date: datetime | None = Field(None, description="Scheduled or actual launch datetime in UTC")
    expected_end_date: datetime | None = Field(None, description="Expected end date in UTC")
    status: str = Field(
        "Upcoming",
        max_length=50,
        description="Mission status (Upcoming, Preparing, Live, Successful, Failed, Cancelled)",
        json_schema_extra={"example": "Successful"},
    )
    is_featured: bool = Field(False, description="Highlight on dashboard")
    mission_patch: str | None = Field(None, max_length=512, description="Mission patch image URL")
    cover_image: str | None = Field(None, max_length=512, description="Cover image URL")
    livestream_url: str | None = Field(None, max_length=512, description="Livestream video URL")
    wikipedia_url: str | None = Field(None, max_length=512, description="Wikipedia URL")


class MissionCreate(MissionBase):
    """Schema for creating a new Mission."""

    slug: str | None = Field(
        None,
        max_length=255,
        description="Optional custom slug; generated from name if omitted",
        json_schema_extra={"example": "chandrayaan-3"},
    )


class MissionUpdate(BaseModel):
    """Schema for updating an existing Mission."""

    agency_id: UUID | None = Field(None)
    name: str | None = Field(None, min_length=1, max_length=255)
    slug: str | None = Field(None, max_length=255)
    mission_type: str | None = Field(None, max_length=50)
    description: str | None = Field(None)
    objective: str | None = Field(None)
    destination: str | None = Field(None, max_length=100)
    spacecraft: str | None = Field(None, max_length=150)
    rocket: str | None = Field(None, max_length=150)
    launch_site: str | None = Field(None, max_length=255)
    launch_date: datetime | None = Field(None)
    expected_end_date: datetime | None = Field(None)
    status: str | None = Field(None, max_length=50)
    is_featured: bool | None = Field(None)
    mission_patch: str | None = Field(None, max_length=512)
    cover_image: str | None = Field(None, max_length=512)
    livestream_url: str | None = Field(None, max_length=512)
    wikipedia_url: str | None = Field(None, max_length=512)


class MissionResponse(MissionBase):
    """Schema for Mission API response."""

    id: UUID
    slug: str
    agency: AgencyResponse | None = None
    milestones: list[MilestoneResponse] = []
    media: list[MissionMediaResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MissionListResponse(BaseModel):
    """Paginated list response for Missions."""

    items: list[MissionResponse]
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total number of items")
    pages: int = Field(..., ge=0, description="Total number of pages")
