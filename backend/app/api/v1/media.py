"""Cosmos Platform — Mission Media API Endpoints.

Provides REST API endpoints for managing Mission Media attachments.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.mission import MissionMediaCreate, MissionMediaResponse
from app.services.mission_service import MissionService

router = APIRouter(tags=["Mission Media"])


@router.post(
    "/missions/{id}/media",
    response_model=MissionMediaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Mission Media Attachment",
    description="Attaches a new media resource (image, video, 3d_model) to a mission. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_mission_media(
    id: str,
    payload: MissionMediaCreate,
    db: AsyncSession = Depends(get_db),
) -> MissionMediaResponse:
    """Create a new MissionMedia item."""
    service = MissionService(db)
    return await service.create_mission_media(id, payload)


@router.get(
    "/missions/{id}/media",
    response_model=list[MissionMediaResponse],
    status_code=status.HTTP_200_OK,
    summary="List Mission Media Attachments",
    description="Retrieves all media attachments for a specific mission. Public access.",
)
async def list_mission_media(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> list[MissionMediaResponse]:
    """List media items attached to a mission."""
    service = MissionService(db)
    return await service.get_media_by_mission(id)


@router.delete(
    "/media/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Mission Media Attachment",
    description="Deletes a media attachment by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_mission_media(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a MissionMedia item."""
    service = MissionService(db)
    await service.delete_mission_media(id)
