"""Cosmos Platform — Agency Repository.

Encapsulates database operations for SpaceAgency entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agency import SpaceAgency


class AgencyRepository:
    """Repository managing database persistence for SpaceAgency entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, agency_id: UUID) -> SpaceAgency | None:
        """Fetch a SpaceAgency by primary key ID."""
        result = await self.session.execute(
            select(SpaceAgency).where(SpaceAgency.id == agency_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> SpaceAgency | None:
        """Fetch a SpaceAgency by unique slug."""
        result = await self.session.execute(
            select(SpaceAgency).where(SpaceAgency.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> SpaceAgency | None:
        """Fetch a SpaceAgency by name (case-insensitive)."""
        result = await self.session.execute(
            select(SpaceAgency).where(func.lower(SpaceAgency.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_id_or_slug(self, identifier: str | UUID) -> SpaceAgency | None:
        """Fetch a SpaceAgency by UUID or unique slug."""
        if isinstance(identifier, UUID):
            return await self.get_by_id(identifier)

        try:
            val_uuid = UUID(str(identifier))
            agency = await self.get_by_id(val_uuid)
            if agency:
                return agency
        except ValueError:
            pass

        return await self.get_by_slug(str(identifier))

    async def create(self, **fields: object) -> SpaceAgency:
        """Create and persist a new SpaceAgency."""
        agency = SpaceAgency(**fields)
        self.session.add(agency)
        await self.session.flush()
        return agency

    async def update(self, agency: SpaceAgency, **fields: object) -> SpaceAgency:
        """Update fields on an existing SpaceAgency entity."""
        for key, value in fields.items():
            if value is not None and hasattr(agency, key):
                setattr(agency, key, value)
        await self.session.flush()
        return agency

    async def delete(self, agency: SpaceAgency) -> None:
        """Delete a SpaceAgency entity from the database."""
        await self.session.delete(agency)
        await self.session.flush()

    async def list_agencies(
        self,
        search: str | None = None,
        country: str | None = None,
        sort: str = "name",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[SpaceAgency], int, int]:
        """List SpaceAgencies with optional search, country filter, sorting, and pagination."""
        query = select(SpaceAgency)
        filters = []

        if search:
            search_pattern = f"%{search}%"
            filters.append(
                or_(
                    SpaceAgency.name.ilike(search_pattern),
                    SpaceAgency.description.ilike(search_pattern),
                    SpaceAgency.country.ilike(search_pattern),
                    SpaceAgency.slug.ilike(search_pattern),
                )
            )

        if country:
            filters.append(SpaceAgency.country.ilike(f"%{country}%"))

        if filters:
            query = query.where(*filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_attr = getattr(SpaceAgency, sort, SpaceAgency.name)
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
