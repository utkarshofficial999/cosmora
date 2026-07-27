"""Cosmos Platform — ScheduledNotification Repository.

Encapsulates database operations for ScheduledNotification entities using SQLAlchemy Async 2.0.
"""

from datetime import datetime
from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scheduled_notification import ScheduledNotification


class ScheduledNotificationRepository:
    """Repository managing ScheduledNotification job persistence."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, scheduled_id: UUID) -> ScheduledNotification | None:
        """Fetch a ScheduledNotification by primary key ID."""
        result = await self.session.execute(
            select(ScheduledNotification).where(ScheduledNotification.id == scheduled_id)
        )
        return result.scalar_one_or_none()

    async def create(self, **fields: object) -> ScheduledNotification:
        """Create and persist a new ScheduledNotification entity."""
        scheduled = ScheduledNotification(**fields)
        self.session.add(scheduled)
        await self.session.flush()
        return scheduled

    async def get_due_notifications(self, now: datetime, limit: int = 50) -> Sequence[ScheduledNotification]:
        """Fetch pending scheduled notifications that are due for dispatch."""
        result = await self.session.execute(
            select(ScheduledNotification)
            .where(
                ScheduledNotification.status == "pending",
                ScheduledNotification.scheduled_for <= now,
            )
            .order_by(ScheduledNotification.scheduled_for.asc())
            .limit(limit)
        )
        return result.scalars().all()

    async def update(self, scheduled: ScheduledNotification, **fields: object) -> ScheduledNotification:
        """Update fields on an existing ScheduledNotification entity."""
        for key, value in fields.items():
            if value is not None and hasattr(scheduled, key):
                setattr(scheduled, key, value)
        await self.session.flush()
        return scheduled

    async def delete(self, scheduled: ScheduledNotification) -> None:
        """Delete a ScheduledNotification entity."""
        await self.session.delete(scheduled)
        await self.session.flush()
