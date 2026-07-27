"""Cosmos Platform — StoryChapter Repository.

Encapsulates database operations for StoryChapter entities using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chapter import StoryChapter


class StoryChapterRepository:
    """Repository managing database persistence for StoryChapter entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, chapter_id: UUID) -> StoryChapter | None:
        """Fetch a StoryChapter by primary key ID."""
        result = await self.session.execute(
            select(StoryChapter).where(StoryChapter.id == chapter_id)
        )
        return result.scalar_one_or_none()

    async def get_by_story_id(self, story_id: UUID) -> Sequence[StoryChapter]:
        """Fetch all chapters for a story ordered by chapter_number."""
        result = await self.session.execute(
            select(StoryChapter)
            .where(StoryChapter.story_id == story_id)
            .order_by(StoryChapter.chapter_number.asc())
        )
        return result.scalars().all()

    async def create(self, **fields: object) -> StoryChapter:
        """Create and persist a new StoryChapter."""
        chapter = StoryChapter(**fields)
        self.session.add(chapter)
        await self.session.flush()
        return chapter

    async def update(self, chapter: StoryChapter, **fields: object) -> StoryChapter:
        """Update fields on an existing StoryChapter entity."""
        for key, value in fields.items():
            if value is not None and hasattr(chapter, key):
                setattr(chapter, key, value)
        await self.session.flush()
        return chapter

    async def delete(self, chapter: StoryChapter) -> None:
        """Delete a StoryChapter entity."""
        await self.session.delete(chapter)
        await self.session.flush()
