"""Cosmos Platform — Missions API Endpoints.

Provides REST API endpoints for space missions and launch countdowns.
"""

from typing import Union
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.countdown import MissionCountdownResponse
from app.schemas.mission import (
    MissionCreate,
    MissionListResponse,
    MissionResponse,
    MissionUpdate,
)
from app.services.mission_service import MissionService

router = APIRouter(prefix="/missions", tags=["Missions"])


@router.post(
    "",
    response_model=MissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Mission",
    description="Creates a new space exploration mission. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_mission(
    payload: MissionCreate,
    db: AsyncSession = Depends(get_db),
) -> MissionResponse:
    """Create a new Mission entity."""
    service = MissionService(db)
    return await service.create_mission(payload)


@router.get(
    "",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all Missions",
    description="Retrieves a paginated list of space missions with multi-field search and filters. Public access.",
)
async def list_missions(
    search: str | None = Query(None, description="Search term for name, description, objective, or spacecraft"),
    agency: str | None = Query(None, description="Filter by agency UUID or agency slug"),
    destination: str | None = Query(None, description="Filter by target destination (e.g. Moon, Mars)"),
    mission_type: str | None = Query(None, description="Filter by mission type (Lunar, Mars, Satellite, etc.)"),
    status: str | None = Query(None, description="Filter by mission status (Upcoming, Preparing, Live, Successful, Failed, Cancelled)"),
    year: int | None = Query(None, description="Filter by launch year"),
    featured: bool | None = Query(None, description="Filter featured missions only"),
    sort: str = Query("launch_date", description="Field to sort by (launch_date, name, status, created_at)"),
    order: str = Query("asc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List Missions with pagination and filters."""
    service = MissionService(db)
    return await service.list_missions(
        search=search,
        agency=agency,
        destination=destination,
        mission_type=mission_type,
        status=status,
        year=year,
        featured=featured,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/upcoming",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Upcoming Missions",
    description="Retrieves upcoming space missions scheduled for future launches. Public access.",
)
async def list_upcoming_missions(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List upcoming missions."""
    service = MissionService(db)
    return await service.list_missions(status="Upcoming", sort="launch_date", order="asc", page=page, limit=limit)


@router.get(
    "/live",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Currently Live Missions",
    description="Retrieves space missions currently live in operation. Public access.",
)
async def list_live_missions(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List live active missions."""
    service = MissionService(db)
    return await service.list_missions(status="Live", sort="launch_date", order="desc", page=page, limit=limit)


@router.get(
    "/completed",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Successfully Completed Missions",
    description="Retrieves successfully completed space missions. Public access.",
)
async def list_completed_missions(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List completed missions."""
    service = MissionService(db)
    return await service.list_missions(status="Successful", sort="launch_date", order="desc", page=page, limit=limit)


@router.get(
    "/failed",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Failed Missions",
    description="Retrieves missions categorized as failed. Public access.",
)
async def list_failed_missions(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List failed missions."""
    service = MissionService(db)
    return await service.list_missions(status="Failed", sort="launch_date", order="desc", page=page, limit=limit)


@router.get(
    "/featured",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Featured Missions",
    description="Retrieves featured flagship space missions highlighted on the platform. Public access.",
)
async def list_featured_missions(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List featured missions."""
    service = MissionService(db)
    return await service.list_missions(featured=True, sort="launch_date", order="desc", page=page, limit=limit)


@router.get(
    "/{id}",
    response_model=MissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Mission by ID or Slug",
    description="Retrieves details of a specific mission using UUID or slug (e.g. 'chandrayaan-3', 'artemis-ii'). Public access.",
)
async def get_mission(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> MissionResponse:
    """Get Mission details by UUID or slug."""
    service = MissionService(db)
    return await service.get_mission_by_id_or_slug(id)


@router.patch(
    "/{id}",
    response_model=MissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Mission",
    description="Updates fields of an existing mission. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_mission(
    id: str,
    payload: MissionUpdate,
    db: AsyncSession = Depends(get_db),
) -> MissionResponse:
    """Update Mission details."""
    service = MissionService(db)
    return await service.update_mission(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Mission",
    description="Deletes a mission by UUID or slug. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_mission(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a Mission."""
    service = MissionService(db)
    await service.delete_mission(id)


@router.get(
    "/{slug}/countdown",
    response_model=MissionCountdownResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Mission Launch Countdown",
    description="Calculates real-time days, hours, minutes, and seconds remaining until launch. Public access.",
)
async def get_mission_countdown(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> MissionCountdownResponse:
    """Get launch countdown object for a mission."""
    service = MissionService(db)
    return await service.get_mission_countdown(slug)
