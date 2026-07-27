"""Cosmos Platform — Story Repository.

Encapsulates database operations for Story entities using SQLAlchemy Async 2.0.
"""

from datetime import datetime
from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.story import Story
from app.models.story_category import StoryCategory
from app.models.story_tag import StoryTag


class StoryRepository:
    """Repository managing database persistence for Story entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, story_id: UUID) -> Story | None:
        """Fetch a Story by primary key ID with category, tags, and chapters."""
        result = await self.session.execute(
            select(Story)
            .options(
                selectinload(Story.category),
                selectinload(Story.tags),
                selectinload(Story.chapters),
            )
            .where(Story.id == story_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Story | None:
        """Fetch a Story by unique slug with category, tags, and chapters."""
        result = await self.session.execute(
            select(Story)
            .options(
                selectinload(Story.category),
                selectinload(Story.tags),
                selectinload(Story.chapters),
            )
            .where(Story.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_title(self, title: str) -> Story | None:
        """Fetch a Story by title (case-insensitive)."""
        result = await self.session.execute(
            select(Story).where(func.lower(Story.title) == title.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_id_or_slug(self, identifier: str | UUID) -> Story | None:
        """Fetch a Story by UUID or unique slug."""
        if isinstance(identifier, UUID):
            return await self.get_by_id(identifier)

        try:
            val_uuid = UUID(str(identifier))
            story = await self.get_by_id(val_uuid)
            if story:
                return story
        except ValueError:
            pass

        return await self.get_by_slug(str(identifier))

    async def create(self, **fields: object) -> Story:
        """Create and persist a new Story."""
        tags = fields.pop("tags", None)
        story = Story(**fields)
        if tags is not None:
            story.tags = list(tags)

        self.session.add(story)
        await self.session.flush()
        return story

    async def update(self, story: Story, **fields: object) -> Story:
        """Update fields on an existing Story entity."""
        tags = fields.pop("tags", None)
        if tags is not None:
            story.tags = list(tags)

        for key, value in fields.items():
            if value is not None and hasattr(story, key):
                setattr(story, key, value)
        await self.session.flush()
        return story

    async def increment_view_count(self, story_id: UUID) -> None:
        """Increment story view count for trending metrics."""
        story = await self.get_by_id(story_id)
        if story:
            story.view_count += 1
            await self.session.flush()

    async def delete(self, story: Story) -> None:
        """Delete a Story entity."""
        await self.session.delete(story)
        await self.session.flush()

    async def list_stories(
        self,
        search: str | None = None,
        category: str | None = None,
        tag: str | None = None,
        author: str | None = None,
        difficulty: str | None = None,
        story_type: str | None = None,
        status: str | None = None,
        featured: bool | None = None,
        published_after: datetime | None = None,
        sort: str = "created_at",
        order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Story], int, int]:
        """List Stories with full search, multi-field filtering, sorting, and pagination."""
        query = (
            select(Story)
            .options(
                selectinload(Story.category),
                selectinload(Story.tags),
                selectinload(Story.chapters),
            )
            .outerjoin(Story.category)
        )

        filters = []

        if search:
            search_pattern = f"%{search}%"
            filters.append(
                or_(
                    Story.title.ilike(search_pattern),
                    Story.summary.ilike(search_pattern),
                    Story.content.ilike(search_pattern),
                    Story.author.ilike(search_pattern),
                    StoryCategory.name.ilike(search_pattern),
                )
            )

        if category:
            try:
                cat_uuid = UUID(category)
                filters.append(Story.category_id == cat_uuid)
            except ValueError:
                filters.append(StoryCategory.slug == category)

        if tag:
            query = query.join(Story.tags)
            try:
                tag_uuid = UUID(tag)
                filters.append(StoryTag.id == tag_uuid)
            except ValueError:
                filters.append(StoryTag.slug == tag)

        if author:
            filters.append(Story.author.ilike(f"%{author}%"))

        if difficulty:
            filters.append(func.lower(Story.difficulty) == difficulty.lower())

        if story_type:
            filters.append(func.lower(Story.story_type) == story_type.lower())

        if status:
            filters.append(func.lower(Story.status) == status.lower())

        if featured is not None:
            filters.append(Story.is_featured == featured)

        if published_after:
            filters.append(Story.published_at >= published_after)

        if filters:
            query = query.where(*filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_field_map = {
            "created_at": Story.created_at,
            "published_at": Story.published_at,
            "view_count": Story.view_count,
            "title": Story.title,
        }
        sort_attr = sort_field_map.get(sort, Story.created_at)
        if order.lower() == "desc":
            query = query.order_by(sort_attr.desc().nulls_last())
        else:
            query = query.order_by(sort_attr.asc().nulls_last())

        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, pages
