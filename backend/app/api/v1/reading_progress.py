"""Cosmos Platform — Reading Progress API Endpoints.

Provides REST API endpoints for user reading progress, history, and continue-reading features.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.progress import ProgressCreate, ProgressResponse, ReadingHistoryResponse
from app.services.story_service import StoryService

router = APIRouter(tags=["Reading Progress"])


@router.post(
    "/stories/{id}/progress",
    response_model=ProgressResponse,
    status_code=status.HTTP_200_OK,
    summary="Save Reading Progress",
    description="Saves or updates user reading completion and last chapter read for a story. Requires Authentication.",
)
async def save_reading_progress(
    id: str,
    payload: ProgressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProgressResponse:
    """Save user reading progress."""
    service = StoryService(db)
    return await service.upsert_progress(current_user.id, id, payload)


@router.get(
    "/users/me/reading-history",
    response_model=list[ReadingHistoryResponse],
    status_code=status.HTTP_200_OK,
    summary="Get User Reading History",
    description="Retrieves recent reading history for the authenticated user. Requires Authentication.",
)
async def get_reading_history(
    limit: int = Query(20, ge=1, le=100, description="Items limit"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ReadingHistoryResponse]:
    """Get user reading history."""
    service = StoryService(db)
    return await service.get_user_reading_history(current_user.id, limit=limit)


@router.get(
    "/users/me/continue-reading",
    response_model=list[ReadingHistoryResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Continue Reading List",
    description="Retrieves in-progress stories for continuing reading. Requires Authentication.",
)
async def get_continue_reading(
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ReadingHistoryResponse]:
    """Get continue reading list."""
    service = StoryService(db)
    return await service.get_user_continue_reading(current_user.id, limit=limit)
