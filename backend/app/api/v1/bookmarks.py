"""Cosmos Platform — Bookmarks API Endpoints.

Provides REST API endpoints for managing User Bookmarks across all space modules.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.bookmark import BookmarkCreate, BookmarkResponse
from app.services.bookmark_service import BookmarkService

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])


@router.post(
    "",
    response_model=BookmarkResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Bookmark",
    description="Saves a planet, mission, story, or timeline event to user bookmarks. Requires Authentication.",
)
async def create_bookmark(
    payload: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BookmarkResponse:
    """Create a new bookmark for current user."""
    service = BookmarkService(db)
    return await service.create_bookmark(current_user.id, payload)


@router.get(
    "",
    response_model=list[BookmarkResponse],
    status_code=status.HTTP_200_OK,
    summary="List User Bookmarks",
    description="Retrieves all bookmarks saved by the authenticated user. Requires Authentication.",
)
async def list_user_bookmarks(
    resource_type: str | None = Query(None, description="Optional resource_type filter (Story, Planet, Mission, etc.)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[BookmarkResponse]:
    """List bookmarks for current user."""
    service = BookmarkService(db)
    return await service.list_user_bookmarks(current_user.id, resource_type=resource_type)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Bookmark",
    description="Removes a bookmark by UUID. Requires Authentication.",
)
async def delete_bookmark(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a user bookmark."""
    service = BookmarkService(db)
    await service.delete_bookmark(current_user.id, id)
