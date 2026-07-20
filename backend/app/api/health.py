"""Cosmos Platform — Health Check Endpoint."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.health import HealthResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description="Returns the health status of the API and its dependencies.",
)
async def health_check(
    db: AsyncSession = Depends(get_db),
) -> HealthResponse:
    """Verify service and database connectivity."""
    from app.config.settings import get_settings

    settings = get_settings()

    db_status = "disconnected"
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        logger.exception("Database health check failed")

    status = "healthy" if db_status == "connected" else "degraded"

    return HealthResponse(
        status=status,
        app_name=settings.app_name,
        version=settings.app_version,
        database=db_status,
    )
