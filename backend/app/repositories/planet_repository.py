"""Cosmos Platform — Planet Repository.

Encapsulates database operations for Planet entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.planet import Planet


class PlanetRepository:
    """Repository managing database persistence for Planet entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, planet_id: UUID) -> Planet | None:
        """Fetch a Planet by primary key ID."""
        result = await self.session.execute(
            select(Planet).where(Planet.id == planet_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Planet | None:
        """Fetch a Planet by unique slug."""
        result = await self.session.execute(
            select(Planet).where(Planet.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Planet | None:
        """Fetch a Planet by name (case-insensitive)."""
        result = await self.session.execute(
            select(Planet).where(func.lower(Planet.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_id_or_slug(self, identifier: str | UUID) -> Planet | None:
        """Fetch a Planet by either UUID primary key or unique slug."""
        if isinstance(identifier, UUID):
            return await self.get_by_id(identifier)

        try:
            val_uuid = UUID(str(identifier))
            planet = await self.get_by_id(val_uuid)
            if planet:
                return planet
        except ValueError:
            pass

        return await self.get_by_slug(str(identifier))

    async def get_overview_by_id_or_slug(self, identifier: str | UUID) -> Planet | None:
        """Fetch a Planet with preloaded moons and facts relationships."""
        query = select(Planet).options(
            selectinload(Planet.moons),
            selectinload(Planet.facts),
        )
        if isinstance(identifier, UUID):
            query = query.where(Planet.id == identifier)
        else:
            try:
                val_uuid = UUID(str(identifier))
                query = query.where(or_(Planet.id == val_uuid, Planet.slug == str(identifier)))
            except ValueError:
                query = query.where(Planet.slug == str(identifier))

        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def create(self, **fields: object) -> Planet:
        """Create and persist a new Planet."""
        planet = Planet(**fields)
        self.session.add(planet)
        await self.session.flush()
        return planet

    async def update(self, planet: Planet, **fields: object) -> Planet:
        """Update fields on an existing Planet entity."""
        for key, value in fields.items():
            if value is not None and hasattr(planet, key):
                setattr(planet, key, value)
        await self.session.flush()
        return planet

    async def delete(self, planet: Planet) -> None:
        """Delete a Planet entity from the database."""
        await self.session.delete(planet)
        await self.session.flush()

    async def list_planets(
        self,
        search: str | None = None,
        habitable: bool | None = None,
        has_moons: bool | None = None,
        sort: str = "distance_from_sun",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Planet], int, int]:
        """List Planets with optional search, filters, sorting, and pagination."""
        query = select(Planet)
        filters = []

        if search:
            search_pattern = f"%{search}%"
            filters.append(
                or_(
                    Planet.name.ilike(search_pattern),
                    Planet.description.ilike(search_pattern),
                    Planet.atmosphere.ilike(search_pattern),
                    Planet.slug.ilike(search_pattern),
                )
            )

        if habitable is not None:
            filters.append(Planet.is_habitable == habitable)

        if has_moons is not None:
            if has_moons:
                filters.append(Planet.number_of_moons > 0)
            else:
                filters.append(Planet.number_of_moons == 0)

        if filters:
            query = query.where(*filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_attr = getattr(Planet, sort, Planet.distance_from_sun)
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
