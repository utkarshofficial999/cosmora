"""Cosmos Platform — Admin CMS & Audit Schemas.

Defines Pydantic v2 schemas for Audit Logs, Bulk Operations, and Moderation Workflows.
"""

from datetime import datetime
from typing import Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class AuditLogResponse(BaseModel):
    """Schema for AdminAuditLog API response."""

    id: UUID
    admin_id: UUID | None = None
    action: str
    resource_type: str
    resource_id: str | None = None
    old_data: dict[str, Any] | None = None
    new_data: dict[str, Any] | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditLogListResponse(BaseModel):
    """Paginated list of Admin Audit Log entries."""

    items: list[AuditLogResponse]
    page: int = Field(..., ge=1)
    limit: int = Field(..., ge=1)
    total: int = Field(..., ge=0)
    pages: int = Field(..., ge=0)


class BulkActionRequest(BaseModel):
    """Schema for executing bulk actions on platform content items."""

    resource_type: str = Field(..., description="Target entity type (Story, Mission, TimelineEvent, Planet, Moon)")
    resource_ids: list[str] = Field(..., min_length=1, description="List of target UUIDs or slugs")


class BulkActionResponse(BaseModel):
    """Schema for bulk action result summary."""

    affected_count: int = Field(..., ge=0, description="Number of items modified")
    action: str = Field(..., description="Executed action type")
    resource_type: str = Field(..., description="Target entity type")
    status: str = Field("Completed", description="Execution status")


class ModerationResponse(BaseModel):
    """Schema for single-item moderation status response."""

    id: str = Field(..., description="Resource ID")
    resource_type: str = Field(..., description="Entity type")
    new_status: str = Field(..., description="Updated status value")
    updated_at: datetime = Field(..., description="Update timestamp")
