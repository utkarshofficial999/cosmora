"""Cosmos Platform — Performance & Infrastructure Schemas.

Defines Pydantic v2 schemas for performance metrics, cache statistics, worker statuses, and deep health checks.
"""

from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class PerformanceResponse(BaseModel):
    """Schema for platform performance telemetry."""

    request_count: int = Field(..., ge=0, description="Total API requests processed")
    average_latency_ms: float = Field(..., ge=0.0, description="Average API response latency in ms")
    slow_queries_count: int = Field(..., ge=0, description="Number of slow database queries (>200ms)")
    cache_hit_ratio: float = Field(..., ge=0.0, le=100.0, description="Percentage of requests served from cache")
    active_workers_count: int = Field(..., ge=0, description="Currently running background workers")
    system_uptime_seconds: float = Field(..., ge=0.0, description="System uptime in seconds")

    model_config = ConfigDict(from_attributes=True)


class CacheStatisticsResponse(BaseModel):
    """Schema for Redis cache metrics."""

    total_keys: int = Field(..., ge=0)
    hit_count: int = Field(..., ge=0)
    miss_count: int = Field(..., ge=0)
    hit_ratio: float = Field(..., ge=0.0, le=100.0)
    memory_used_mb: float = Field(..., ge=0.0)


class WorkerStatusResponse(BaseModel):
    """Schema for background task workers."""

    active_workers: int = Field(..., ge=0)
    completed_tasks: int = Field(..., ge=0)
    failed_tasks: int = Field(..., ge=0)
    queue_length: int = Field(..., ge=0)


class ComponentHealth(BaseModel):
    """Schema for individual system component health status."""

    status: str = Field(..., description="Status string (healthy, degraded, unhealthy)")
    latency_ms: float = Field(..., ge=0.0)
    details: dict[str, Any] = Field(default_factory=dict)


class DetailedHealthResponse(BaseModel):
    """Schema for deep system health checks."""

    status: str = Field(..., description="Overall system health status")
    database: ComponentHealth
    cache: ComponentHealth
    workers: ComponentHealth
    ai_vector_store: ComponentHealth
    checked_at: datetime


class RateLimitStatusResponse(BaseModel):
    """Schema for API rate limit client status."""

    client_ip: str
    limit_per_minute: int = Field(..., ge=1)
    remaining: int = Field(..., ge=0)
    reset_seconds: int = Field(..., ge=0)
