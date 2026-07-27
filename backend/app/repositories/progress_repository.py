"""Cosmos Platform — StoryProgress Repository.

Encapsulates database operations for user reading progress using SQLAlchemy Async 2.0.
"""

from datetime import datetime, timezone
from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.reading_progress import StoryProgress


class StoryProgressRepository:
    """Repository managing user story reading progress and history persistence."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_user_and_story(self, user_id: UUID, story_id: UUID) -> StoryProgress | None:
        """Fetch reading progress for a user and story combination."""
        result = await self.session.execute(
            select(StoryProgress)
            .options(selectinload(StoryProgress.story))
            .where(StoryProgress.user_id == user_id, StoryProgress.story_id == story_id)
        )
        return result.scalar_one_or_none()

    async def upsert_progress(
        self,
        user_id: UUID,
        story_id: UUID,
        last_chapter: int,
        progress_percentage: float,
        completed: bool,
    ) -> StoryProgress:
        """Upsert reading progress record for a user."""
        existing = await self.get_by_user_and_story(user_id, story_id)
        now = datetime.now(timezone.utc)

        if existing:
            existing.last_chapter = last_chapter
            existing.progress_percentage = progress_percentage
            existing.completed = completed or existing.completed
            existing.last_read_at = now
            await self.session.flush()
            return existing

        progress = StoryProgress(
            user_id=user_id,
            story_id=story_id,
            last_chapter=last_chapter,
            progress_percentage=progress_percentage,
            completed=completed,
            last_read_at=now,
        )
        self.session.add(progress)
        await self.session.flush()
        return progress

    async def get_user_reading_history(self, user_id: UUID, limit: int = 20) -> Sequence[StoryProgress]:
        """Fetch a user's recent reading history ordered by last_read_at desc."""
        result = await self.session.execute(
            select(StoryProgress)
            .options(selectinload(StoryProgress.story))
            .where(StoryProgress.user_id == user_id)
            .order_by(StoryProgress.last_read_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_user_continue_reading(self, user_id: UUID, limit: int = 10) -> Sequence[StoryProgress]:
        """Fetch in-progress stories (not yet completed) for a user."""
        result = await self.session.execute(
            select(StoryProgress)
            .options(selectinload(StoryProgress.story))
            .where(StoryProgress.user_id == user_id, StoryProgress.completed == False)  # noqa: E712
            .order_by(StoryProgress.last_read_at.desc())
            .limit(limit)
        )
        return result.scalars().all()
