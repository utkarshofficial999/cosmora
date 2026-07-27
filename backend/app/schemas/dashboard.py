"""Cosmos Platform — Admin Dashboard Schemas.

Defines Pydantic v2 schemas for aggregated platform metrics and activity logs.
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PlatformActivityItem(BaseModel):
    """Schema for platform recent activity item."""

    resource_type: str = Field(..., description="Entity type")
    title: str = Field(..., description="Entity title or description")
    action: str = Field(..., description="Action type")
    timestamp: datetime = Field(..., description="Event timestamp")


class DashboardResponse(BaseModel):
    """Schema for aggregated Admin Dashboard operational metrics."""

    total_users: int = Field(..., ge=0, description="Total registered platform users")
    stories_count: int = Field(..., ge=0, description="Total published & draft stories")
    missions_count: int = Field(..., ge=0, description="Total space exploration missions")
    planets_count: int = Field(..., ge=0, description="Total solar system celestial bodies")
    timeline_events_count: int = Field(..., ge=0, description="Total space history timeline events")
    notifications_count: int = Field(..., ge=0, description="Total notifications dispatched")
    ai_conversations_count: int = Field(..., ge=0, description="Total AI chat sessions")
    collections_count: int = Field(..., ge=0, description="Total user-curated collections")
    searches_today: int = Field(..., ge=0, description="Search queries executed today")
    active_users: int = Field(..., ge=0, description="Active user accounts")
    recent_activities: list[PlatformActivityItem] = Field(default_factory=list, description="Recent platform activity stream")

    model_config = ConfigDict(from_attributes=True)
