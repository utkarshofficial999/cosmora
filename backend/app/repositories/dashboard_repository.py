"""Cosmos Platform — Dashboard Repository.

Queries live operational counters across all 10 domain modules for the Admin Dashboard.
"""

from datetime import datetime, timezone
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ai_conversation import AIConversation
from app.models.collection import Collection
from app.models.mission import Mission
from app.models.notification import Notification
from app.models.planet import Planet
from app.models.search_history import SearchHistory
from app.models.story import Story
from app.models.timeline import TimelineEvent
from app.models.user import User


class DashboardRepository:
    """Repository querying platform-wide operational statistics."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_total_users(self) -> int:
        """Count total users."""
        res = await self.session.execute(select(func.count(User.id)))
        return res.scalar_one()

    async def get_active_users(self) -> int:
        """Count active users."""
        res = await self.session.execute(select(func.count(User.id)).where(User.is_active == True))  # noqa: E712
        return res.scalar_one()

    async def get_stories_count(self) -> int:
        """Count total stories."""
        res = await self.session.execute(select(func.count(Story.id)))
        return res.scalar_one()

    async def get_missions_count(self) -> int:
        """Count total missions."""
        res = await self.session.execute(select(func.count(Mission.id)))
        return res.scalar_one()

    async def get_planets_count(self) -> int:
        """Count total planets."""
        res = await self.session.execute(select(func.count(Planet.id)))
        return res.scalar_one()

    async def get_timeline_events_count(self) -> int:
        """Count total timeline events."""
        res = await self.session.execute(select(func.count(TimelineEvent.id)))
        return res.scalar_one()

    async def get_notifications_count(self) -> int:
        """Count total notifications."""
        res = await self.session.execute(select(func.count(Notification.id)))
        return res.scalar_one()

    async def get_ai_conversations_count(self) -> int:
        """Count total AI conversations."""
        res = await self.session.execute(select(func.count(AIConversation.id)))
        return res.scalar_one()

    async def get_collections_count(self) -> int:
        """Count total user collections."""
        res = await self.session.execute(select(func.count(Collection.id)))
        return res.scalar_one()

    async def get_searches_today(self) -> int:
        """Count search queries executed today."""
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        res = await self.session.execute(
            select(func.count(SearchHistory.id)).where(SearchHistory.searched_at >= today_start)
        )
        return res.scalar_one()
