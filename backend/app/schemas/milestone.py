"""Cosmos Platform — MissionMilestone Schemas.

Defines Pydantic v2 schemas for Mission Milestones.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class MilestoneBase(BaseModel):
    """Base MissionMilestone schema attributes."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Title of the milestone",
        json_schema_extra={"example": "Lunar Orbit Insertion"},
    )
    description: str | None = Field(
        None,
        description="Detailed description of the milestone",
        json_schema_extra={"example": "Spacecraft successfully injected into lunar orbit."},
    )
    milestone_date: datetime | None = Field(
        None,
        description="Date and time of the milestone",
    )
    status: str | None = Field(
        None,
        max_length=50,
        description="Milestone status (e.g. Achieved, Pending, In Progress)",
        json_schema_extra={"example": "Achieved"},
    )
    display_order: int = Field(
        0,
        description="Sorting display order priority",
        json_schema_extra={"example": 1},
    )


class MilestoneCreate(MilestoneBase):
    """Schema for creating a new MissionMilestone."""

    mission_id: UUID | None = Field(None, description="ID of the parent mission")


class MilestoneUpdate(BaseModel):
    """Schema for updating an existing MissionMilestone."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None)
    milestone_date: datetime | None = Field(None)
    status: str | None = Field(None, max_length=50)
    display_order: int | None = Field(None)


class MilestoneResponse(MilestoneBase):
    """Schema for MissionMilestone API response."""

    id: UUID
    mission_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
