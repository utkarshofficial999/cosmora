"""Cosmos Platform — Event Media Repository.

Encapsulates database operations for EventMedia entities.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.event_media import EventMedia


class EventMediaRepository:
    """Repository managing database persistence for EventMedia items."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, media_id: UUID) -> EventMedia | None:
        """Fetch media item by primary key ID."""
        result = await self.session.execute(
            select(EventMedia).where(EventMedia.id == media_id)
        )
        return result.scalar_one_or_none()

    async def get_by_event_id(self, event_id: UUID) -> Sequence[EventMedia]:
        """Fetch all media items for a specific timeline event."""
        result = await self.session.execute(
            select(EventMedia).where(EventMedia.timeline_event_id == event_id)
        )
        return result.scalars().all()

    async def create(
        self,
        timeline_event_id: UUID,
        media_type: str,
        url: str,
        caption: str | None = None,
    ) -> EventMedia:
        """Create and persist a new media item."""
        media = EventMedia(
            timeline_event_id=timeline_event_id,
            media_type=media_type,
            url=url,
            caption=caption,
        )
        self.session.add(media)
        await self.session.flush()
        return media

    async def delete(self, media: EventMedia) -> None:
        """Delete a media item from the database."""
        await self.session.delete(media)
        await self.session.flush()
