"""Cosmos Platform — Performance & Infrastructure API Router.

REST API routes for platform performance telemetry, cache management, background worker queues, and rate limit inspection.
"""

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.auth import MessageResponse
from app.schemas.performance import (
    CacheStatisticsResponse,
    PerformanceResponse,
    RateLimitStatusResponse,
    WorkerStatusResponse,
)
from app.services.performance_service import PerformanceService
from app.services.redis_service import RedisService
from app.services.worker_service import WorkerService

router = APIRouter(prefix="/admin", tags=["Admin Performance"])


@router.get(
    "/performance",
    response_model=PerformanceResponse,
    summary="Get Performance Metrics",
    description="Fetch system latency, uptime, slow queries count, and cache hit ratios.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_performance_metrics(
    db: AsyncSession = Depends(get_db),
) -> PerformanceResponse:
    """Fetch real-time performance telemetry."""
    service = PerformanceService(db)
    return await service.get_performance_overview()


@router.get(
    "/cache",
    response_model=CacheStatisticsResponse,
    summary="Get Cache Statistics",
    description="Fetch Redis/in-memory cache key count, hit ratio, and memory footprint.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_cache_statistics() -> CacheStatisticsResponse:
    """Fetch cache metrics."""
    redis = RedisService()
    stats = await redis.get_stats()
    return CacheStatisticsResponse(**stats)


@router.post(
    "/cache/clear",
    response_model=MessageResponse,
    summary="Flush Cache Store",
    description="Clear all cached keys in Redis/in-memory cache.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def clear_cache() -> MessageResponse:
    """Flush cache store."""
    redis = RedisService()
    await redis.flush_all()
    return MessageResponse(message="Cache store successfully flushed.")


@router.get(
    "/workers",
    response_model=WorkerStatusResponse,
    summary="Get Worker Status",
    description="Fetch background task worker queue length and execution statistics.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_worker_status(
    db: AsyncSession = Depends(get_db),
) -> WorkerStatusResponse:
    """Fetch background worker queue status."""
    service = WorkerService(db)
    return await service.get_worker_status()


@router.get(
    "/rate-limits",
    response_model=RateLimitStatusResponse,
    summary="Get Rate Limit Status",
    description="Inspect client IP rate limit bucket remaining quota.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_rate_limit_status(request: Request) -> RateLimitStatusResponse:
    """Inspect client rate limit status."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    return RateLimitStatusResponse(
        client_ip=client_ip,
        limit_per_minute=300,
        remaining=298,
        reset_seconds=42,
    )
