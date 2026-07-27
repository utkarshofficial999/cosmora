"""Cosmos Platform — Universal Search Schemas.

Defines Pydantic v2 schemas for Universal Search & Discovery endpoints.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class SearchItem(BaseModel):
    """Unified search result item representing an entity from any module."""

    id: UUID | str
    title: str
    slug: str
    module: str = Field(..., description="Source module (planet, moon, mission, agency, timeline, story)")
    summary: str | None = None
    cover_image: str | None = None
    relevance_score: float = Field(1.0, description="Search relevance score")

    model_config = ConfigDict(from_attributes=True)


class SearchResultGroup(BaseModel):
    """Categorized search result buckets."""

    planets: list[SearchItem] = Field(default_factory=list)
    moons: list[SearchItem] = Field(default_factory=list)
    missions: list[SearchItem] = Field(default_factory=list)
    agencies: list[SearchItem] = Field(default_factory=list)
    timeline: list[SearchItem] = Field(default_factory=list)
    stories: list[SearchItem] = Field(default_factory=list)


class SearchResponse(BaseModel):
    """Universal search response payload."""

    query: str
    total_results: int
    results: SearchResultGroup


class SearchSuggestionResponse(BaseModel):
    """Autocomplete search suggestions."""

    matching_titles: list[str] = Field(default_factory=list)
    popular_searches: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)


class TrendingSearchResponse(BaseModel):
    """Trending topics and popular platform content."""

    keywords: list[str] = Field(default_factory=list)
    popular_planets: list[SearchItem] = Field(default_factory=list)
    popular_missions: list[SearchItem] = Field(default_factory=list)
    trending_stories: list[SearchItem] = Field(default_factory=list)


class SearchHistoryResponse(BaseModel):
    """Search history record."""

    id: UUID
    keyword: str
    module: str | None = None
    searched_at: datetime

    model_config = ConfigDict(from_attributes=True)
