"""Cosmos Platform — Event Service (Internal Event Bus).

Decoupled internal event bus subscribing to domain events across platform modules.
"""

from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification_preference import NotificationPreference
from app.schemas.notification import NotificationCreate
from app.services.notification_service import NotificationService


class EventService:
    """Internal Event Bus publishing domain events and triggering notification dispatches."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.notification_service = NotificationService(session)

    async def trigger_story_published(self, story_id: UUID, title: str, summary: str | None = None) -> int:
        """Trigger New Story Published event to users who enabled story notifications."""
        result = await self.session.execute(
            select(NotificationPreference.user_id).where(NotificationPreference.story_notifications == True)  # noqa: E712
        )
        user_ids = result.scalars().all()

        for u_id in user_ids:
            await self.notification_service.create_and_send_notification(
                NotificationCreate(
                    user_id=u_id,
                    title=f"📖 New Story: {title}",
                    message=summary or f"A new story '{title}' has just been published on Cosmora!",
                    notification_type="New Story Published",
                    resource_type="Story",
                    resource_id=str(story_id),
                    priority="normal",
                )
            )
        return len(user_ids)

    async def trigger_mission_launch(self, mission_id: UUID, name: str, launch_date: str | None = None) -> int:
        """Trigger Mission Launch alert to users who enabled mission notifications."""
        result = await self.session.execute(
            select(NotificationPreference.user_id).where(NotificationPreference.mission_notifications == True)  # noqa: E712
        )
        user_ids = result.scalars().all()

        for u_id in user_ids:
            await self.notification_service.create_and_send_notification(
                NotificationCreate(
                    user_id=u_id,
                    title=f"🚀 Mission Launch Alert: {name}",
                    message=f"Space mission '{name}' launch event scheduled: {launch_date or 'Imminent'}.",
                    notification_type="Mission Launch",
                    resource_type="Mission",
                    resource_id=str(mission_id),
                    priority="high",
                )
            )
        return len(user_ids)

    async def trigger_timeline_event(self, event_id: UUID, title: str, year: int) -> int:
        """Trigger Timeline Event alert to users who enabled timeline notifications."""
        result = await self.session.execute(
            select(NotificationPreference.user_id).where(NotificationPreference.timeline_notifications == True)  # noqa: E712
        )
        user_ids = result.scalars().all()

        for u_id in user_ids:
            await self.notification_service.create_and_send_notification(
                NotificationCreate(
                    user_id=u_id,
                    title=f"📅 Space History Update ({year})",
                    message=f"New timeline discovery added: {title}.",
                    notification_type="Timeline Event",
                    resource_type="TimelineEvent",
                    resource_id=str(event_id),
                    priority="low",
                )
            )
        return len(user_ids)

    async def trigger_achievement_earned(self, user_id: UUID, achievement_name: str) -> None:
        """Trigger Achievement Earned alert for a specific user."""
        await self.notification_service.create_and_send_notification(
            NotificationCreate(
                user_id=user_id,
                title=f"🏆 Achievement Unlocked: {achievement_name}",
                message=f"Congratulations! You earned the '{achievement_name}' badge.",
                notification_type="Achievement Earned",
                priority="high",
            )
        )
