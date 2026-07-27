"""Cosmos Platform — Story Categories API Endpoints.

Provides REST API endpoints for managing Story Categories.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.story_service import StoryService

router = APIRouter(prefix="/story-categories", tags=["Story Categories"])


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Story Category",
    description="Creates a new story category. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
) -> CategoryResponse:
    """Create a new StoryCategory."""
    service = StoryService(db)
    return await service.create_category(payload)


@router.get(
    "",
    response_model=list[CategoryResponse],
    status_code=status.HTTP_200_OK,
    summary="List Story Categories",
    description="Retrieves all story categories. Public access.",
)
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> list[CategoryResponse]:
    """List all story categories."""
    service = StoryService(db)
    return await service.list_categories()


@router.patch(
    "/{id}",
    response_model=CategoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Story Category",
    description="Updates fields of an existing story category. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_category(
    id: str,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
) -> CategoryResponse:
    """Update StoryCategory details."""
    service = StoryService(db)
    return await service.update_category(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Story Category",
    description="Deletes a story category by UUID or slug. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_category(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a StoryCategory."""
    service = StoryService(db)
    await service.delete_category(id)
