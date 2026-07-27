"""Cosmos Platform — SpaceAgencies API Endpoints.

Provides REST API endpoints for managing Space Agencies.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.agency import (
    AgencyCreate,
    AgencyListResponse,
    AgencyResponse,
    AgencyUpdate,
)
from app.schemas.mission import MissionListResponse
from app.services.mission_service import MissionService

router = APIRouter(prefix="/agencies", tags=["Space Agencies"])


@router.post(
    "",
    response_model=AgencyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Space Agency",
    description="Creates a new space agency (e.g. ISRO, NASA, SpaceX). Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_agency(
    payload: AgencyCreate,
    db: AsyncSession = Depends(get_db),
) -> AgencyResponse:
    """Create a new SpaceAgency entity."""
    service = MissionService(db)
    return await service.create_agency(payload)


@router.get(
    "",
    response_model=AgencyListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all Space Agencies",
    description="Retrieves a paginated list of space agencies with search and country filters. Public access.",
)
async def list_agencies(
    search: str | None = Query(None, description="Search term for agency name, description, or country"),
    country: str | None = Query(None, description="Filter by country of origin"),
    sort: str = Query("name", description="Field to sort by (name, country, founded_year)"),
    order: str = Query("asc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> AgencyListResponse:
    """List SpaceAgencies with pagination and filters."""
    service = MissionService(db)
    return await service.list_agencies(
        search=search,
        country=country,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{id}",
    response_model=AgencyResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Space Agency by ID or Slug",
    description="Retrieves details of a specific space agency using UUID or slug (e.g. 'isro', 'nasa'). Public access.",
)
async def get_agency(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> AgencyResponse:
    """Get SpaceAgency details by UUID or slug."""
    service = MissionService(db)
    return await service.get_agency_by_id_or_slug(id)


@router.patch(
    "/{id}",
    response_model=AgencyResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Space Agency",
    description="Updates fields of an existing space agency. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_agency(
    id: str,
    payload: AgencyUpdate,
    db: AsyncSession = Depends(get_db),
) -> AgencyResponse:
    """Update SpaceAgency details."""
    service = MissionService(db)
    return await service.update_agency(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Space Agency",
    description="Deletes a space agency by UUID or slug. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_agency(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a SpaceAgency."""
    service = MissionService(db)
    await service.delete_agency(id)


@router.get(
    "/{slug}/missions",
    response_model=MissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Missions of a Space Agency",
    description="Retrieves a paginated list of space missions conducted by a specific agency. Public access.",
)
async def get_agency_missions(
    slug: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MissionListResponse:
    """List missions conducted by a specific agency."""
    service = MissionService(db)
    return await service.get_agency_missions(slug, page=page, limit=limit)
