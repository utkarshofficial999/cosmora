"""Cosmos Platform — Mission Milestones API Endpoints.

Provides REST API endpoints for managing Mission Milestones.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.milestone import (
    MilestoneCreate,
    MilestoneResponse,
    MilestoneUpdate,
)
from app.services.mission_service import MissionService

router = APIRouter(tags=["Mission Milestones"])


@router.post(
    "/missions/{id}/milestones",
    response_model=MilestoneResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Mission Milestone",
    description="Creates a milestone event for a specific mission. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_milestone(
    id: str,
    payload: MilestoneCreate,
    db: AsyncSession = Depends(get_db),
) -> MilestoneResponse:
    """Create a new MissionMilestone."""
    service = MissionService(db)
    return await service.create_milestone(id, payload)


@router.get(
    "/missions/{id}/milestones",
    response_model=list[MilestoneResponse],
    status_code=status.HTTP_200_OK,
    summary="List Mission Milestones",
    description="Retrieves all milestones for a specific mission. Public access.",
)
async def list_milestones(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> list[MilestoneResponse]:
    """Get all milestones for a mission."""
    service = MissionService(db)
    return await service.get_milestones_by_mission(id)


@router.patch(
    "/milestones/{id}",
    response_model=MilestoneResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Mission Milestone",
    description="Updates fields of an existing milestone. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_milestone(
    id: UUID,
    payload: MilestoneUpdate,
    db: AsyncSession = Depends(get_db),
) -> MilestoneResponse:
    """Update MissionMilestone details."""
    service = MissionService(db)
    return await service.update_milestone(id, payload)


@router.delete(
    "/milestones/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Mission Milestone",
    description="Deletes a milestone by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_milestone(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a MissionMilestone."""
    service = MissionService(db)
    await service.delete_milestone(id)
