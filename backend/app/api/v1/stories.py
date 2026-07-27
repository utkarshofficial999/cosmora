"""Cosmos Platform — Stories API Endpoints.

Provides REST API endpoints for managing educational space stories and recommendations.
"""

from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.recommendation import RecommendationItem
from app.schemas.story import StoryCreate, StoryListResponse, StoryResponse, StoryUpdate
from app.services.recommendation_service import RecommendationService
from app.services.story_service import StoryService

router = APIRouter(prefix="/stories", tags=["Stories"])


@router.post(
    "",
    response_model=StoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Story",
    description="Creates a new educational space story. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def create_story(
    payload: StoryCreate,
    db: AsyncSession = Depends(get_db),
) -> StoryResponse:
    """Create a new Story entity."""
    service = StoryService(db)
    return await service.create_story(payload)


@router.get(
    "",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all Stories",
    description="Retrieves a paginated list of published stories with multi-field filters. Public access.",
)
async def list_stories(
    search: str | None = Query(None, description="Search term for title, summary, or content"),
    category: str | None = Query(None, description="Filter by category UUID or slug"),
    tag: str | None = Query(None, description="Filter by tag UUID or slug"),
    author: str | None = Query(None, description="Filter by author name"),
    difficulty: str | None = Query(None, description="Filter by difficulty (Beginner, Intermediate, Advanced)"),
    story_type: str | None = Query(None, description="Filter by story type"),
    status_filter: str | None = Query("Published", alias="status", description="Filter by status (Draft, Published, Archived)"),
    featured: bool | None = Query(None, description="Filter featured stories only"),
    sort: str = Query("created_at", description="Sort field (created_at, published_at, view_count, title)"),
    order: str = Query("desc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """List stories with pagination and filters."""
    service = StoryService(db)
    return await service.list_stories(
        search=search,
        category=category,
        tag=tag,
        author=author,
        difficulty=difficulty,
        story_type=story_type,
        status=status_filter,
        featured=featured,
        sort=sort,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/featured",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Featured Stories",
    description="Retrieves featured stories highlighted on the platform. Public access.",
)
async def list_featured_stories(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """List featured published stories."""
    service = StoryService(db)
    return await service.list_stories(status="Published", featured=True, sort="published_at", order="desc", page=page, limit=limit)


@router.get(
    "/trending",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Trending Stories",
    description="Retrieves trending stories sorted by view count. Public access.",
)
async def list_trending_stories(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """List trending stories."""
    service = StoryService(db)
    return await service.list_stories(status="Published", sort="view_count", order="desc", page=page, limit=limit)


@router.get(
    "/recent",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Recent Stories",
    description="Retrieves recently published stories. Public access.",
)
async def list_recent_stories(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """List recent published stories."""
    service = StoryService(db)
    return await service.list_stories(status="Published", sort="published_at", order="desc", page=page, limit=limit)


@router.get(
    "/search",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="Search Stories",
    description="Dedicated story search endpoint. Public access.",
)
async def search_stories(
    q: str = Query(..., min_length=1, description="Search query string"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """Search stories."""
    service = StoryService(db)
    return await service.list_stories(search=q, status="Published", page=page, limit=limit)


@router.get(
    "/category/{slug}",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Stories by Category Slug",
    description="Retrieves stories under a specific category. Public access.",
)
async def list_stories_by_category(
    slug: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """List stories by category slug."""
    service = StoryService(db)
    return await service.list_stories(category=slug, status="Published", page=page, limit=limit)


@router.get(
    "/tag/{slug}",
    response_model=StoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Stories by Tag Slug",
    description="Retrieves stories attached to a specific tag. Public access.",
)
async def list_stories_by_tag(
    slug: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> StoryListResponse:
    """List stories by tag slug."""
    service = StoryService(db)
    return await service.list_stories(tag=slug, status="Published", page=page, limit=limit)


@router.get(
    "/{id}",
    response_model=StoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Story by ID or Slug",
    description="Retrieves details of a specific story by UUID or slug and increments view count. Public access.",
)
async def get_story(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> StoryResponse:
    """Get story details by UUID or slug."""
    service = StoryService(db)
    return await service.get_story_by_id_or_slug(id, increment_view=True)


@router.get(
    "/{slug}/related",
    response_model=list[RecommendationItem],
    status_code=status.HTTP_200_OK,
    summary="Get Related Story Recommendations",
    description="Retrieves content-based story recommendations matching category, difficulty, or tags. Public access.",
)
async def get_related_stories(
    slug: str,
    limit: int = Query(5, ge=1, le=20, description="Number of recommendations"),
    db: AsyncSession = Depends(get_db),
) -> list[RecommendationItem]:
    """Get related story recommendations."""
    story_service = StoryService(db)
    rec_service = RecommendationService(db)
    story_model = await story_service.get_story_model(slug)
    return await rec_service.get_related_stories(story_model, limit=limit)


@router.patch(
    "/{id}",
    response_model=StoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Story",
    description="Updates fields of an existing story. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def update_story(
    id: str,
    payload: StoryUpdate,
    db: AsyncSession = Depends(get_db),
) -> StoryResponse:
    """Update Story details."""
    service = StoryService(db)
    return await service.update_story(id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Story",
    description="Deletes a story by UUID or slug. Restricted to Admin users.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def delete_story(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a Story."""
    service = StoryService(db)
    await service.delete_story(id)
