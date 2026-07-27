"""Cosmos Platform — Notification Preference Schemas.

Defines Pydantic v2 schemas for User Notification Preferences.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class PreferenceUpdate(BaseModel):
    """Schema for updating user notification channel preferences."""

    mission_notifications: bool | None = Field(None, description="Enable alerts for space missions & launches")
    story_notifications: bool | None = Field(None, description="Enable alerts for new story publications")
    timeline_notifications: bool | None = Field(None, description="Enable alerts for historical space timeline events")
    weekly_digest: bool | None = Field(None, description="Enable weekly space digest compilation")
    email_notifications: bool | None = Field(None, description="Enable email channel delivery")
    push_notifications: bool | None = Field(None, description="Enable push & WebSocket live delivery")


class NotificationPreferenceResponse(BaseModel):
    """Schema for NotificationPreference API response."""

    id: UUID
    user_id: UUID
    mission_notifications: bool
    story_notifications: bool
    timeline_notifications: bool
    weekly_digest: bool
    email_notifications: bool
    push_notifications: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
