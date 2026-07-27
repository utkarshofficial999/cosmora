"""Cosmos Platform — Era Repository.

Encapsulates database operations for Era domain models using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.era import Era


class EraRepository:
    """Repository managing database persistence for Era entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, era_id: UUID) -> Era | None:
        """Fetch an Era by its primary key ID."""
        result = await self.session.execute(
            select(Era).where(Era.id == era_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Era | None:
        """Fetch an Era by its unique slug."""
        result = await self.session.execute(
            select(Era).where(Era.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Era | None:
        """Fetch an Era by name (case-insensitive)."""
        result = await self.session.execute(
            select(Era).where(func.lower(Era.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        name: str,
        slug: str,
        description: str | None = None,
        start_year: int | None = None,
        end_year: int | None = None,
        color: str | None = None,
    ) -> Era:
        """Create and persist a new Era."""
        era = Era(
            name=name,
            slug=slug,
            description=description,
            start_year=start_year,
            end_year=end_year,
            color=color,
        )
        self.session.add(era)
        await self.session.flush()
        return era

    async def update(self, era: Era, **fields: object) -> Era:
        """Update fields on an existing Era entity."""
        for key, value in fields.items():
            if value is not None and hasattr(era, key):
                setattr(era, key, value)
        await self.session.flush()
        return era

    async def delete(self, era: Era) -> None:
        """Delete an Era entity from the database."""
        await self.session.delete(era)
        await self.session.flush()

    async def list_eras(
        self,
        search: str | None = None,
        sort: str = "start_year",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Era], int, int]:
        """List Eras with optional search, sorting, and pagination.

        Returns:
            Tuple of (list_of_eras, total_count, total_pages)
        """
        query = select(Era)

        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    Era.name.ilike(search_pattern),
                    Era.description.ilike(search_pattern),
                    Era.slug.ilike(search_pattern),
                )
            )

        # Count total matching records
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_attr = getattr(Era, sort, Era.start_year)
        if order.lower() == "desc":
            query = query.order_by(sort_attr.desc().nulls_last())
        else:
            query = query.order_by(sort_attr.asc().nulls_last())

        # Pagination limit & offset
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, pages
