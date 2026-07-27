"""Cosmos Platform — Recommendation Service.

Generates intelligent content recommendations based on user bookmarks, reading history, and activity logs.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.story import Story
from app.repositories.bookmark_repository import BookmarkRepository
from app.repositories.progress_repository import StoryProgressRepository
from app.repositories.story_repository import StoryRepository
from app.schemas.recommendation import RecommendationItem, RecommendationResponse


class RecommendationService:
    """Service producing content recommendations for stories, planets, and missions."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.story_repo = StoryRepository(session)
        self.progress_repo = StoryProgressRepository(session)
        self.bookmark_repo = BookmarkRepository(session)

    async def get_related_stories(self, story: Story, limit: int = 5) -> list[RecommendationItem]:
        """Fetch related stories matching category, tags, or difficulty."""
        category_slug = story.category.slug if story.category else None
        items, _, _ = await self.story_repo.list_stories(
            category=category_slug,
            status="Published",
            limit=limit + 1,
        )

        results = []
        for item in items:
            if item.id != story.id:
                results.append(
                    RecommendationItem(
                        id=item.id,
                        title=item.title,
                        slug=item.slug,
                        resource_type="story",
                        summary=item.summary,
                        cover_image=item.cover_image,
                        score=0.9,
                        reason=f"Related to {story.title}",
                    )
                )
            if len(results) >= limit:
                break
        return results

    async def get_user_personalized_recommendations(self, user_id: UUID, limit: int = 10) -> RecommendationResponse:
        """Fetch personalized content recommendations for an authenticated user."""
        # Check user reading history
        history = await self.progress_repo.get_user_reading_history(user_id, limit=5)
        bookmarks = await self.bookmark_repo.list_user_bookmarks(user_id)

        items, _, _ = await self.story_repo.list_stories(status="Published", limit=limit)
        rec_items = []

        for story in items:
            reason = "Recommended space story"
            score = 0.8

            if history and any(h.story_id == story.id for h in history):
                continue  # skip already read stories

            if bookmarks and any(b.resource_id == str(story.id) or b.resource_id == story.slug for b in bookmarks):
                score = 0.95
                reason = "Based on your bookmarks"

            rec_items.append(
                RecommendationItem(
                    id=story.id,
                    title=story.title,
                    slug=story.slug,
                    resource_type="story",
                    summary=story.summary,
                    cover_image=story.cover_image,
                    score=score,
                    reason=reason,
                )
            )

        return RecommendationResponse(items=rec_items[:limit])
