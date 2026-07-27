"""Cosmos Platform — Milestone Repository.

Encapsulates database operations for MissionMilestone entities using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.milestone import MissionMilestone


class MilestoneRepository:
    """Repository managing database persistence for MissionMilestone entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, milestone_id: UUID) -> MissionMilestone | None:
        """Fetch a MissionMilestone by primary key ID."""
        result = await self.session.execute(
            select(MissionMilestone).where(MissionMilestone.id == milestone_id)
        )
        return result.scalar_one_or_none()

    async def get_by_mission_id(self, mission_id: UUID) -> Sequence[MissionMilestone]:
        """Fetch all milestones associated with a mission, sorted by display_order."""
        result = await self.session.execute(
            select(MissionMilestone)
            .where(MissionMilestone.mission_id == mission_id)
            .order_by(MissionMilestone.display_order.asc(), MissionMilestone.created_at.asc())
        )
        return result.scalars().all()

    async def create(self, **fields: object) -> MissionMilestone:
        """Create and persist a new MissionMilestone."""
        milestone = MissionMilestone(**fields)
        self.session.add(milestone)
        await self.session.flush()
        return milestone

    async def update(self, milestone: MissionMilestone, **fields: object) -> MissionMilestone:
        """Update fields on an existing MissionMilestone entity."""
        for key, value in fields.items():
            if value is not None and hasattr(milestone, key):
                setattr(milestone, key, value)
        await self.session.flush()
        return milestone

    async def delete(self, milestone: MissionMilestone) -> None:
        """Delete a MissionMilestone entity from the database."""
        await self.session.delete(milestone)
        await self.session.flush()
