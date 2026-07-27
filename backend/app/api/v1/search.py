"""Cosmos Platform — Universal Search & Discovery API Endpoints.

Provides REST API endpoints for global search, module search, autocomplete, and trending queries.
"""

from typing import Union
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_optional, get_db
from app.models.user import User
from app.schemas.search import (
    SearchItem,
    SearchResponse,
    SearchSuggestionResponse,
    TrendingSearchResponse,
)
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["Universal Search & Discovery"])


@router.get(
    "",
    response_model=SearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Universal Search Across Platform",
    description="Searches across Planets, Moons, Missions, Agencies, Timeline Events, and Stories. Public access.",
)
async def global_search(
    q: str = Query(..., min_length=1, description="Search query keyword"),
    limit: int = Query(5, ge=1, le=50, description="Items per entity category"),
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
) -> SearchResponse:
    """Execute universal cross-module search."""
    service = SearchService(db)
    user_id = current_user.id if current_user else None
    return await service.global_search(q, user_id=user_id, limit=limit)


@router.get(
    "/suggestions",
    response_model=SearchSuggestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Autocomplete Search Suggestions",
    description="Provides autocomplete title suggestions and popular keywords matching a query prefix. Public access.",
)
async def get_search_suggestions(
    q: str = Query(..., min_length=1, description="Prefix search query"),
    db: AsyncSession = Depends(get_db),
) -> SearchSuggestionResponse:
    """Get autocomplete search suggestions."""
    service = SearchService(db)
    return await service.get_suggestions(q)


@router.get(
    "/trending",
    response_model=TrendingSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Trending Searches & Highlights",
    description="Retrieves popular search terms and highlighted content across the platform. Public access.",
)
async def get_trending_searches(
    db: AsyncSession = Depends(get_db),
) -> TrendingSearchResponse:
    """Get trending search terms and popular content."""
    service = SearchService(db)
    return await service.get_trending_searches()


@router.get(
    "/planets",
    response_model=list[SearchItem],
    status_code=status.HTTP_200_OK,
    summary="Search Planets",
    description="Search specifically within planets. Public access.",
)
async def search_planets(
    q: str = Query(..., min_length=1, description="Query keyword"),
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    db: AsyncSession = Depends(get_db),
) -> list[SearchItem]:
    """Search specifically within planets."""
    service = SearchService(db)
    return await service.search_module("planets", q, limit=limit)


@router.get(
    "/missions",
    response_model=list[SearchItem],
    status_code=status.HTTP_200_OK,
    summary="Search Missions",
    description="Search specifically within space missions. Public access.",
)
async def search_missions(
    q: str = Query(..., min_length=1, description="Query keyword"),
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    db: AsyncSession = Depends(get_db),
) -> list[SearchItem]:
    """Search specifically within missions."""
    service = SearchService(db)
    return await service.search_module("missions", q, limit=limit)


@router.get(
    "/stories",
    response_model=list[SearchItem],
    status_code=status.HTTP_200_OK,
    summary="Search Stories",
    description="Search specifically within educational stories. Public access.",
)
async def search_stories_endpoint(
    q: str = Query(..., min_length=1, description="Query keyword"),
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    db: AsyncSession = Depends(get_db),
) -> list[SearchItem]:
    """Search specifically within stories."""
    service = SearchService(db)
    return await service.search_module("stories", q, limit=limit)


@router.get(
    "/timeline",
    response_model=list[SearchItem],
    status_code=status.HTTP_200_OK,
    summary="Search Timeline Events",
    description="Search specifically within historical timeline events. Public access.",
)
async def search_timeline(
    q: str = Query(..., min_length=1, description="Query keyword"),
    limit: int = Query(10, ge=1, le=50, description="Items limit"),
    db: AsyncSession = Depends(get_db),
) -> list[SearchItem]:
    """Search specifically within timeline events."""
    service = SearchService(db)
    return await service.search_module("timeline", q, limit=limit)
