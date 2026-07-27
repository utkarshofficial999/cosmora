"""Cosmos Platform — Notification API Endpoints.

REST API routes for user notification feeds, marking read, and admin system broadcasts.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db, require_roles
from app.models.user import User
from app.schemas.notification import (
    BroadcastRequest,
    BroadcastResponse,
    NotificationListResponse,
    NotificationResponse,
)
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])
admin_router = APIRouter(prefix="/admin/notifications", tags=["Admin Notifications"])


@router.get(
    "",
    response_model=NotificationListResponse,
    summary="Get User Notification Feed",
    description="Fetch paginated notification feed for the current authenticated user.",
)
async def get_user_notifications(
    unread_only: bool = Query(False, description="Filter for unread notifications only"),
    notification_type: str | None = Query(None, description="Filter by notification type category"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationListResponse:
    """Fetch user notification feed."""
    service = NotificationService(db)
    return await service.list_user_notifications(
        user_id=current_user.id,
        unread_only=unread_only,
        notification_type=notification_type,
        page=page,
        limit=limit,
    )


@router.get(
    "/unread",
    response_model=NotificationListResponse,
    summary="Get Unread Notifications Feed",
    description="Shortcut endpoint to fetch unread notifications for the current user.",
)
async def get_unread_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationListResponse:
    """Fetch unread user notifications."""
    service = NotificationService(db)
    return await service.list_user_notifications(
        user_id=current_user.id,
        unread_only=True,
        page=page,
        limit=limit,
    )


@router.patch(
    "/read-all",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Mark All Notifications Read",
    description="Bulk mark all unread notifications as read for the current user.",
)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Mark all unread notifications as read."""
    service = NotificationService(db)
    await service.mark_all_read(user_id=current_user.id)


@router.patch(
    "/{id}/read",
    response_model=NotificationResponse,
    summary="Mark Notification Read",
    description="Mark a single notification as read.",
)
async def mark_notification_read(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationResponse:
    """Mark single notification as read."""
    service = NotificationService(db)
    return await service.mark_as_read(user_id=current_user.id, notification_id=id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Notification",
    description="Delete a notification from user's feed.",
)
async def delete_notification(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete single notification."""
    service = NotificationService(db)
    await service.delete_notification(user_id=current_user.id, notification_id=id)


# ADMIN ENDPOINT
@admin_router.post(
    "/broadcast",
    response_model=BroadcastResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Broadcast System Announcement",
    description="Admin endpoint to broadcast system-wide announcements to all users in real time.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def broadcast_announcement(
    payload: BroadcastRequest,
    db: AsyncSession = Depends(get_db),
) -> BroadcastResponse:
    """Admin broadcast system announcement."""
    service = NotificationService(db)
    return await service.broadcast_announcement(payload)
