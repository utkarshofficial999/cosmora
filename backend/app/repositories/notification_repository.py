"""Cosmos Platform — Notification Repository.

Encapsulates database operations for Notification entities using SQLAlchemy Async 2.0.
"""

from datetime import datetime, timezone
from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


class NotificationRepository:
    """Repository managing database persistence for Notification entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, notification_id: UUID) -> Notification | None:
        """Fetch a Notification by primary key ID."""
        result = await self.session.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        return result.scalar_one_or_none()

    async def create(self, **fields: object) -> Notification:
        """Create and persist a new Notification entity."""
        notification = Notification(**fields)
        self.session.add(notification)
        await self.session.flush()
        return notification

    async def delete(self, notification: Notification) -> None:
        """Delete a Notification entity."""
        await self.session.delete(notification)
        await self.session.flush()

    async def mark_as_read(self, notification: Notification) -> Notification:
        """Mark a single notification as read with timestamp."""
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.now(timezone.utc)
            await self.session.flush()
        return notification

    async def mark_all_user_notifications_read(self, user_id: UUID) -> None:
        """Mark all unread notifications for a user as read."""
        now = datetime.now(timezone.utc)
        await self.session.execute(
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)  # noqa: E712
            .values(is_read=True, read_at=now)
        )
        await self.session.flush()

    async def count_unread(self, user_id: UUID) -> int:
        """Count total unread notifications for a user."""
        result = await self.session.execute(
            select(func.count())
            .select_from(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)  # noqa: E712
        )
        return result.scalar_one()

    async def list_user_notifications(
        self,
        user_id: UUID,
        unread_only: bool = False,
        notification_type: str | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Notification], int, int, int]:
        """Fetch user notifications feed with pagination and unread counts."""
        query = select(Notification).where(Notification.user_id == user_id)

        if unread_only:
            query = query.where(Notification.is_read == False)  # noqa: E712

        if notification_type:
            query = query.where(Notification.notification_type.ilike(notification_type))

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        unread_count = await self.count_unread(user_id)

        query = query.order_by(Notification.created_at.desc()).offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, unread_count, pages
