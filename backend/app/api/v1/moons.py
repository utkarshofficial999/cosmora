"""Cosmos Platform — Moons API Endpoints.

Provides REST API endpoints for managing Moons.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.moon import MoonCreate, MoonListResponse, MoonResponse, MoonUpdate
from app.services.planet_service import PlanetService

router = APIRouter(prefix="/moons", tags=["Moons"])


@router.post(
    "",
    response_model=MoonResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Moon",
    description="Creates a new natural satellite associated with a planet. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_moon(
    payload: MoonCreate,
    db: AsyncSession = Depends(get_db),
) -> MoonResponse:
    """Create a new Moon entity."""
    service = PlanetService(db)
    return await service.create_moon(payload)


@router.get(
    "",
    response_model=MoonListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all Moons",
    description="Retrieves a paginated list of moons with optional planet filter and search. Public access.",
)
async def list_moons(
    search: str | None = Query(None, description="Search term for moon name or description"),
    planet_id: UUID | None = Query(None, description="Filter by parent planet UUID"),
    sort: str = Query("name", description="Field to sort by (name, diameter, orbital_period)"),
    order: str = Query("asc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> MoonListResponse:
    """List Moons with pagination and filters."""
    service = PlanetService(db)
    return await service.list_moons(
        search=search,
        planet_id=planet_id,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{id}",
    response_model=MoonResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Moon by ID",
    description="Retrieves details of a specific moon by UUID. Public access.",
)
async def get_moon(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> MoonResponse:
    """Get Moon details by primary key UUID."""
    service = PlanetService(db)
    return await service.get_moon_by_id(id)


@router.patch(
    "/{id}",
    response_model=MoonResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Moon",
    description="Updates fields of an existing moon. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_moon(
    id: UUID,
    payload: MoonUpdate,
    db: AsyncSession = Depends(get_db),
) -> MoonResponse:
    """Update Moon details."""
    service = PlanetService(db)
    return await service.update_moon(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Moon",
    description="Deletes a moon by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_moon(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a Moon."""
    service = PlanetService(db)
    await service.delete_moon(id)
