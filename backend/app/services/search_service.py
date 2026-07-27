"""Cosmos Platform — Search Service.

Implements business logic for Universal Search & Discovery across all space modules.
"""

from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.search_repository import SearchRepository
from app.schemas.search import (
    SearchHistoryResponse,
    SearchItem,
    SearchResponse,
    SearchResultGroup,
    SearchSuggestionResponse,
    TrendingSearchResponse,
)


class SearchService:
    """Service handling multi-module search, autocomplete, and search analytics."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.search_repo = SearchRepository(session)

    async def global_search(
        self,
        q: str,
        user_id: UUID | None = None,
        limit: int = 5,
    ) -> SearchResponse:
        """Execute universal cross-module search."""
        if not q or not q.strip():
            return SearchResponse(query="", total_results=0, results=SearchResultGroup())

        query_str = q.strip()
        await self.search_repo.log_search(user_id=user_id, keyword=query_str)

        results_group, total = await self.search_repo.global_search(query_str, limit=limit)
        return SearchResponse(query=query_str, total_results=total, results=results_group)

    async def get_suggestions(self, q: str) -> SearchSuggestionResponse:
        """Provide autocomplete suggestions matching a search prefix."""
        if not q or len(q.strip()) < 1:
            return SearchSuggestionResponse()

        pattern = f"%{q.strip()}%"
        planets = await self.search_repo.search_planets(pattern, limit=3)
        missions = await self.search_repo.search_missions(pattern, limit=3)
        stories = await self.search_repo.search_stories(pattern, limit=3)

        titles = [p.title for p in planets] + [m.title for m in missions] + [s.title for s in stories]
        popular = await self.search_repo.get_trending_keywords(limit=3)

        return SearchSuggestionResponse(
            matching_titles=titles,
            popular_searches=popular,
            categories=["Planets", "Missions", "Stories", "Timeline"],
        )

    async def get_trending_searches(self) -> TrendingSearchResponse:
        """Fetch trending keywords and popular content highlights."""
        keywords = await self.search_repo.get_trending_keywords(limit=5)
        popular_planets = await self.search_repo.search_planets("%", limit=3)
        popular_missions = await self.search_repo.search_missions("%", limit=3)
        trending_stories = await self.search_repo.search_stories("%", limit=3)

        return TrendingSearchResponse(
            keywords=keywords,
            popular_planets=popular_planets,
            popular_missions=popular_missions,
            trending_stories=trending_stories,
        )

    async def search_module(self, module: str, q: str, limit: int = 10) -> list[SearchItem]:
        """Search within a specific target module."""
        pattern = f"%{q.strip()}%"
        mod_lower = module.lower()

        if mod_lower == "planets":
            return await self.search_repo.search_planets(pattern, limit=limit)
        if mod_lower == "missions":
            return await self.search_repo.search_missions(pattern, limit=limit)
        if mod_lower == "stories":
            return await self.search_repo.search_stories(pattern, limit=limit)
        if mod_lower == "timeline":
            return await self.search_repo.search_timeline(pattern, limit=limit)
        if mod_lower == "agencies":
            return await self.search_repo.search_agencies(pattern, limit=limit)

        return []
