"""Cosmos Platform — Planet Fact Repository.

Encapsulates database operations for PlanetFact entities using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.planet_fact import PlanetFact


class PlanetFactRepository:
    """Repository managing database persistence for PlanetFact entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, fact_id: UUID) -> PlanetFact | None:
        """Fetch a PlanetFact by primary key ID."""
        result = await self.session.execute(
            select(PlanetFact).where(PlanetFact.id == fact_id)
        )
        return result.scalar_one_or_none()

    async def get_by_planet_id(self, planet_id: UUID) -> Sequence[PlanetFact]:
        """Fetch all PlanetFacts associated with a specific planet sorted by display order."""
        result = await self.session.execute(
            select(PlanetFact)
            .where(PlanetFact.planet_id == planet_id)
            .order_by(PlanetFact.display_order.asc(), PlanetFact.created_at.asc())
        )
        return result.scalars().all()

    async def create(self, **fields: object) -> PlanetFact:
        """Create and persist a new PlanetFact."""
        fact = PlanetFact(**fields)
        self.session.add(fact)
        await self.session.flush()
        return fact

    async def update(self, fact: PlanetFact, **fields: object) -> PlanetFact:
        """Update fields on an existing PlanetFact entity."""
        for key, value in fields.items():
            if value is not None and hasattr(fact, key):
                setattr(fact, key, value)
        await self.session.flush()
        return fact

    async def delete(self, fact: PlanetFact) -> None:
        """Delete a PlanetFact entity from the database."""
        await self.session.delete(fact)
        await self.session.flush()
