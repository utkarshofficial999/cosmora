"""Cosmos Platform — Content Analytics Repository.

Tracks engagement metrics, views, bookmarks, and ranking per content item.
"""

from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content_analytics import ContentAnalytics


class ContentAnalyticsRepository:
    """Repository tracking ContentAnalytics performance metrics and content rankings."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def record_view(self, resource_type: str, resource_id: str) -> ContentAnalytics:
        """Increment view count for a specific content item."""
        query = (
            select(ContentAnalytics)
            .where(ContentAnalytics.resource_type.ilike(resource_type))
            .where(ContentAnalytics.resource_id == str(resource_id))
        )
        res = await self.session.execute(query)
        item = res.scalar_one_or_none()
        if not item:
            item = ContentAnalytics(
                resource_type=resource_type,
                resource_id=str(resource_id),
                views=1,
                bookmarks=0,
                shares=0,
                average_read_time=1.5,
                completion_rate=85.0,
                last_updated=datetime.now(timezone.utc),
            )
            self.session.add(item)
        else:
            item.views += 1
            item.last_updated = datetime.now(timezone.utc)

        await self.session.flush()
        return item

    async def record_bookmark(self, resource_type: str, resource_id: str) -> ContentAnalytics:
        """Increment bookmark count for a specific content item."""
        query = (
            select(ContentAnalytics)
            .where(ContentAnalytics.resource_type.ilike(resource_type))
            .where(ContentAnalytics.resource_id == str(resource_id))
        )
        res = await self.session.execute(query)
        item = res.scalar_one_or_none()
        if not item:
            item = ContentAnalytics(
                resource_type=resource_type,
                resource_id=str(resource_id),
                views=1,
                bookmarks=1,
                shares=0,
                average_read_time=1.5,
                completion_rate=85.0,
                last_updated=datetime.now(timezone.utc),
            )
            self.session.add(item)
        else:
            item.bookmarks += 1
            item.last_updated = datetime.now(timezone.utc)

        await self.session.flush()
        return item

    async def get_top_performing_content(
        self,
        resource_type: str | None = None,
        limit: int = 5,
    ) -> list[ContentAnalytics]:
        """Fetch top performing content items ranked by view count."""
        query = select(ContentAnalytics)
        if resource_type:
            query = query.where(ContentAnalytics.resource_type.ilike(resource_type))
        query = query.order_by(ContentAnalytics.views.desc()).limit(limit)
        res = await self.session.execute(query)
        return list(res.scalars().all())
