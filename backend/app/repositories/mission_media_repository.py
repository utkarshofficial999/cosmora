"""Cosmos Platform — Mission Media Repository.

Encapsulates database operations for MissionMedia entities using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.mission_media import MissionMedia


class MissionMediaRepository:
    """Repository managing database persistence for MissionMedia items."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, media_id: UUID) -> MissionMedia | None:
        """Fetch MissionMedia by primary key ID."""
        result = await self.session.execute(
            select(MissionMedia).where(MissionMedia.id == media_id)
        )
        return result.scalar_one_or_none()

    async def get_by_mission_id(self, mission_id: UUID) -> Sequence[MissionMedia]:
        """Fetch all media items attached to a specific mission."""
        result = await self.session.execute(
            select(MissionMedia).where(MissionMedia.mission_id == mission_id)
        )
        return result.scalars().all()

    async def create(self, **fields: object) -> MissionMedia:
        """Create and persist a new MissionMedia item."""
        media = MissionMedia(**fields)
        self.session.add(media)
        await self.session.flush()
        return media

    async def delete(self, media: MissionMedia) -> None:
        """Delete a MissionMedia item from the database."""
        await self.session.delete(media)
        await self.session.flush()
