"""Cosmos Platform — Notification Preference API Endpoints.

REST API routes for managing user notification channel preferences.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.preference import NotificationPreferenceResponse, PreferenceUpdate
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notification-preferences", tags=["Notification Preferences"])


@router.get(
    "",
    response_model=NotificationPreferenceResponse,
    summary="Get User Notification Preferences",
    description="Fetch current user's notification channel settings.",
)
async def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationPreferenceResponse:
    """Fetch user notification preferences."""
    service = NotificationService(db)
    return await service.get_user_preferences(user_id=current_user.id)


@router.put(
    "",
    response_model=NotificationPreferenceResponse,
    summary="Update Notification Preferences",
    description="Update current user's notification channel settings.",
)
async def update_notification_preferences(
    payload: PreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationPreferenceResponse:
    """Update user notification preferences."""
    service = NotificationService(db)
    return await service.update_user_preferences(user_id=current_user.id, payload=payload)
