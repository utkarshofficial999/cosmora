"""Cosmos Platform — Timeline API Endpoints.

Provides REST API endpoints for space timeline events.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db, require_roles
from app.models.user import User
from app.schemas.timeline import (
    TimelineCreate,
    TimelineListResponse,
    TimelineResponse,
    TimelineUpdate,
)
from app.services.timeline_service import TimelineService

router = APIRouter(prefix="/timeline", tags=["Timeline"])


@router.post(
    "",
    response_model=TimelineResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Timeline Event",
    description="Creates a new space timeline event. Restricted to Admin users.",
)
async def create_timeline_event(
    payload: TimelineCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_roles("Admin")),
) -> TimelineResponse:
    """Create a new timeline event."""
    service = TimelineService(db)
    return await service.create_event(payload, creator_id=admin_user.id)


@router.get(
    "",
    response_model=TimelineListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Timeline Events",
    description="Retrieves a paginated list of space timeline events with filtering and search options. Requires authentication.",
)
async def list_timeline_events(
    search: str | None = Query(None, description="Search term matching title, content, description, or era"),
    era: str | None = Query(None, description="Filter by era UUID or era slug"),
    year: int | None = Query(None, description="Filter by exact event year"),
    featured: bool | None = Query(None, description="Filter featured events only"),
    sort: str = Query("year", description="Field to sort by (year, importance, created_at, title)"),
    order: str = Query("asc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TimelineListResponse:
    """List timeline events with pagination and filters."""
    service = TimelineService(db)
    return await service.list_events(
        search=search,
        era=era,
        year=year,
        featured=featured,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{id}",
    response_model=TimelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Timeline Event by ID",
    description="Retrieves details of a specific timeline event by UUID or slug. Requires authentication.",
)
async def get_timeline_event(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TimelineResponse:
    """Get timeline event details."""
    service = TimelineService(db)
    return await service.get_event_by_id(id)


@router.patch(
    "/{id}",
    response_model=TimelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Timeline Event",
    description="Updates an existing timeline event. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_timeline_event(
    id: UUID,
    payload: TimelineUpdate,
    db: AsyncSession = Depends(get_db),
) -> TimelineResponse:
    """Update timeline event details."""
    service = TimelineService(db)
    return await service.update_event(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Timeline Event",
    description="Deletes a timeline event by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_timeline_event(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a timeline event."""
    service = TimelineService(db)
    await service.delete_event(id)
