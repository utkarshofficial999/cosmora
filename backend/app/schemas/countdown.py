"""Cosmos Platform — Countdown Schema.

Defines Pydantic v2 schema for mission launch countdowns.
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class MissionCountdownResponse(BaseModel):
    """Schema for mission launch countdown timer."""

    days: int = Field(..., ge=0, description="Remaining days until launch")
    hours: int = Field(..., ge=0, le=23, description="Remaining hours until launch")
    minutes: int = Field(..., ge=0, le=59, description="Remaining minutes until launch")
    seconds: int = Field(..., ge=0, le=59, description="Remaining seconds until launch")
    launch_date: datetime | None = Field(None, description="Scheduled launch date and time in UTC")
    status: str = Field(..., description="Current status of the mission (e.g. Upcoming, Live, Successful)")

    model_config = ConfigDict(from_attributes=True)
