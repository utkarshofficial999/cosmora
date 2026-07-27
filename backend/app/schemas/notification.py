"""Cosmos Platform — Notification Schemas.

Defines Pydantic v2 schemas for Notifications and System Broadcasts.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class NotificationCreate(BaseModel):
    """Schema for creating a new notification."""

    user_id: UUID = Field(..., description="Target user ID")
    title: str = Field(..., min_length=1, max_length=255, description="Notification headline")
    message: str = Field(..., min_length=1, description="Notification message body")
    notification_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Notification type (Mission Launch, Mission Milestone, New Story Published, Timeline Event, Weekly Space Digest, System Notification)",
        json_schema_extra={"example": "Mission Launch"},
    )
    resource_type: str | None = Field(None, max_length=50, description="Associated resource type")
    resource_id: str | None = Field(None, max_length=255, description="Associated resource ID or slug")
    priority: str = Field("normal", max_length=20, description="Priority level (low, normal, high)")


class NotificationResponse(BaseModel):
    """Schema for Notification API response."""

    id: UUID
    user_id: UUID
    title: str
    message: str
    notification_type: str
    resource_type: str | None = None
    resource_id: str | None = None
    priority: str
    is_read: bool
    created_at: datetime
    read_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    """Paginated response wrapper for notification feed."""

    items: list[NotificationResponse]
    unread_count: int = Field(0, ge=0, description="Number of unread notifications")
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Number of items per page")
    total: int = Field(..., ge=0, description="Total notification count")
    pages: int = Field(..., ge=0, description="Total number of pages")


class BroadcastRequest(BaseModel):
    """Schema for system-wide broadcast announcement request."""

    title: str = Field(..., min_length=1, max_length=255, description="Broadcast headline")
    message: str = Field(..., min_length=1, description="Broadcast message content")
    notification_type: str = Field("System Notification", max_length=50, description="Notification type category")
    priority: str = Field("high", max_length=20, description="Priority level")


class BroadcastResponse(BaseModel):
    """Schema for system-wide broadcast dispatch response."""

    delivered_count: int = Field(..., ge=0, description="Number of users targeted for broadcast")
    status: str = Field("Dispatched", description="Delivery status summary")
