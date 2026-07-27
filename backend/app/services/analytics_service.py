"""Cosmos Platform — Analytics Service.

Handles event ingestion and tracking across platform domain actions.
"""

from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics_event import AnalyticsEvent
from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.content_analytics_repository import ContentAnalyticsRepository


class AnalyticsService:
    """Service handling platform event ingestion and content metric tracking."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.analytics_repo = AnalyticsRepository(session)
        self.content_repo = ContentAnalyticsRepository(session)

    async def track_event(
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
        """Track a platform event and update content metrics when applicable."""
        event = await self.analytics_repo.log_event(
            user_id=user_id,
            event_type=event_type,
            resource_type=resource_type,
            resource_id=resource_id,
            session_id=session_id,
            device_type=device_type,
            browser=browser,
            os=os,
            country=country,
            city=city,
            referrer=referrer,
            event_metadata=event_metadata,
        )

        # Update ContentAnalytics if resource view/bookmark
        if resource_type and resource_id:
            evt_upper = event_type.upper()
            if "VIEW" in evt_upper or "READ" in evt_upper:
                await self.content_repo.record_view(resource_type, resource_id)
            elif "BOOKMARK" in evt_upper:
                await self.content_repo.record_bookmark(resource_type, resource_id)

        return event
