"""Cosmos Platform — Analytics & Reports Schemas.

Defines Pydantic v2 schemas for platform analytics, user telemetry, AI metrics, and CSV/JSON reports.
"""

from datetime import date, datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class AnalyticsDashboardResponse(BaseModel):
    """Schema for high-level platform analytics dashboard KPIs."""

    daily_active_users: int = Field(..., ge=0, description="Users active today")
    monthly_active_users: int = Field(..., ge=0, description="Users active in last 30 days")
    new_registrations: int = Field(..., ge=0, description="New user signups today")
    ai_usage_count: int = Field(..., ge=0, description="Total AI Assistant questions asked")
    search_volume: int = Field(..., ge=0, description="Total searches executed today")
    notifications_sent: int = Field(..., ge=0, description="Total notifications dispatched")
    story_reads: int = Field(..., ge=0, description="Total stories read")
    mission_views: int = Field(..., ge=0, description="Total mission page views")

    model_config = ConfigDict(from_attributes=True)


class UserAnalyticsResponse(BaseModel):
    """Schema for user metrics breakdown."""

    total_users: int = Field(..., ge=0)
    active_users: int = Field(..., ge=0)
    new_users_today: int = Field(..., ge=0)
    retention_rate: float = Field(..., ge=0.0, le=100.0)


class ContentAnalyticsItem(BaseModel):
    """Schema for individual content metric item."""

    resource_type: str
    resource_id: str
    views: int = Field(..., ge=0)
    bookmarks: int = Field(..., ge=0)
    shares: int = Field(..., ge=0)
    completion_rate: float = Field(..., ge=0.0, le=100.0)

    model_config = ConfigDict(from_attributes=True)


class ContentAnalyticsResponse(BaseModel):
    """Schema for content performance rankings."""

    top_stories: list[ContentAnalyticsItem] = Field(default_factory=list)
    top_missions: list[ContentAnalyticsItem] = Field(default_factory=list)
    top_planets: list[ContentAnalyticsItem] = Field(default_factory=list)
    trending_timeline_events: list[ContentAnalyticsItem] = Field(default_factory=list)


class AIAnalyticsResponse(BaseModel):
    """Schema for AI Assistant usage analytics."""

    total_conversations: int = Field(..., ge=0)
    questions_per_day: int = Field(..., ge=0)
    average_response_time_ms: float = Field(..., ge=0.0)
    most_asked_topics: list[str] = Field(default_factory=list)
    source_usage: dict[str, int] = Field(default_factory=dict)


class SearchAnalyticsResponse(BaseModel):
    """Schema for platform search analytics."""

    top_searches: list[dict[str, Any]] = Field(default_factory=list)
    failed_searches: list[str] = Field(default_factory=list)
    trending_keywords: list[str] = Field(default_factory=list)
    total_searches_today: int = Field(..., ge=0)


class ReportResponse(BaseModel):
    """Schema for executive daily/weekly/monthly reports."""

    period: str = Field(..., description="Report period (Daily, Weekly, Monthly)")
    start_date: date
    end_date: date
    generated_at: datetime
    metrics: dict[str, Any]
    csv_content: str | None = None
