"""Cosmos Platform — Era Service.

Implements business logic for managing space Eras.
"""

from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import (
    DuplicateNameError,
    DuplicateSlugError,
    EraNotFoundError,
)
from app.models.era import Era
from app.repositories.era_repository import EraRepository
from app.schemas.era import EraCreate, EraListResponse, EraResponse, EraUpdate
from app.utils.slug import slugify


class EraService:
    """Service handling business logic for Eras."""

    def __init__(self, session: AsyncSession) -> None:
        self.repo = EraRepository(session)

    async def create_era(self, payload: EraCreate) -> EraResponse:
        """Create a new Era after validating uniqueness of name and slug."""
        existing_name = await self.repo.get_by_name(payload.name)
        if existing_name:
            raise DuplicateNameError(f"An era with name '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"An era with slug '{slug}' already exists.")

        era = await self.repo.create(
            name=payload.name,
            slug=slug,
            description=payload.description,
            start_year=payload.start_year,
            end_year=payload.end_year,
            color=payload.color,
        )
        fresh_era = await self.repo.get_by_id(era.id)
        return EraResponse.model_validate(fresh_era or era)

    async def get_era_by_id(self, era_id: UUID) -> EraResponse:
        """Fetch Era by ID or raise EraNotFoundError."""
        era = await self.repo.get_by_id(era_id)
        if not era:
            raise EraNotFoundError(f"Era with ID '{era_id}' not found.")
        return EraResponse.model_validate(era)

    async def get_era_model_by_id(self, era_id: UUID) -> Era:
        """Internal helper to fetch Era ORM instance or raise EraNotFoundError."""
        era = await self.repo.get_by_id(era_id)
        if not era:
            raise EraNotFoundError(f"Era with ID '{era_id}' not found.")
        return era

    async def list_eras(
        self,
        search: str | None = None,
        sort: str = "start_year",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> EraListResponse:
        """Return paginated list of Eras."""
        items, total, pages = await self.repo.list_eras(
            search=search,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return EraListResponse(
            items=[EraResponse.model_validate(item) for item in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def update_era(self, era_id: UUID, payload: EraUpdate) -> EraResponse:
        """Update an Era entity after enforcing uniqueness constraints."""
        era = await self.get_era_model_by_id(era_id)

        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            return EraResponse.model_validate(era)

        if "name" in update_data and update_data["name"] != era.name:
            existing_name = await self.repo.get_by_name(update_data["name"])
            if existing_name and existing_name.id != era_id:
                raise DuplicateNameError(f"An era with name '{update_data['name']}' already exists.")

        if "slug" in update_data:
            new_slug = update_data["slug"] or slugify(update_data.get("name", era.name))
            update_data["slug"] = new_slug
            if new_slug != era.slug:
                existing_slug = await self.repo.get_by_slug(new_slug)
                if existing_slug and existing_slug.id != era_id:
                    raise DuplicateSlugError(f"An era with slug '{new_slug}' already exists.")
        elif "name" in update_data:
            new_slug = slugify(update_data["name"])
            existing_slug = await self.repo.get_by_slug(new_slug)
            if existing_slug and existing_slug.id != era_id:
                raise DuplicateSlugError(f"An era with slug '{new_slug}' already exists.")
            update_data["slug"] = new_slug

        await self.repo.update(era, **update_data)
        updated_era = await self.repo.get_by_id(era_id)
        return EraResponse.model_validate(updated_era or era)

    async def delete_era(self, era_id: UUID) -> None:
        """Delete an Era by ID."""
        era = await self.get_era_model_by_id(era_id)
        await self.repo.delete(era)
