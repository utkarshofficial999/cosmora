"""Cosmos Platform — Story Chapters API Endpoints.

Provides REST API endpoints for managing Story Chapters.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.chapter import ChapterCreate, ChapterResponse, ChapterUpdate
from app.services.story_service import StoryService

router = APIRouter(tags=["Story Chapters"])


@router.post(
    "/stories/{id}/chapters",
    response_model=ChapterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Story Chapter",
    description="Creates a new chapter for a specific story. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_chapter(
    id: str,
    payload: ChapterCreate,
    db: AsyncSession = Depends(get_db),
) -> ChapterResponse:
    """Create a new StoryChapter."""
    service = StoryService(db)
    return await service.create_chapter(id, payload)


@router.get(
    "/stories/{id}/chapters",
    response_model=list[ChapterResponse],
    status_code=status.HTTP_200_OK,
    summary="List Story Chapters",
    description="Retrieves all chapters for a specific story. Public access.",
)
async def list_chapters(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> list[ChapterResponse]:
    """List chapters of a story."""
    service = StoryService(db)
    return await service.get_chapters_by_story(id)


@router.patch(
    "/chapters/{id}",
    response_model=ChapterResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Story Chapter",
    description="Updates fields of an existing story chapter. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_chapter(
    id: UUID,
    payload: ChapterUpdate,
    db: AsyncSession = Depends(get_db),
) -> ChapterResponse:
    """Update StoryChapter details."""
    service = StoryService(db)
    return await service.update_chapter(id, payload)


@router.delete(
    "/chapters/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Story Chapter",
    description="Deletes a story chapter by UUID. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_chapter(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a StoryChapter."""
    service = StoryService(db)
    await service.delete_chapter(id)
