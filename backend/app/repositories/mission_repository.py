"""Cosmos Platform — Mission Repository.

Encapsulates database operations for Mission entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import extract, func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.agency import SpaceAgency
from app.models.mission import Mission


class MissionRepository:
    """Repository managing database persistence for Mission entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, mission_id: UUID) -> Mission | None:
        """Fetch a Mission by primary key ID with loaded relationships."""
        result = await self.session.execute(
            select(Mission)
            .options(
                selectinload(Mission.agency),
                selectinload(Mission.milestones),
                selectinload(Mission.media),
            )
            .where(Mission.id == mission_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Mission | None:
        """Fetch a Mission by unique slug with loaded relationships."""
        result = await self.session.execute(
            select(Mission)
            .options(
                selectinload(Mission.agency),
                selectinload(Mission.milestones),
                selectinload(Mission.media),
            )
            .where(Mission.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Mission | None:
        """Fetch a Mission by name (case-insensitive)."""
        result = await self.session.execute(
            select(Mission).where(func.lower(Mission.name) == name.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_id_or_slug(self, identifier: str | UUID) -> Mission | None:
        """Fetch a Mission by UUID or unique slug."""
        if isinstance(identifier, UUID):
            return await self.get_by_id(identifier)

        try:
            val_uuid = UUID(str(identifier))
            mission = await self.get_by_id(val_uuid)
            if mission:
                return mission
        except ValueError:
            pass

        return await self.get_by_slug(str(identifier))

    async def create(self, **fields: object) -> Mission:
        """Create and persist a new Mission."""
        mission = Mission(**fields)
        self.session.add(mission)
        await self.session.flush()
        return mission

    async def update(self, mission: Mission, **fields: object) -> Mission:
        """Update fields on an existing Mission entity."""
        for key, value in fields.items():
            if value is not None and hasattr(mission, key):
                setattr(mission, key, value)
        await self.session.flush()
        return mission

    async def delete(self, mission: Mission) -> None:
        """Delete a Mission entity from the database."""
        await self.session.delete(mission)
        await self.session.flush()

    async def list_missions(
        self,
        search: str | None = None,
        agency: str | None = None,
        destination: str | None = None,
        mission_type: str | None = None,
        status: str | None = None,
        year: int | None = None,
        featured: bool | None = None,
        sort: str = "launch_date",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Mission], int, int]:
        """List Missions with comprehensive search, multi-field filtering, sorting, and pagination."""
        query = (
            select(Mission)
            .options(
                selectinload(Mission.agency),
                selectinload(Mission.milestones),
                selectinload(Mission.media),
            )
            .join(Mission.agency)
        )

        filters = []

        if search:
            search_pattern = f"%{search}%"
            filters.append(
                or_(
                    Mission.name.ilike(search_pattern),
                    Mission.description.ilike(search_pattern),
                    Mission.objective.ilike(search_pattern),
                    Mission.destination.ilike(search_pattern),
                    Mission.spacecraft.ilike(search_pattern),
                    Mission.rocket.ilike(search_pattern),
                    SpaceAgency.name.ilike(search_pattern),
                    SpaceAgency.slug.ilike(search_pattern),
                )
            )

        if agency:
            try:
                agency_uuid = UUID(agency)
                filters.append(Mission.agency_id == agency_uuid)
            except ValueError:
                filters.append(SpaceAgency.slug == agency)

        if destination:
            filters.append(Mission.destination.ilike(f"%{destination}%"))

        if mission_type:
            filters.append(Mission.mission_type.ilike(f"%{mission_type}%"))

        if status:
            filters.append(func.lower(Mission.status) == status.lower())

        if year is not None:
            filters.append(extract("year", Mission.launch_date) == year)

        if featured is not None:
            filters.append(Mission.is_featured == featured)

        if filters:
            query = query.where(*filters)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await self.session.execute(count_query)
        total = total_count_result.scalar_one()

        # Sorting
        sort_field_map = {
            "launch_date": Mission.launch_date,
            "name": Mission.name,
            "created_at": Mission.created_at,
            "status": Mission.status,
        }
        sort_attr = sort_field_map.get(sort, Mission.launch_date)
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
