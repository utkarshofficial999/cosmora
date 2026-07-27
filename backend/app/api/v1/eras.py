"""Cosmos Platform — Era API Endpoints.

Provides REST API endpoints for managing cosmological and space eras.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db, require_roles
from app.models.user import User
from app.schemas.era import EraCreate, EraListResponse, EraResponse, EraUpdate
from app.services.era_service import EraService

router = APIRouter(prefix="/eras", tags=["Eras"])


@router.post(
    "",
    response_model=EraResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Era",
    description="Creates a new cosmological or space exploration era. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_era(
    payload: EraCreate,
    db: AsyncSession = Depends(get_db),
) -> EraResponse:
    """Create a new Era entity."""
    service = EraService(db)
    return await service.create_era(payload)


@router.get(
    "",
    response_model=EraListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all Eras",
    description="Retrieves a paginated list of space eras with optional search and sorting. Requires authentication.",
)
async def list_eras(
    search: str | None = Query(None, description="Search term for era name or description"),
    sort: str = Query("start_year", description="Field to sort by (start_year, name, created_at)"),
    order: str = Query("asc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EraListResponse:
    """List Eras with pagination."""
    service = EraService(db)
    return await service.list_eras(
        search=search,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{id}",
    response_model=EraResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Era by ID",
    description="Retrieves details of a specific era by UUID. Requires authentication.",
)
async def get_era(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EraResponse:
    """Get Era details by primary key UUID."""
    service = EraService(db)
    return await service.get_era_by_id(id)


@router.patch(
    "/{id}",
    response_model=EraResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an Era",
    description="Updates fields of an existing era. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_era(
    id: UUID,
    payload: EraUpdate,
    db: AsyncSession = Depends(get_db),
) -> EraResponse:
    """Update Era details."""
    service = EraService(db)
    return await service.update_era(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an Era",
    description="Deletes an era by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_era(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete an Era."""
    service = EraService(db)
    await service.delete_era(id)
