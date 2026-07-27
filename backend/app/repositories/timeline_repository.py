"""Cosmos Platform — Timeline Repository.

Encapsulates database operations for TimelineEvent entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.era import Era
from app.models.timeline import TimelineEvent


class TimelineRepository:
    """Repository managing database persistence for TimelineEvent entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, event_id: UUID) -> TimelineEvent | None:
        """Fetch a TimelineEvent by its primary key ID with loaded relationships."""
        result = await self.session.execute(
            select(TimelineEvent)
            .options(
                selectinload(TimelineEvent.era),
                selectinload(TimelineEvent.media),
            )
            .where(TimelineEvent.id == event_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> TimelineEvent | None:
        """Fetch a TimelineEvent by unique slug with loaded relationships."""
        result = await self.session.execute(
            select(TimelineEvent)
            .options(
                selectinload(TimelineEvent.era),
                selectinload(TimelineEvent.media),
            )
            .where(TimelineEvent.slug == slug)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        title: str,
        slug: str,
        content: str,
        year: int,
        era_id: UUID,
        short_description: str | None = None,
        event_date: str | None = None,
        importance: int = 1,
        image_url: str | None = None,
        thumbnail: str | None = None,
        is_featured: bool = False,
        created_by: UUID | None = None,
    ) -> TimelineEvent:
        """Create and persist a new TimelineEvent."""
        event = TimelineEvent(
            title=title,
            slug=slug,
            short_description=short_description,
            content=content,
            event_date=event_date,
            year=year,
            importance=importance,
            image_url=image_url,
            thumbnail=thumbnail,
            era_id=era_id,
            is_featured=is_featured,
            created_by=created_by,
        )
        self.session.add(event)
        await self.session.flush()
        return event

    async def update(self, event: TimelineEvent, **fields: object) -> TimelineEvent:
        """Update fields on an existing TimelineEvent."""
        for key, value in fields.items():
            if value is not None and hasattr(event, key):
                setattr(event, key, value)
        await self.session.flush()
        return event

    async def delete(self, event: TimelineEvent) -> None:
        """Delete a TimelineEvent from the database."""
        await self.session.delete(event)
        await self.session.flush()

    async def list_events(
        self,
        search: str | None = None,
        era: str | None = None,
        year: int | None = None,
        featured: bool | None = None,
        sort: str = "year",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[TimelineEvent], int, int]:
        """List TimelineEvents with search, filtering, sorting, and pagination.

        Returns:
            Tuple of (list_of_events, total_count, total_pages)
        """
        query = (
            select(TimelineEvent)
            .options(
                selectinload(TimelineEvent.era),
                selectinload(TimelineEvent.media),
            )
            .join(TimelineEvent.era)
        )

        filters = []

        if search:
            search_pattern = f"%{search}%"
            search_conditions = [
                TimelineEvent.title.ilike(search_pattern),
                TimelineEvent.content.ilike(search_pattern),
                TimelineEvent.short_description.ilike(search_pattern),
                Era.name.ilike(search_pattern),
                Era.slug.ilike(search_pattern),
            ]
            if search.lstrip("-").isdigit():
                search_conditions.append(TimelineEvent.year == int(search))
            filters.append(or_(*search_conditions))

        if era:
            # Era can be UUID string or slug
            try:
                era_uuid = UUID(era)
                filters.append(TimelineEvent.era_id == era_uuid)
            except ValueError:
                filters.append(Era.slug == era)

        if year is not None:
            filters.append(TimelineEvent.year == year)

        if featured is not None:
            filters.append(TimelineEvent.is_featured == featured)

        if filters:
            query = query.where(*filters)

        # Count total matching records
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_field_map = {
            "year": TimelineEvent.year,
            "importance": TimelineEvent.importance,
            "created_at": TimelineEvent.created_at,
            "title": TimelineEvent.title,
        }
        sort_attr = sort_field_map.get(sort, TimelineEvent.year)
        if order.lower() == "desc":
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, pages
