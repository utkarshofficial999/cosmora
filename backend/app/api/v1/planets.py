"""Cosmos Platform — Planets API Endpoints.

Provides REST API endpoints for managing Planets and 3D Solar System overview.
"""

from typing import Union
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.moon import MoonResponse
from app.schemas.planet import (
    PlanetCreate,
    PlanetListResponse,
    PlanetOverviewResponse,
    PlanetResponse,
    PlanetUpdate,
)
from app.schemas.planet_fact import PlanetFactResponse
from app.services.planet_service import PlanetService

router = APIRouter(prefix="/planets", tags=["Planets"])


@router.post(
    "",
    response_model=PlanetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Planet",
    description="Creates a new planet in the Solar System. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_planet(
    payload: PlanetCreate,
    db: AsyncSession = Depends(get_db),
) -> PlanetResponse:
    """Create a new Planet entity."""
    service = PlanetService(db)
    return await service.create_planet(payload)


@router.get(
    "",
    response_model=PlanetListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all Planets",
    description="Retrieves a paginated list of planets with search, habitability, and moon filters. Public access.",
)
async def list_planets(
    search: str | None = Query(None, description="Search term for planet name, description, or atmosphere"),
    habitable: bool | None = Query(None, description="Filter by habitability status"),
    has_moons: bool | None = Query(None, description="Filter planets that have known moons"),
    sort: str = Query("distance_from_sun", description="Field to sort by (distance_from_sun, name, diameter_km, created_at)"),
    order: str = Query("asc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> PlanetListResponse:
    """List Planets with pagination and filters."""
    service = PlanetService(db)
    return await service.list_planets(
        search=search,
        habitable=habitable,
        has_moons=has_moons,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{id}",
    response_model=PlanetResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Planet by ID or Slug",
    description="Retrieves details of a specific planet using either UUID or unique slug (e.g. 'earth', 'mars'). Public access.",
)
async def get_planet(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> PlanetResponse:
    """Get Planet details by primary key UUID or slug."""
    service = PlanetService(db)
    return await service.get_planet_by_id_or_slug(id)


@router.patch(
    "/{id}",
    response_model=PlanetResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Planet",
    description="Updates fields of an existing planet. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_planet(
    id: str,
    payload: PlanetUpdate,
    db: AsyncSession = Depends(get_db),
) -> PlanetResponse:
    """Update Planet details by UUID or slug."""
    service = PlanetService(db)
    return await service.update_planet(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Planet",
    description="Deletes a planet by UUID or slug. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_planet(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a Planet."""
    service = PlanetService(db)
    await service.delete_planet(id)


@router.get(
    "/{id}/moons",
    response_model=list[MoonResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Moons of a Planet",
    description="Retrieves all natural satellites orbiting the specified planet. Public access.",
)
async def get_planet_moons(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> list[MoonResponse]:
    """List moons orbiting a specific planet."""
    service = PlanetService(db)
    return await service.get_moons_by_planet(id)


@router.get(
    "/{id}/facts",
    response_model=list[PlanetFactResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Facts of a Planet",
    description="Retrieves all interesting facts and trivia associated with a specific planet. Public access.",
)
async def get_planet_facts(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> list[PlanetFactResponse]:
    """List facts of a specific planet."""
    service = PlanetService(db)
    return await service.get_facts_by_planet(id)


@router.get(
    "/{id}/overview",
    response_model=PlanetOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Complete Planet Overview",
    description="Retrieves aggregated planet data including moons and trivia facts for 3D Solar System rendering. Public access.",
)
async def get_planet_overview(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> PlanetOverviewResponse:
    """Get full aggregated overview of a planet."""
    service = PlanetService(db)
    return await service.get_planet_overview(id)
