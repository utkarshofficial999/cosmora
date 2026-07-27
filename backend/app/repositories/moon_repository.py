"""Cosmos Platform — Moon Repository.

Encapsulates database operations for Moon entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.moon import Moon


class MoonRepository:
    """Repository managing database persistence for Moon entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, moon_id: UUID) -> Moon | None:
        """Fetch a Moon by primary key ID."""
        result = await self.session.execute(
            select(Moon).where(Moon.id == moon_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Moon | None:
        """Fetch a Moon by unique slug."""
        result = await self.session.execute(
            select(Moon).where(Moon.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Moon | None:
        """Fetch a Moon by name (case-insensitive)."""
        result = await self.session.execute(
            select(Moon).where(func.lower(Moon.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_planet_id(self, planet_id: UUID) -> Sequence[Moon]:
        """Fetch all Moons associated with a specific planet."""
        result = await self.session.execute(
            select(Moon).where(Moon.planet_id == planet_id).order_by(Moon.name.asc())
        )
        return result.scalars().all()

    async def create(self, **fields: object) -> Moon:
        """Create and persist a new Moon."""
        moon = Moon(**fields)
        self.session.add(moon)
        await self.session.flush()
        return moon

    async def update(self, moon: Moon, **fields: object) -> Moon:
        """Update fields on an existing Moon entity."""
        for key, value in fields.items():
            if value is not None and hasattr(moon, key):
                setattr(moon, key, value)
        await self.session.flush()
        return moon

    async def delete(self, moon: Moon) -> None:
        """Delete a Moon entity from the database."""
        await self.session.delete(moon)
        await self.session.flush()

    async def list_moons(
        self,
        search: str | None = None,
        planet_id: UUID | None = None,
        sort: str = "name",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Moon], int, int]:
        """List Moons with optional search, planet filter, sorting, and pagination."""
        query = select(Moon)
        filters = []

        if search:
            search_pattern = f"%{search}%"
            filters.append(
                or_(
                    Moon.name.ilike(search_pattern),
                    Moon.description.ilike(search_pattern),
                    Moon.slug.ilike(search_pattern),
                )
            )

        if planet_id is not None:
            filters.append(Moon.planet_id == planet_id)

        if filters:
            query = query.where(*filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_attr = getattr(Moon, sort, Moon.name)
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
