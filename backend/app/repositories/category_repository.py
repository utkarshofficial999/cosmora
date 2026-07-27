"""Cosmos Platform — StoryCategory Repository.

Encapsulates database operations for StoryCategory entities using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.story_category import StoryCategory


class StoryCategoryRepository:
    """Repository managing database persistence for StoryCategory entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, category_id: UUID) -> StoryCategory | None:
        """Fetch a StoryCategory by primary key ID."""
        result = await self.session.execute(
            select(StoryCategory).where(StoryCategory.id == category_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> StoryCategory | None:
        """Fetch a StoryCategory by unique slug."""
        result = await self.session.execute(
            select(StoryCategory).where(StoryCategory.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> StoryCategory | None:
        """Fetch a StoryCategory by name (case-insensitive)."""
        result = await self.session.execute(
            select(StoryCategory).where(func.lower(StoryCategory.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_id_or_slug(self, identifier: str | UUID) -> StoryCategory | None:
        """Fetch a StoryCategory by UUID or unique slug."""
        if isinstance(identifier, UUID):
            return await self.get_by_id(identifier)

        try:
            val_uuid = UUID(str(identifier))
            cat = await self.get_by_id(val_uuid)
            if cat:
                return cat
        except ValueError:
            pass

        return await self.get_by_slug(str(identifier))

    async def create(self, **fields: object) -> StoryCategory:
        """Create and persist a new StoryCategory."""
        category = StoryCategory(**fields)
        self.session.add(category)
        await self.session.flush()
        return category

    async def update(self, category: StoryCategory, **fields: object) -> StoryCategory:
        """Update fields on an existing StoryCategory entity."""
        for key, value in fields.items():
            if value is not None and hasattr(category, key):
                setattr(category, key, value)
        await self.session.flush()
        return category

    async def delete(self, category: StoryCategory) -> None:
        """Delete a StoryCategory entity."""
        await self.session.delete(category)
        await self.session.flush()

    async def list_categories(self) -> Sequence[StoryCategory]:
        """List all StoryCategories ordered by name."""
        result = await self.session.execute(
            select(StoryCategory).order_by(StoryCategory.name.asc())
        )
        return result.scalars().all()
