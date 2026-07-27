"""Cosmos Platform — Embedding Service.

Generates text vector embeddings and indexes platform content for semantic RAG search.
"""

import hashlib
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agency import SpaceAgency
from app.models.embedding_document import EmbeddingDocument
from app.models.mission import Mission
from app.models.moon import Moon
from app.models.planet import Planet
from app.models.planet_fact import PlanetFact
from app.models.story import Story
from app.models.timeline import TimelineEvent
from app.repositories.embedding_repository import EmbeddingRepository


def generate_text_embedding(text: str, dim: int = 64) -> list[float]:
    """Deterministic, normalized pseudo-semantic vector generator for text strings."""
    vector = []
    clean_text = text.lower().strip()
    for i in range(dim):
        seed = f"{clean_text}:{i}"
        digest = hashlib.md5(seed.encode("utf-8")).hexdigest()
        val = (int(digest[:8], 16) / 0xFFFFFFFF) * 2.0 - 1.0
        vector.append(val)

    # Normalize vector to unit length
    norm = (sum(v * v for v in vector)) ** 0.5
    if norm > 0:
        vector = [v / norm for v in vector]
    return vector


class EmbeddingService:
    """Service handling text embedding generation and full platform batch indexing."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.embedding_repo = EmbeddingRepository(session)

    async def index_document(
        self,
        resource_type: str,
        resource_id: str,
        title: str,
        content: str,
        metadata: dict[str, Any] | None = None,
    ) -> EmbeddingDocument:
        """Index or update a single document vector embedding."""
        text_for_embedding = f"{title} {content}"
        vector = generate_text_embedding(text_for_embedding)
        return await self.embedding_repo.create_or_update(
            resource_type=resource_type,
            resource_id=str(resource_id),
            title=title,
            content=content,
            embedding=vector,
            metadata=metadata,
        )

    async def delete_document(self, resource_type: str, resource_id: str) -> None:
        """Remove a document embedding from the vector index."""
        await self.embedding_repo.delete_by_resource(resource_type, resource_id)

    async def batch_rebuild_all_embeddings(self) -> int:
        """Batch index all platform entities (Stories, Timeline, Planets, Moons, Missions, Agencies, Facts)."""
        await self.embedding_repo.delete_all()
        indexed_count = 0

        # 1. Stories
        stories_res = await self.session.execute(select(Story).where(Story.status == "Published"))
        for story in stories_res.scalars().all():
            await self.index_document(
                resource_type="Story",
                resource_id=str(story.id),
                title=story.title,
                content=story.content or story.summary or "",
                metadata={"slug": story.slug, "difficulty": story.difficulty},
            )
            indexed_count += 1

        # 2. Timeline Events
        timeline_res = await self.session.execute(select(TimelineEvent))
        for event in timeline_res.scalars().all():
            await self.index_document(
                resource_type="TimelineEvent",
                resource_id=str(event.id),
                title=event.title,
                content=event.content or event.short_description or "",
                metadata={"slug": event.slug, "year": event.year},
            )
            indexed_count += 1

        # 3. Planets
        planets_res = await self.session.execute(select(Planet))
        for planet in planets_res.scalars().all():
            await self.index_document(
                resource_type="Planet",
                resource_id=str(planet.id),
                title=planet.name,
                content=planet.description or f"Planet {planet.name} in the solar system.",
                metadata={"slug": planet.slug, "is_habitable": planet.is_habitable},
            )
            indexed_count += 1

        # 4. Moons
        moons_res = await self.session.execute(select(Moon))
        for moon in moons_res.scalars().all():
            await self.index_document(
                resource_type="Moon",
                resource_id=str(moon.id),
                title=moon.name,
                content=moon.description or f"Moon {moon.name} orbiting planet.",
                metadata={"slug": moon.slug},
            )
            indexed_count += 1

        # 5. Missions
        missions_res = await self.session.execute(select(Mission))
        for mission in missions_res.scalars().all():
            await self.index_document(
                resource_type="Mission",
                resource_id=str(mission.id),
                title=mission.name,
                content=mission.description or f"Mission {mission.name} to {mission.destination}.",
                metadata={"slug": mission.slug, "status": mission.status},
            )
            indexed_count += 1

        # 6. Space Agencies
        agencies_res = await self.session.execute(select(SpaceAgency))
        for agency in agencies_res.scalars().all():
            await self.index_document(
                resource_type="SpaceAgency",
                resource_id=str(agency.id),
                title=agency.name,
                content=agency.description or f"Space agency {agency.name} based in {agency.country}.",
                metadata={"slug": agency.slug, "country": agency.country},
            )
            indexed_count += 1

        # 7. Planet Facts
        facts_res = await self.session.execute(select(PlanetFact))
        for fact in facts_res.scalars().all():
            await self.index_document(
                resource_type="PlanetFact",
                resource_id=str(fact.id),
                title=fact.title,
                content=fact.fact,
                metadata={"category": fact.category},
            )
            indexed_count += 1

        return indexed_count
