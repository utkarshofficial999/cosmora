"""Cosmos Platform — Planet Service.

Implements business logic for Planets, Moons, Planet Facts, and Planet Overviews.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import (
    DuplicateNameError,
    DuplicateSlugError,
    MoonNotFoundError,
    PlanetFactNotFoundError,
    PlanetNotFoundError,
)
from app.models.moon import Moon
from app.models.planet import Planet
from app.models.planet_fact import PlanetFact
from app.repositories.moon_repository import MoonRepository
from app.repositories.planet_fact_repository import PlanetFactRepository
from app.repositories.planet_repository import PlanetRepository
from app.schemas.moon import MoonCreate, MoonListResponse, MoonResponse, MoonUpdate
from app.schemas.planet import (
    PlanetCreate,
    PlanetListResponse,
    PlanetOverviewResponse,
    PlanetResponse,
    PlanetUpdate,
)
from app.schemas.planet_fact import (
    PlanetFactCreate,
    PlanetFactResponse,
    PlanetFactUpdate,
)
from app.utils.slug import slugify


class PlanetService:
    """Service handling business logic for the Solar System Module."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.planet_repo = PlanetRepository(session)
        self.moon_repo = MoonRepository(session)
        self.fact_repo = PlanetFactRepository(session)

    # -------------------------------------------------------------------------
    # PLANETS
    # -------------------------------------------------------------------------

    async def create_planet(self, payload: PlanetCreate) -> PlanetResponse:
        """Create a new Planet after validating uniqueness of name and slug."""
        existing_name = await self.planet_repo.get_by_name(payload.name)
        if existing_name:
            raise DuplicateNameError(f"A planet with name '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.planet_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"A planet with slug '{slug}' already exists.")

        data = payload.model_dump(exclude_none=True)
        data["slug"] = slug

        planet = await self.planet_repo.create(**data)
        fresh = await self.planet_repo.get_by_id(planet.id)
        return PlanetResponse.model_validate(fresh or planet)

    async def get_planet_by_id_or_slug(self, identifier: str | UUID) -> PlanetResponse:
        """Fetch a Planet by UUID or slug, or raise PlanetNotFoundError."""
        planet = await self.planet_repo.get_by_id_or_slug(identifier)
        if not planet:
            raise PlanetNotFoundError(f"Planet '{identifier}' not found.")
        return PlanetResponse.model_validate(planet)

    async def get_planet_model(self, identifier: str | UUID) -> Planet:
        """Fetch Planet ORM instance or raise PlanetNotFoundError."""
        planet = await self.planet_repo.get_by_id_or_slug(identifier)
        if not planet:
            raise PlanetNotFoundError(f"Planet '{identifier}' not found.")
        return planet

    async def list_planets(
        self,
        search: str | None = None,
        habitable: bool | None = None,
        has_moons: bool | None = None,
        sort: str = "distance_from_sun",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> PlanetListResponse:
        """Return paginated list of Planets."""
        items, total, pages = await self.planet_repo.list_planets(
            search=search,
            habitable=habitable,
            has_moons=has_moons,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return PlanetListResponse(
            items=[PlanetResponse.model_validate(item) for item in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def update_planet(self, identifier: str | UUID, payload: PlanetUpdate) -> PlanetResponse:
        """Update an existing Planet."""
        planet = await self.get_planet_model(identifier)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return PlanetResponse.model_validate(planet)

        if "name" in update_data and update_data["name"] != planet.name:
            existing_name = await self.planet_repo.get_by_name(update_data["name"])
            if existing_name and existing_name.id != planet.id:
                raise DuplicateNameError(f"A planet with name '{update_data['name']}' already exists.")

        if "slug" in update_data:
            new_slug = update_data["slug"] or slugify(update_data.get("name", planet.name))
            update_data["slug"] = new_slug
            if new_slug != planet.slug:
                existing_slug = await self.planet_repo.get_by_slug(new_slug)
                if existing_slug and existing_slug.id != planet.id:
                    raise DuplicateSlugError(f"A planet with slug '{new_slug}' already exists.")
        elif "name" in update_data:
            new_slug = slugify(update_data["name"])
            existing_slug = await self.planet_repo.get_by_slug(new_slug)
            if existing_slug and existing_slug.id != planet.id:
                raise DuplicateSlugError(f"A planet with slug '{new_slug}' already exists.")
            update_data["slug"] = new_slug

        await self.planet_repo.update(planet, **update_data)
        updated = await self.planet_repo.get_by_id(planet.id)
        return PlanetResponse.model_validate(updated or planet)

    async def delete_planet(self, identifier: str | UUID) -> None:
        """Delete a Planet."""
        planet = await self.get_planet_model(identifier)
        await self.planet_repo.delete(planet)

    async def get_planet_overview(self, identifier: str | UUID) -> PlanetOverviewResponse:
        """Fetch aggregated Planet details including associated moons and facts."""
        planet = await self.planet_repo.get_overview_by_id_or_slug(identifier)
        if not planet:
            raise PlanetNotFoundError(f"Planet '{identifier}' not found.")
        return PlanetOverviewResponse(
            planet=PlanetResponse.model_validate(planet),
            moons=[MoonResponse.model_validate(m) for m in planet.moons],
            facts=[PlanetFactResponse.model_validate(f) for f in planet.facts],
        )

    # -------------------------------------------------------------------------
    # MOONS
    # -------------------------------------------------------------------------

    async def create_moon(self, payload: MoonCreate) -> MoonResponse:
        """Create a new Moon after validating parent planet and moon uniqueness."""
        await self.get_planet_model(payload.planet_id)

        existing_name = await self.moon_repo.get_by_name(payload.name)
        if existing_name:
            raise DuplicateNameError(f"A moon with name '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.moon_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"A moon with slug '{slug}' already exists.")

        data = payload.model_dump(exclude_none=True)
        data["slug"] = slug

        moon = await self.moon_repo.create(**data)
        fresh = await self.moon_repo.get_by_id(moon.id)
        return MoonResponse.model_validate(fresh or moon)

    async def get_moon_by_id(self, moon_id: UUID) -> MoonResponse:
        """Fetch Moon by ID or raise MoonNotFoundError."""
        moon = await self.moon_repo.get_by_id(moon_id)
        if not moon:
            raise MoonNotFoundError(f"Moon with ID '{moon_id}' not found.")
        return MoonResponse.model_validate(moon)

    async def get_moon_model(self, moon_id: UUID) -> Moon:
        """Fetch Moon ORM instance or raise MoonNotFoundError."""
        moon = await self.moon_repo.get_by_id(moon_id)
        if not moon:
            raise MoonNotFoundError(f"Moon with ID '{moon_id}' not found.")
        return moon

    async def list_moons(
        self,
        search: str | None = None,
        planet_id: UUID | None = None,
        sort: str = "name",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> MoonListResponse:
        """Return paginated list of Moons."""
        items, total, pages = await self.moon_repo.list_moons(
            search=search,
            planet_id=planet_id,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return MoonListResponse(
            items=[MoonResponse.model_validate(item) for item in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def get_moons_by_planet(self, planet_identifier: str | UUID) -> list[MoonResponse]:
        """Fetch all moons orbiting a specified planet."""
        planet = await self.get_planet_model(planet_identifier)
        moons = await self.moon_repo.get_by_planet_id(planet.id)
        return [MoonResponse.model_validate(m) for m in moons]

    async def update_moon(self, moon_id: UUID, payload: MoonUpdate) -> MoonResponse:
        """Update an existing Moon."""
        moon = await self.get_moon_model(moon_id)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return MoonResponse.model_validate(moon)

        if "planet_id" in update_data and update_data["planet_id"] is not None:
            await self.get_planet_model(update_data["planet_id"])

        if "name" in update_data and update_data["name"] != moon.name:
            existing_name = await self.moon_repo.get_by_name(update_data["name"])
            if existing_name and existing_name.id != moon_id:
                raise DuplicateNameError(f"A moon with name '{update_data['name']}' already exists.")

        if "slug" in update_data:
            new_slug = update_data["slug"] or slugify(update_data.get("name", moon.name))
            update_data["slug"] = new_slug
            if new_slug != moon.slug:
                existing_slug = await self.moon_repo.get_by_slug(new_slug)
                if existing_slug and existing_slug.id != moon_id:
                    raise DuplicateSlugError(f"A moon with slug '{new_slug}' already exists.")

        await self.moon_repo.update(moon, **update_data)
        updated = await self.moon_repo.get_by_id(moon_id)
        return MoonResponse.model_validate(updated or moon)

    async def delete_moon(self, moon_id: UUID) -> None:
        """Delete a Moon."""
        moon = await self.get_moon_model(moon_id)
        await self.moon_repo.delete(moon)

    # -------------------------------------------------------------------------
    # PLANET FACTS
    # -------------------------------------------------------------------------

    async def create_planet_fact(self, payload: PlanetFactCreate) -> PlanetFactResponse:
        """Create a new PlanetFact after verifying planet existence."""
        await self.get_planet_model(payload.planet_id)
        fact = await self.fact_repo.create(**payload.model_dump())
        fresh = await self.fact_repo.get_by_id(fact.id)
        return PlanetFactResponse.model_validate(fresh or fact)

    async def get_planet_fact_by_id(self, fact_id: UUID) -> PlanetFactResponse:
        """Fetch PlanetFact by ID or raise PlanetFactNotFoundError."""
        fact = await self.fact_repo.get_by_id(fact_id)
        if not fact:
            raise PlanetFactNotFoundError(f"Planet fact with ID '{fact_id}' not found.")
        return PlanetFactResponse.model_validate(fact)

    async def get_fact_model(self, fact_id: UUID) -> PlanetFact:
        """Fetch PlanetFact ORM instance or raise PlanetFactNotFoundError."""
        fact = await self.fact_repo.get_by_id(fact_id)
        if not fact:
            raise PlanetFactNotFoundError(f"Planet fact with ID '{fact_id}' not found.")
        return fact

    async def get_facts_by_planet(self, planet_identifier: str | UUID) -> list[PlanetFactResponse]:
        """Fetch all facts for a specified planet."""
        planet = await self.get_planet_model(planet_identifier)
        facts = await self.fact_repo.get_by_planet_id(planet.id)
        return [PlanetFactResponse.model_validate(f) for f in facts]

    async def update_planet_fact(self, fact_id: UUID, payload: PlanetFactUpdate) -> PlanetFactResponse:
        """Update an existing PlanetFact."""
        fact = await self.get_fact_model(fact_id)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return PlanetFactResponse.model_validate(fact)

        await self.fact_repo.update(fact, **update_data)
        updated = await self.fact_repo.get_by_id(fact_id)
        return PlanetFactResponse.model_validate(updated or fact)

    async def delete_planet_fact(self, fact_id: UUID) -> None:
        """Delete a PlanetFact."""
        fact = await self.get_fact_model(fact_id)
        await self.fact_repo.delete(fact)
