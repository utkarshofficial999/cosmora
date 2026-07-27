"""Cosmos Platform — User Activity Schemas.

Defines Pydantic v2 schemas for User Activity logging.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ActivityCreate(BaseModel):
    """Schema for logging a user interaction event."""

    resource_type: str = Field(..., min_length=1, max_length=50, description="Target resource type")
    resource_id: str = Field(..., min_length=1, max_length=255, description="Target resource ID or slug")
    action: str = Field(..., min_length=1, max_length=50, description="User action (View, Bookmark, Complete Story, Search, Share)")
    session_id: str | None = Field(None, max_length=100)
    ip_address: str | None = Field(None, max_length=45)


class ActivityResponse(BaseModel):
    """Schema for UserActivity API response."""

    id: UUID
    user_id: UUID
    resource_type: str
    resource_id: str
    action: str
    session_id: str | None = None
    ip_address: str | None = None
    title: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
