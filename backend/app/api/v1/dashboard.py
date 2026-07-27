"""Cosmos Platform — Dashboard API Endpoints.

Provides aggregated overview data for the Mission Tracking System dashboard.
"""

from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.services.mission_service import MissionService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/latest-missions",
    status_code=status.HTTP_200_OK,
    summary="Get Dashboard Mission Highlights",
    description="Retrieves a consolidated summary of live, upcoming, recent completed, and featured missions. Public access.",
)
async def get_latest_missions_dashboard(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Get aggregated dashboard metrics for space missions."""
    service = MissionService(db)
    return await service.get_dashboard_latest_missions()
