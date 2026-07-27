"""Cosmos Platform — Metrics Repository.

Manages DailyAnalytics time-series records and aggregation metrics.
"""

import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.daily_analytics import DailyAnalytics


class MetricsRepository:
    """Repository managing DailyAnalytics database persistence and metrics aggregation."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_or_create_daily(self, target_date: datetime.date) -> DailyAnalytics:
        """Fetch or initialize DailyAnalytics entry for target date."""
        query = select(DailyAnalytics).where(DailyAnalytics.date == target_date)
        res = await self.session.execute(query)
        daily = res.scalar_one_or_none()
        if not daily:
            daily = DailyAnalytics(
                date=target_date,
                active_users=0,
                new_users=0,
                stories_read=0,
                missions_viewed=0,
                timeline_views=0,
                planet_views=0,
                searches=0,
                ai_questions=0,
                notifications_sent=0,
                notifications_opened=0,
            )
            self.session.add(daily)
            await self.session.flush()
        return daily

    async def get_daily_range(
        self,
        start_date: datetime.date,
        end_date: datetime.date,
    ) -> list[DailyAnalytics]:
        """Fetch DailyAnalytics entries between start_date and end_date."""
        query = (
            select(DailyAnalytics)
            .where(DailyAnalytics.date >= start_date)
            .where(DailyAnalytics.date <= end_date)
            .order_by(DailyAnalytics.date.asc())
        )
        res = await self.session.execute(query)
        return list(res.scalars().all())
