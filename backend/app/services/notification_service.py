"""Cosmos Platform — Notification Service.

Implements business logic for user notification feeds, preference management, and broadcasts.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.auth import PermissionDeniedError
from app.exceptions.catalog import NotificationNotFoundError
from app.models.user import User
from app.repositories.notification_repository import NotificationRepository
from app.repositories.preference_repository import PreferenceRepository
from app.schemas.notification import (
    BroadcastRequest,
    BroadcastResponse,
    NotificationCreate,
    NotificationListResponse,
    NotificationResponse,
)
from app.schemas.preference import NotificationPreferenceResponse, PreferenceUpdate
from app.services.websocket_manager import ws_manager


class NotificationService:
    """Service managing Notification persistence, feeds, preferences, and real-time delivery."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.notification_repo = NotificationRepository(session)
        self.preference_repo = PreferenceRepository(session)

    async def create_and_send_notification(self, payload: NotificationCreate) -> NotificationResponse:
        """Create a database notification and stream real-time alert via WebSocket."""
        notification = await self.notification_repo.create(
            user_id=payload.user_id,
            title=payload.title,
            message=payload.message,
            notification_type=payload.notification_type,
            resource_type=payload.resource_type,
            resource_id=payload.resource_id,
            priority=payload.priority,
        )

        fresh = await self.notification_repo.get_by_id(notification.id)
        resp = NotificationResponse.model_validate(fresh or notification)

        # Push real-time WS alert
        await ws_manager.send_personal_message(resp.model_dump(mode="json"), payload.user_id)
        return resp

    async def list_user_notifications(
        self,
        user_id: UUID,
        unread_only: bool = False,
        notification_type: str | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> NotificationListResponse:
        """Fetch user's notification feed with pagination and unread metrics."""
        items, total, unread_count, pages = await self.notification_repo.list_user_notifications(
            user_id=user_id,
            unread_only=unread_only,
            notification_type=notification_type,
            page=page,
            limit=limit,
        )
        return NotificationListResponse(
            items=[NotificationResponse.model_validate(n) for n in items],
            unread_count=unread_count,
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def mark_as_read(self, user_id: UUID, notification_id: UUID) -> NotificationResponse:
        """Mark a notification as read."""
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification:
            raise NotificationNotFoundError(f"Notification with ID '{notification_id}' not found.")

        if notification.user_id != user_id:
            raise PermissionDeniedError("Cannot mark another user's notification as read.")

        await self.notification_repo.mark_as_read(notification)
        fresh = await self.notification_repo.get_by_id(notification_id)
        return NotificationResponse.model_validate(fresh or notification)

    async def mark_all_read(self, user_id: UUID) -> None:
        """Mark all notifications for a user as read."""
        await self.notification_repo.mark_all_user_notifications_read(user_id)

    async def delete_notification(self, user_id: UUID, notification_id: UUID) -> None:
        """Delete a notification."""
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification:
            raise NotificationNotFoundError(f"Notification with ID '{notification_id}' not found.")

        if notification.user_id != user_id:
            raise PermissionDeniedError("Cannot delete another user's notification.")

        await self.notification_repo.delete(notification)

    async def broadcast_announcement(self, payload: BroadcastRequest) -> BroadcastResponse:
        """Broadcast a system-wide announcement to all users."""
        # Query active user IDs
        result = await self.session.execute(select(User.id).where(User.is_active == True))  # noqa: E712
        user_ids = result.scalars().all()

        for u_id in user_ids:
            await self.notification_repo.create(
                user_id=u_id,
                title=payload.title,
                message=payload.message,
                notification_type=payload.notification_type,
                priority=payload.priority,
            )

        msg_payload = {
            "type": "BROADCAST",
            "title": payload.title,
            "message": payload.message,
            "notification_type": payload.notification_type,
            "priority": payload.priority,
        }
        await ws_manager.broadcast(msg_payload)

        return BroadcastResponse(delivered_count=len(user_ids), status="Dispatched")

    async def get_user_preferences(self, user_id: UUID) -> NotificationPreferenceResponse:
        """Fetch notification preferences for a user."""
        pref = await self.preference_repo.get_or_create(user_id)
        fresh = await self.preference_repo.get_by_user_id(user_id)
        return NotificationPreferenceResponse.model_validate(fresh or pref)

    async def update_user_preferences(
        self,
        user_id: UUID,
        payload: PreferenceUpdate,
    ) -> NotificationPreferenceResponse:
        """Update notification preferences for a user."""
        pref = await self.preference_repo.get_or_create(user_id)
        update_data = payload.model_dump(exclude_unset=True)
        await self.preference_repo.update(pref, **update_data)
        fresh = await self.preference_repo.get_by_user_id(user_id)
        return NotificationPreferenceResponse.model_validate(fresh or pref)
