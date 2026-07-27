"""Cosmos Platform — Story Service.

Implements business logic for Stories, Chapters, Categories, Tags, and Reading Progress.
"""

from datetime import datetime, timezone
from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import (
    CategoryNotFoundError,
    ChapterNotFoundError,
    DuplicateNameError,
    DuplicateSlugError,
    StoryNotFoundError,
    TagNotFoundError,
)
from app.models.chapter import StoryChapter
from app.models.story import Story
from app.models.story_category import StoryCategory
from app.models.story_tag import StoryTag
from app.repositories.category_repository import StoryCategoryRepository
from app.repositories.chapter_repository import StoryChapterRepository
from app.repositories.progress_repository import StoryProgressRepository
from app.repositories.story_repository import StoryRepository
from app.repositories.tag_repository import StoryTagRepository
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.chapter import ChapterCreate, ChapterResponse, ChapterUpdate
from app.schemas.progress import ProgressCreate, ProgressResponse, ReadingHistoryResponse
from app.schemas.story import StoryCreate, StoryListResponse, StoryResponse, StoryUpdate
from app.schemas.tag import TagCreate, TagResponse
from app.utils.slug import slugify


class StoryService:
    """Service handling business logic for the Story Engine Module."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.category_repo = StoryCategoryRepository(session)
        self.tag_repo = StoryTagRepository(session)
        self.story_repo = StoryRepository(session)
        self.chapter_repo = StoryChapterRepository(session)
        self.progress_repo = StoryProgressRepository(session)

    # -------------------------------------------------------------------------
    # CATEGORIES
    # -------------------------------------------------------------------------

    async def create_category(self, payload: CategoryCreate) -> CategoryResponse:
        """Create a new StoryCategory."""
        existing = await self.category_repo.get_by_name(payload.name)
        if existing:
            raise DuplicateNameError(f"Category '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.category_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"Category with slug '{slug}' already exists.")

        data = payload.model_dump(exclude_none=True)
        data["slug"] = slug
        category = await self.category_repo.create(**data)
        fresh = await self.category_repo.get_by_id(category.id)
        return CategoryResponse.model_validate(fresh or category)

    async def list_categories(self) -> list[CategoryResponse]:
        """List all StoryCategories."""
        items = await self.category_repo.list_categories()
        return [CategoryResponse.model_validate(c) for c in items]

    async def update_category(self, identifier: str | UUID, payload: CategoryUpdate) -> CategoryResponse:
        """Update an existing StoryCategory."""
        category = await self.category_repo.get_by_id_or_slug(identifier)
        if not category:
            raise CategoryNotFoundError(f"Story category '{identifier}' not found.")

        update_data = payload.model_dump(exclude_unset=True)
        if "name" in update_data and update_data["name"] != category.name:
            existing = await self.category_repo.get_by_name(update_data["name"])
            if existing and existing.id != category.id:
                raise DuplicateNameError(f"Category '{update_data['name']}' already exists.")

        if "slug" in update_data:
            new_slug = update_data["slug"] or slugify(update_data.get("name", category.name))
            update_data["slug"] = new_slug
            if new_slug != category.slug:
                existing_slug = await self.category_repo.get_by_slug(new_slug)
                if existing_slug and existing_slug.id != category.id:
                    raise DuplicateSlugError(f"Category slug '{new_slug}' already exists.")

        await self.category_repo.update(category, **update_data)
        fresh = await self.category_repo.get_by_id(category.id)
        return CategoryResponse.model_validate(fresh or category)

    async def delete_category(self, identifier: str | UUID) -> None:
        """Delete a StoryCategory."""
        category = await self.category_repo.get_by_id_or_slug(identifier)
        if not category:
            raise CategoryNotFoundError(f"Story category '{identifier}' not found.")
        await self.category_repo.delete(category)

    # -------------------------------------------------------------------------
    # TAGS
    # -------------------------------------------------------------------------

    async def create_tag(self, payload: TagCreate) -> TagResponse:
        """Create a new StoryTag."""
        existing = await self.tag_repo.get_by_name(payload.name)
        if existing:
            raise DuplicateNameError(f"Tag '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.tag_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"Tag slug '{slug}' already exists.")

        tag = await self.tag_repo.create(name=payload.name, slug=slug)
        fresh = await self.tag_repo.get_by_id(tag.id)
        return TagResponse.model_validate(fresh or tag)

    async def list_tags(self) -> list[TagResponse]:
        """List all StoryTags."""
        items = await self.tag_repo.list_tags()
        return [TagResponse.model_validate(t) for t in items]

    async def delete_tag(self, tag_id: UUID) -> None:
        """Delete a StoryTag."""
        tag = await self.tag_repo.get_by_id(tag_id)
        if not tag:
            raise TagNotFoundError(f"Tag with ID '{tag_id}' not found.")
        await self.tag_repo.delete(tag)

    # -------------------------------------------------------------------------
    # STORIES
    # -------------------------------------------------------------------------

    async def create_story(self, payload: StoryCreate) -> StoryResponse:
        """Create a new Story entity."""
        if payload.category_id:
            cat = await self.category_repo.get_by_id(payload.category_id)
            if not cat:
                raise CategoryNotFoundError(f"Category ID '{payload.category_id}' not found.")

        existing = await self.story_repo.get_by_title(payload.title)
        if existing:
            raise DuplicateNameError(f"Story titled '{payload.title}' already exists.")

        slug = payload.slug or slugify(payload.title)
        existing_slug = await self.story_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"Story slug '{slug}' already exists.")

        data = payload.model_dump(exclude={"tag_ids"}, exclude_none=True)
        data["slug"] = slug

        if data.get("status") == "Published" and "published_at" not in data:
            data["published_at"] = datetime.now(timezone.utc)

        tags = []
        if payload.tag_ids:
            tags = await self.tag_repo.get_by_ids(payload.tag_ids)

        story = await self.story_repo.create(**data, tags=tags)
        fresh = await self.story_repo.get_by_id(story.id)
        return StoryResponse.model_validate(fresh or story)

    async def get_story_by_id_or_slug(self, identifier: str | UUID, increment_view: bool = True) -> StoryResponse:
        """Fetch Story by ID or slug."""
        story = await self.story_repo.get_by_id_or_slug(identifier)
        if not story:
            raise StoryNotFoundError(f"Story '{identifier}' not found.")

        if increment_view:
            await self.story_repo.increment_view_count(story.id)

        fresh = await self.story_repo.get_by_id(story.id)
        return StoryResponse.model_validate(fresh or story)

    async def get_story_model(self, identifier: str | UUID) -> Story:
        """Fetch Story ORM model instance."""
        story = await self.story_repo.get_by_id_or_slug(identifier)
        if not story:
            raise StoryNotFoundError(f"Story '{identifier}' not found.")
        return story

    async def list_stories(
        self,
        search: str | None = None,
        category: str | None = None,
        tag: str | None = None,
        author: str | None = None,
        difficulty: str | None = None,
        story_type: str | None = None,
        status: str | None = None,
        featured: bool | None = None,
        sort: str = "created_at",
        order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> StoryListResponse:
        """List stories with pagination and filtering."""
        items, total, pages = await self.story_repo.list_stories(
            search=search,
            category=category,
            tag=tag,
            author=author,
            difficulty=difficulty,
            story_type=story_type,
            status=status,
            featured=featured,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return StoryListResponse(
            items=[StoryResponse.model_validate(s) for s in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def update_story(self, identifier: str | UUID, payload: StoryUpdate) -> StoryResponse:
        """Update an existing Story."""
        story = await self.get_story_model(identifier)
        update_data = payload.model_dump(exclude_unset=True, exclude={"tag_ids"})

        if "category_id" in update_data and update_data["category_id"]:
            cat = await self.category_repo.get_by_id(update_data["category_id"])
            if not cat:
                raise CategoryNotFoundError(f"Category ID '{update_data['category_id']}' not found.")

        if "status" in update_data and update_data["status"] == "Published" and not story.published_at:
            update_data["published_at"] = datetime.now(timezone.utc)

        if payload.tag_ids is not None:
            tags = await self.tag_repo.get_by_ids(payload.tag_ids)
            update_data["tags"] = tags

        await self.story_repo.update(story, **update_data)
        updated = await self.story_repo.get_by_id(story.id)
        return StoryResponse.model_validate(updated or story)

    async def delete_story(self, identifier: str | UUID) -> None:
        """Delete a Story."""
        story = await self.get_story_model(identifier)
        await self.story_repo.delete(story)

    # -------------------------------------------------------------------------
    # CHAPTERS
    # -------------------------------------------------------------------------

    async def create_chapter(self, story_identifier: str | UUID, payload: ChapterCreate) -> ChapterResponse:
        """Create a new StoryChapter linked to a story."""
        story = await self.get_story_model(story_identifier)
        data = payload.model_dump()
        data["story_id"] = story.id

        chapter = await self.chapter_repo.create(**data)
        fresh = await self.chapter_repo.get_by_id(chapter.id)
        return ChapterResponse.model_validate(fresh or chapter)

    async def get_chapters_by_story(self, story_identifier: str | UUID) -> list[ChapterResponse]:
        """List all chapters for a story."""
        story = await self.get_story_model(story_identifier)
        items = await self.chapter_repo.get_by_story_id(story.id)
        return [ChapterResponse.model_validate(c) for c in items]

    async def update_chapter(self, chapter_id: UUID, payload: ChapterUpdate) -> ChapterResponse:
        """Update an existing StoryChapter."""
        chapter = await self.chapter_repo.get_by_id(chapter_id)
        if not chapter:
            raise ChapterNotFoundError(f"Story chapter '{chapter_id}' not found.")

        update_data = payload.model_dump(exclude_unset=True)
        await self.chapter_repo.update(chapter, **update_data)
        fresh = await self.chapter_repo.get_by_id(chapter_id)
        return ChapterResponse.model_validate(fresh or chapter)

    async def delete_chapter(self, chapter_id: UUID) -> None:
        """Delete a StoryChapter."""
        chapter = await self.chapter_repo.get_by_id(chapter_id)
        if not chapter:
            raise ChapterNotFoundError(f"Story chapter '{chapter_id}' not found.")
        await self.chapter_repo.delete(chapter)

    # -------------------------------------------------------------------------
    # READING PROGRESS
    # -------------------------------------------------------------------------

    async def upsert_progress(
        self,
        user_id: UUID,
        story_identifier: str | UUID,
        payload: ProgressCreate,
    ) -> ProgressResponse:
        """Save or update reading progress for a user."""
        story = await self.get_story_model(story_identifier)
        progress = await self.progress_repo.upsert_progress(
            user_id=user_id,
            story_id=story.id,
            last_chapter=payload.last_chapter,
            progress_percentage=payload.progress_percentage,
            completed=payload.completed,
        )
        return ProgressResponse.model_validate(progress)

    async def get_user_reading_history(self, user_id: UUID, limit: int = 20) -> list[ReadingHistoryResponse]:
        """Fetch user's reading history."""
        records = await self.progress_repo.get_user_reading_history(user_id, limit=limit)
        results = []
        for r in records:
            if r.story:
                results.append(
                    ReadingHistoryResponse(
                        progress=ProgressResponse.model_validate(r),
                        story_title=r.story.title,
                        story_slug=r.story.slug,
                        cover_image=r.story.cover_image,
                        category_name=r.story.category.name if r.story.category else None,
                    )
                )
        return results

    async def get_user_continue_reading(self, user_id: UUID, limit: int = 10) -> list[ReadingHistoryResponse]:
        """Fetch in-progress stories for continuing reading."""
        records = await self.progress_repo.get_user_continue_reading(user_id, limit=limit)
        results = []
        for r in records:
            if r.story:
                results.append(
                    ReadingHistoryResponse(
                        progress=ProgressResponse.model_validate(r),
                        story_title=r.story.title,
                        story_slug=r.story.slug,
                        cover_image=r.story.cover_image,
                        category_name=r.story.category.name if r.story.category else None,
                    )
                )
        return results
