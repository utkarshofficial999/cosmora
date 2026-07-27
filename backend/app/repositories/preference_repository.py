"""Cosmos Platform — Preference Repository.

Encapsulates database operations for NotificationPreference entities using SQLAlchemy Async 2.0.
"""

from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification_preference import NotificationPreference


class PreferenceRepository:
    """Repository managing user NotificationPreference entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_user_id(self, user_id: UUID) -> NotificationPreference | None:
        """Fetch NotificationPreference for a user."""
        result = await self.session.execute(
            select(NotificationPreference).where(NotificationPreference.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create_default(self, user_id: UUID) -> NotificationPreference:
        """Create default notification preferences for a user."""
        pref = NotificationPreference(
            user_id=user_id,
            mission_notifications=True,
            story_notifications=True,
            timeline_notifications=True,
            weekly_digest=True,
            email_notifications=False,
            push_notifications=True,
        )
        self.session.add(pref)
        await self.session.flush()
        return pref

    async def get_or_create(self, user_id: UUID) -> NotificationPreference:
        """Fetch existing user preferences or create defaults if missing."""
        existing = await self.get_by_user_id(user_id)
        if existing:
            return existing
        return await self.create_default(user_id)

    async def update(self, preference: NotificationPreference, **fields: object) -> NotificationPreference:
        """Update fields on an existing NotificationPreference entity."""
        for key, value in fields.items():
            if value is not None and hasattr(preference, key):
                setattr(preference, key, value)
        await self.session.flush()
        return preference
