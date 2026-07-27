"""Cosmos Platform — StoryTag Repository.

Encapsulates database operations for StoryTag entities using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.story_tag import StoryTag


class StoryTagRepository:
    """Repository managing database persistence for StoryTag entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, tag_id: UUID) -> StoryTag | None:
        """Fetch a StoryTag by primary key ID."""
        result = await self.session.execute(
            select(StoryTag).where(StoryTag.id == tag_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> StoryTag | None:
        """Fetch a StoryTag by unique slug."""
        result = await self.session.execute(
            select(StoryTag).where(StoryTag.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> StoryTag | None:
        """Fetch a StoryTag by name (case-insensitive)."""
        result = await self.session.execute(
            select(StoryTag).where(func.lower(StoryTag.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def create(self, **fields: object) -> StoryTag:
        """Create and persist a new StoryTag."""
        tag = StoryTag(**fields)
        self.session.add(tag)
        await self.session.flush()
        return tag

    async def delete(self, tag: StoryTag) -> None:
        """Delete a StoryTag entity."""
        await self.session.delete(tag)
        await self.session.flush()

    async def list_tags(self) -> Sequence[StoryTag]:
        """List all StoryTags ordered by name."""
        result = await self.session.execute(
            select(StoryTag).order_by(StoryTag.name.asc())
        )
        return result.scalars().all()

    async def get_by_ids(self, tag_ids: Sequence[UUID]) -> Sequence[StoryTag]:
        """Fetch multiple StoryTags by primary key IDs."""
        if not tag_ids:
            return []
        result = await self.session.execute(
            select(StoryTag).where(StoryTag.id.in_(tag_ids))
        )
        return result.scalars().all()
