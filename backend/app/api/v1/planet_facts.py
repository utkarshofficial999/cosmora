"""Cosmos Platform — Planet Facts API Endpoints.

Provides REST API endpoints for managing Planet Facts.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.planet_fact import (
    PlanetFactCreate,
    PlanetFactResponse,
    PlanetFactUpdate,
)
from app.services.planet_service import PlanetService

router = APIRouter(prefix="/planet-facts", tags=["Planet Facts"])


@router.post(
    "",
    response_model=PlanetFactResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Planet Fact",
    description="Creates a new trivia fact for a planet. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_planet_fact(
    payload: PlanetFactCreate,
    db: AsyncSession = Depends(get_db),
) -> PlanetFactResponse:
    """Create a new PlanetFact entity."""
    service = PlanetService(db)
    return await service.create_planet_fact(payload)


@router.get(
    "/{id}",
    response_model=PlanetFactResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Planet Fact by ID",
    description="Retrieves details of a specific planet fact by UUID. Public access.",
)
async def get_planet_fact(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> PlanetFactResponse:
    """Get PlanetFact details by primary key UUID."""
    service = PlanetService(db)
    return await service.get_planet_fact_by_id(id)


@router.patch(
    "/{id}",
    response_model=PlanetFactResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Planet Fact",
    description="Updates fields of an existing planet fact. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_planet_fact(
    id: UUID,
    payload: PlanetFactUpdate,
    db: AsyncSession = Depends(get_db),
) -> PlanetFactResponse:
    """Update PlanetFact details."""
    service = PlanetService(db)
    return await service.update_planet_fact(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Planet Fact",
    description="Deletes a planet fact by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_planet_fact(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a PlanetFact."""
    service = PlanetService(db)
    await service.delete_planet_fact(id)
