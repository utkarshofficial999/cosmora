"""Cosmos Platform — Universal Search Repository.

Executes cross-entity searches across Planets, Moons, Missions, Agencies, Timeline Events, and Stories.
"""

from datetime import datetime, timezone
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agency import SpaceAgency
from app.models.era import Era
from app.models.mission import Mission
from app.models.moon import Moon
from app.models.planet import Planet
from app.models.search_history import SearchHistory
from app.models.story import Story
from app.models.story_category import StoryCategory
from app.models.timeline import TimelineEvent
from app.schemas.search import SearchItem, SearchResultGroup


class SearchRepository:
    """Repository managing cross-module full-text search queries and analytics."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def log_search(self, user_id: UUID | None, keyword: str, module: str | None = None) -> None:
        """Log a search query to search_history for analytics."""
        history = SearchHistory(
            user_id=user_id,
            keyword=keyword.strip(),
            module=module,
            searched_at=datetime.now(timezone.utc),
        )
        self.session.add(history)
        await self.session.flush()

    async def search_planets(self, pattern: str, limit: int = 5) -> list[SearchItem]:
        """Search Planet entities."""
        query = (
            select(Planet)
            .where(
                or_(
                    Planet.name.ilike(pattern),
                    Planet.description.ilike(pattern),
                    Planet.atmosphere.ilike(pattern),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(query)
        items = result.scalars().all()
        return [
            SearchItem(
                id=p.id,
                title=p.name,
                slug=p.slug,
                module="planet",
                summary=p.description[:150] if p.description else None,
                cover_image=p.texture_url or p.image_url,
                relevance_score=1.0,
            )
            for p in items
        ]

    async def search_moons(self, pattern: str, limit: int = 5) -> list[SearchItem]:
        """Search Moon entities."""
        query = (
            select(Moon)
            .where(
                or_(
                    Moon.name.ilike(pattern),
                    Moon.description.ilike(pattern),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(query)
        items = result.scalars().all()
        return [
            SearchItem(
                id=m.id,
                title=m.name,
                slug=m.slug,
                module="moon",
                summary=m.description[:150] if m.description else None,
                cover_image=m.image_url,
                relevance_score=1.0,
            )
            for m in items
        ]

    async def search_missions(self, pattern: str, limit: int = 5) -> list[SearchItem]:
        """Search Mission entities."""
        query = (
            select(Mission)
            .where(
                or_(
                    Mission.name.ilike(pattern),
                    Mission.description.ilike(pattern),
                    Mission.destination.ilike(pattern),
                    Mission.spacecraft.ilike(pattern),
                    Mission.rocket.ilike(pattern),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(query)
        items = result.scalars().all()
        return [
            SearchItem(
                id=m.id,
                title=m.name,
                slug=m.slug,
                module="mission",
                summary=m.description[:150] if m.description else None,
                cover_image=m.cover_image or m.mission_patch,
                relevance_score=1.0,
            )
            for m in items
        ]

    async def search_agencies(self, pattern: str, limit: int = 5) -> list[SearchItem]:
        """Search SpaceAgency entities."""
        query = (
            select(SpaceAgency)
            .where(
                or_(
                    SpaceAgency.name.ilike(pattern),
                    SpaceAgency.description.ilike(pattern),
                    SpaceAgency.country.ilike(pattern),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(query)
        items = result.scalars().all()
        return [
            SearchItem(
                id=a.id,
                title=a.name,
                slug=a.slug,
                module="agency",
                summary=a.description[:150] if a.description else None,
                cover_image=a.logo_url,
                relevance_score=1.0,
            )
            for a in items
        ]

    async def search_timeline(self, pattern: str, limit: int = 5) -> list[SearchItem]:
        """Search TimelineEvent entities."""
        query = (
            select(TimelineEvent)
            .where(
                or_(
                    TimelineEvent.title.ilike(pattern),
                    TimelineEvent.short_description.ilike(pattern),
                    TimelineEvent.content.ilike(pattern),
                )
            )
            .limit(limit)
        )
        result = await self.session.execute(query)
        items = result.scalars().all()
        return [
            SearchItem(
                id=t.id,
                title=t.title,
                slug=t.slug,
                module="timeline",
                summary=t.short_description or (t.content[:150] if t.content else None),
                cover_image=t.image_url or t.thumbnail,
                relevance_score=1.0,
            )
            for t in items
        ]

    async def search_stories(self, pattern: str, limit: int = 5) -> list[SearchItem]:
        """Search Story entities."""
        query = (
            select(Story)
            .where(
                Story.status == "Published",
                or_(
                    Story.title.ilike(pattern),
                    Story.summary.ilike(pattern),
                    Story.content.ilike(pattern),
                    Story.author.ilike(pattern),
                ),
            )
            .limit(limit)
        )
        result = await self.session.execute(query)
        items = result.scalars().all()
        return [
            SearchItem(
                id=s.id,
                title=s.title,
                slug=s.slug,
                module="story",
                summary=s.summary or (s.content[:150] if s.content else None),
                cover_image=s.cover_image,
                relevance_score=1.0,
            )
            for s in items
        ]

    async def global_search(self, q: str, limit: int = 5) -> tuple[SearchResultGroup, int]:
        """Execute global search across all 6 core domain entities."""
        pattern = f"%{q}%"
        planets = await self.search_planets(pattern, limit=limit)
        moons = await self.search_moons(pattern, limit=limit)
        missions = await self.search_missions(pattern, limit=limit)
        agencies = await self.search_agencies(pattern, limit=limit)
        timeline = await self.search_timeline(pattern, limit=limit)
        stories = await self.search_stories(pattern, limit=limit)

        group = SearchResultGroup(
            planets=planets,
            moons=moons,
            missions=missions,
            agencies=agencies,
            timeline=timeline,
            stories=stories,
        )
        total = len(planets) + len(moons) + len(missions) + len(agencies) + len(timeline) + len(stories)
        return group, total

    async def get_trending_keywords(self, limit: int = 5) -> list[str]:
        """Fetch popular keywords searched on the platform."""
        result = await self.session.execute(
            select(SearchHistory.keyword, func.count(SearchHistory.id).label("cnt"))
            .group_by(SearchHistory.keyword)
            .order_by(func.count(SearchHistory.id).desc())
            .limit(limit)
        )
        return [row[0] for row in result.all()]
