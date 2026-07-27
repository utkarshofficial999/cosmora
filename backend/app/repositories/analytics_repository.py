"""Cosmos Platform — Analytics Repository.

Handles telemetry event ingestion and raw activity query aggregation.
"""

from datetime import datetime, timezone
from typing import Any, Sequence
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics_event import AnalyticsEvent


class AnalyticsRepository:
    """Repository managing raw telemetry AnalyticsEvent database persistence and metrics queries."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def log_event(
        self,
        user_id: UUID | None,
        event_type: str,
        resource_type: str | None = None,
        resource_id: str | None = None,
        session_id: str | None = None,
        device_type: str | None = None,
        browser: str | None = None,
        os: str | None = None,
        country: str | None = None,
        city: str | None = None,
        referrer: str | None = None,
        event_metadata: dict[str, Any] | None = None,
    ) -> AnalyticsEvent:
        """Persist a new telemetry event."""
        event = AnalyticsEvent(
            user_id=user_id,
            event_type=event_type,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            session_id=session_id,
            device_type=device_type,
            browser=browser,
            os=os,
            country=country,
            city=city,
            referrer=referrer,
            event_metadata=event_metadata,
        )
        self.session.add(event)
        await self.session.flush()
        return event

    async def count_events_by_type(
        self,
        event_type: str,
        since: datetime | None = None,
    ) -> int:
        """Count events matching event_type since a specific timestamp."""
        query = select(func.count(AnalyticsEvent.id)).where(AnalyticsEvent.event_type.ilike(event_type))
        if since:
            query = query.where(AnalyticsEvent.created_at >= since)
        res = await self.session.execute(query)
        return res.scalar_one()

    async def count_unique_active_users(self, since: datetime) -> int:
        """Count distinct active users who recorded events since timestamp."""
        res = await self.session.execute(
            select(func.count(func.distinct(AnalyticsEvent.user_id)))
            .where(AnalyticsEvent.user_id.isnot(None))
            .where(AnalyticsEvent.created_at >= since)
        )
        return res.scalar_one()
