"""Cosmos Platform — Story Tags API Endpoints.

Provides REST API endpoints for managing Story Tags.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.tag import TagCreate, TagResponse
from app.services.story_service import StoryService

router = APIRouter(prefix="/story-tags", tags=["Story Tags"])


@router.post(
    "",
    response_model=TagResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Story Tag",
    description="Creates a new story tag. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_tag(
    payload: TagCreate,
    db: AsyncSession = Depends(get_db),
) -> TagResponse:
    """Create a new StoryTag."""
    service = StoryService(db)
    return await service.create_tag(payload)


@router.get(
    "",
    response_model=list[TagResponse],
    status_code=status.HTTP_200_OK,
    summary="List Story Tags",
    description="Retrieves all story tags. Public access.",
)
async def list_tags(
    db: AsyncSession = Depends(get_db),
) -> list[TagResponse]:
    """List all story tags."""
    service = StoryService(db)
    return await service.list_tags()


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Story Tag",
    description="Deletes a story tag by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_tag(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a StoryTag."""
    service = StoryService(db)
    await service.delete_tag(id)
