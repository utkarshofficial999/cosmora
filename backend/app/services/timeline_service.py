"""Cosmos Platform — Timeline Service.

Implements business logic for Timeline Events and attached Event Media.
"""

from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import (
    DuplicateSlugError,
    InvalidEraError,
    TimelineEventNotFoundError,
    ValidationError,
)
from app.models.timeline import TimelineEvent
from app.repositories.era_repository import EraRepository
from app.repositories.event_media_repository import EventMediaRepository
from app.repositories.timeline_repository import TimelineRepository
from app.schemas.timeline import (
    TimelineCreate,
    TimelineListResponse,
    TimelineResponse,
    TimelineUpdate,
)
from app.utils.slug import slugify


class TimelineService:
    """Service handling business logic for Timeline Events."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.timeline_repo = TimelineRepository(session)
        self.era_repo = EraRepository(session)
        self.media_repo = EventMediaRepository(session)

    async def _validate_era(self, era_id: UUID) -> None:
        """Ensure era exists in database."""
        era = await self.era_repo.get_by_id(era_id)
        if not era:
            raise InvalidEraError(f"Era with ID '{era_id}' does not exist.")

    async def create_event(
        self,
        payload: TimelineCreate,
        creator_id: UUID | None = None,
    ) -> TimelineResponse:
        """Create a new TimelineEvent along with attached media items."""
        # 1. Validate era
        await self._validate_era(payload.era_id)

        # 2. Validate importance
        if not 1 <= payload.importance <= 5:
            raise ValidationError("Importance must be between 1 and 5.")

        # 3. Generate & validate slug
        slug = payload.slug or slugify(payload.title)
        existing_slug = await self.timeline_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"Timeline event with slug '{slug}' already exists.")

        # 4. Create event
        event = await self.timeline_repo.create(
            title=payload.title,
            slug=slug,
            short_description=payload.short_description,
            content=payload.content,
            event_date=payload.event_date,
            year=payload.year,
            importance=payload.importance,
            image_url=payload.image_url,
            thumbnail=payload.thumbnail,
            era_id=payload.era_id,
            is_featured=payload.is_featured,
            created_by=creator_id,
        )

        # 5. Create media attachments if provided
        if payload.media:
            for item in payload.media:
                await self.media_repo.create(
                    timeline_event_id=event.id,
                    media_type=item.media_type,
                    url=item.url,
                    caption=item.caption,
                )

        # Re-fetch event to load relationships cleanly
        full_event = await self.timeline_repo.get_by_id(event.id)
        return TimelineResponse.model_validate(full_event or event)

    async def get_event_by_id(self, event_id: UUID) -> TimelineResponse:
        """Fetch timeline event by ID or raise TimelineEventNotFoundError."""
        event = await self.timeline_repo.get_by_id(event_id)
        if not event:
            raise TimelineEventNotFoundError(f"Timeline event with ID '{event_id}' not found.")
        return TimelineResponse.model_validate(event)

    async def get_event_model_by_id(self, event_id: UUID) -> TimelineEvent:
        """Fetch timeline event ORM model or raise TimelineEventNotFoundError."""
        event = await self.timeline_repo.get_by_id(event_id)
        if not event:
            raise TimelineEventNotFoundError(f"Timeline event with ID '{event_id}' not found.")
        return event

    async def list_events(
        self,
        search: str | None = None,
        era: str | None = None,
        year: int | None = None,
        featured: bool | None = None,
        sort: str = "year",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> TimelineListResponse:
        """List timeline events with filters and pagination."""
        items, total, pages = await self.timeline_repo.list_events(
            search=search,
            era=era,
            year=year,
            featured=featured,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return TimelineListResponse(
            items=[TimelineResponse.model_validate(item) for item in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def update_event(
        self,
        event_id: UUID,
        payload: TimelineUpdate,
    ) -> TimelineResponse:
        """Update an existing timeline event."""
        event = await self.get_event_model_by_id(event_id)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return TimelineResponse.model_validate(event)

        # Validate era if updating era_id
        if "era_id" in update_data and update_data["era_id"] is not None:
            await self._validate_era(update_data["era_id"])

        # Validate importance if updating importance
        if "importance" in update_data and update_data["importance"] is not None:
            if not 1 <= update_data["importance"] <= 5:
                raise ValidationError("Importance must be between 1 and 5.")

        # Handle slug update or generation
        if "slug" in update_data and update_data["slug"]:
            new_slug = update_data["slug"]
            if new_slug != event.slug:
                existing = await self.timeline_repo.get_by_slug(new_slug)
                if existing and existing.id != event_id:
                    raise DuplicateSlugError(f"Timeline event with slug '{new_slug}' already exists.")
        elif "title" in update_data and update_data["title"]:
            new_slug = slugify(update_data["title"])
            if new_slug != event.slug:
                existing = await self.timeline_repo.get_by_slug(new_slug)
                if existing and existing.id != event_id:
                    raise DuplicateSlugError(f"Timeline event with slug '{new_slug}' already exists.")
                update_data["slug"] = new_slug

        await self.timeline_repo.update(event, **update_data)
        updated_event = await self.timeline_repo.get_by_id(event_id)
        return TimelineResponse.model_validate(updated_event or event)

    async def delete_event(self, event_id: UUID) -> None:
        """Delete a timeline event by ID."""
        event = await self.get_event_model_by_id(event_id)
        await self.timeline_repo.delete(event)
