"""Cosmos Platform — User Activity & Personalization API Endpoints.

Provides REST API endpoints for user activity history, recently viewed content, and recommendations.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.activity import ActivityResponse
from app.schemas.recommendation import RecommendationResponse
from app.services.activity_service import ActivityService
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/users/me", tags=["User Personalization & Activity"])


@router.get(
    "/activity",
    response_model=list[ActivityResponse],
    status_code=status.HTTP_200_OK,
    summary="Get User Activity History",
    description="Retrieves interaction activity logs for the authenticated user. Requires Authentication.",
)
async def get_user_activity(
    action: str | None = Query(None, description="Optional action filter (View, Bookmark, Complete Story, Search, Share)"),
    limit: int = Query(20, ge=1, le=100, description="Items limit"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ActivityResponse]:
    """Get user interaction activity history."""
    service = ActivityService(db)
    return await service.get_user_activities(current_user.id, action=action, limit=limit)


@router.get(
    "/recent",
    response_model=list[ActivityResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Recently Viewed Content",
    description="Retrieves recently viewed planets, missions, stories, and events. Requires Authentication.",
)
async def get_recently_viewed(
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ActivityResponse]:
    """Get recently viewed content for current user."""
    service = ActivityService(db)
    return await service.get_recently_viewed(current_user.id, limit=limit)


@router.get(
    "/recommendations",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Personal Recommendations",
    description="Retrieves personalized content recommendations based on user bookmarks and reading history. Requires Authentication.",
)
async def get_user_recommendations(
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RecommendationResponse:
    """Get personalized content recommendations."""
    service = RecommendationService(db)
    return await service.get_user_personalized_recommendations(current_user.id, limit=limit)
