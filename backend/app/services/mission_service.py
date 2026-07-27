"""Cosmos Platform — Mission Service.

Implements business logic for Space Agencies, Missions, Milestones, Media, and Dashboard metrics.
"""

from typing import Any, Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import (
    AgencyNotFoundError,
    DuplicateNameError,
    DuplicateSlugError,
    MilestoneNotFoundError,
    MissionMediaNotFoundError,
    MissionNotFoundError,
)
from app.models.agency import SpaceAgency
from app.models.milestone import MissionMilestone
from app.models.mission import Mission
from app.models.mission_media import MissionMedia
from app.repositories.agency_repository import AgencyRepository
from app.repositories.milestone_repository import MilestoneRepository
from app.repositories.mission_media_repository import MissionMediaRepository
from app.repositories.mission_repository import MissionRepository
from app.schemas.agency import (
    AgencyCreate,
    AgencyListResponse,
    AgencyResponse,
    AgencyUpdate,
)
from app.schemas.countdown import MissionCountdownResponse
from app.schemas.milestone import (
    MilestoneCreate,
    MilestoneResponse,
    MilestoneUpdate,
)
from app.schemas.mission import (
    MissionCreate,
    MissionListResponse,
    MissionMediaCreate,
    MissionMediaResponse,
    MissionResponse,
    MissionUpdate,
)
from app.services.countdown_service import CountdownService
from app.utils.slug import slugify


class MissionService:
    """Service handling business logic for the Mission Tracking System."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.agency_repo = AgencyRepository(session)
        self.mission_repo = MissionRepository(session)
        self.milestone_repo = MilestoneRepository(session)
        self.media_repo = MissionMediaRepository(session)

    # -------------------------------------------------------------------------
    # AGENCIES
    # -------------------------------------------------------------------------

    async def create_agency(self, payload: AgencyCreate) -> AgencyResponse:
        """Create a new SpaceAgency after checking uniqueness."""
        existing_name = await self.agency_repo.get_by_name(payload.name)
        if existing_name:
            raise DuplicateNameError(f"A space agency with name '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.agency_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"A space agency with slug '{slug}' already exists.")

        data = payload.model_dump(exclude_none=True)
        data["slug"] = slug

        agency = await self.agency_repo.create(**data)
        fresh = await self.agency_repo.get_by_id(agency.id)
        return AgencyResponse.model_validate(fresh or agency)

    async def get_agency_by_id_or_slug(self, identifier: str | UUID) -> AgencyResponse:
        """Fetch SpaceAgency by UUID or slug or raise AgencyNotFoundError."""
        agency = await self.agency_repo.get_by_id_or_slug(identifier)
        if not agency:
            raise AgencyNotFoundError(f"Space agency '{identifier}' not found.")
        return AgencyResponse.model_validate(agency)

    async def get_agency_model(self, identifier: str | UUID) -> SpaceAgency:
        """Fetch SpaceAgency ORM instance or raise AgencyNotFoundError."""
        agency = await self.agency_repo.get_by_id_or_slug(identifier)
        if not agency:
            raise AgencyNotFoundError(f"Space agency '{identifier}' not found.")
        return agency

    async def list_agencies(
        self,
        search: str | None = None,
        country: str | None = None,
        sort: str = "name",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> AgencyListResponse:
        """Return paginated list of Space Agencies."""
        items, total, pages = await self.agency_repo.list_agencies(
            search=search,
            country=country,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return AgencyListResponse(
            items=[AgencyResponse.model_validate(item) for item in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def update_agency(self, identifier: str | UUID, payload: AgencyUpdate) -> AgencyResponse:
        """Update an existing SpaceAgency."""
        agency = await self.get_agency_model(identifier)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return AgencyResponse.model_validate(agency)

        if "name" in update_data and update_data["name"] != agency.name:
            existing_name = await self.agency_repo.get_by_name(update_data["name"])
            if existing_name and existing_name.id != agency.id:
                raise DuplicateNameError(f"A space agency with name '{update_data['name']}' already exists.")

        if "slug" in update_data:
            new_slug = update_data["slug"] or slugify(update_data.get("name", agency.name))
            update_data["slug"] = new_slug
            if new_slug != agency.slug:
                existing_slug = await self.agency_repo.get_by_slug(new_slug)
                if existing_slug and existing_slug.id != agency.id:
                    raise DuplicateSlugError(f"A space agency with slug '{new_slug}' already exists.")
        elif "name" in update_data:
            new_slug = slugify(update_data["name"])
            existing_slug = await self.agency_repo.get_by_slug(new_slug)
            if existing_slug and existing_slug.id != agency.id:
                raise DuplicateSlugError(f"A space agency with slug '{new_slug}' already exists.")
            update_data["slug"] = new_slug

        await self.agency_repo.update(agency, **update_data)
        updated = await self.agency_repo.get_by_id(agency.id)
        return AgencyResponse.model_validate(updated or agency)

    async def delete_agency(self, identifier: str | UUID) -> None:
        """Delete a SpaceAgency."""
        agency = await self.get_agency_model(identifier)
        await self.agency_repo.delete(agency)

    # -------------------------------------------------------------------------
    # MISSIONS
    # -------------------------------------------------------------------------

    async def create_mission(self, payload: MissionCreate) -> MissionResponse:
        """Create a new Mission after validating agency existence and slug uniqueness."""
        await self.get_agency_model(payload.agency_id)

        existing_name = await self.mission_repo.get_by_name(payload.name)
        if existing_name:
            raise DuplicateNameError(f"A mission with name '{payload.name}' already exists.")

        slug = payload.slug or slugify(payload.name)
        existing_slug = await self.mission_repo.get_by_slug(slug)
        if existing_slug:
            raise DuplicateSlugError(f"A mission with slug '{slug}' already exists.")

        data = payload.model_dump(exclude_none=True)
        data["slug"] = slug

        mission = await self.mission_repo.create(**data)
        fresh = await self.mission_repo.get_by_id(mission.id)
        return MissionResponse.model_validate(fresh or mission)

    async def get_mission_by_id_or_slug(self, identifier: str | UUID) -> MissionResponse:
        """Fetch Mission by UUID or slug or raise MissionNotFoundError."""
        mission = await self.mission_repo.get_by_id_or_slug(identifier)
        if not mission:
            raise MissionNotFoundError(f"Mission '{identifier}' not found.")
        return MissionResponse.model_validate(mission)

    async def get_mission_model(self, identifier: str | UUID) -> Mission:
        """Fetch Mission ORM instance or raise MissionNotFoundError."""
        mission = await self.mission_repo.get_by_id_or_slug(identifier)
        if not mission:
            raise MissionNotFoundError(f"Mission '{identifier}' not found.")
        return mission

    async def list_missions(
        self,
        search: str | None = None,
        agency: str | None = None,
        destination: str | None = None,
        mission_type: str | None = None,
        status: str | None = None,
        year: int | None = None,
        featured: bool | None = None,
        sort: str = "launch_date",
        order: str = "asc",
        page: int = 1,
        limit: int = 10,
    ) -> MissionListResponse:
        """Return paginated list of Missions with multi-field search and filters."""
        items, total, pages = await self.mission_repo.list_missions(
            search=search,
            agency=agency,
            destination=destination,
            mission_type=mission_type,
            status=status,
            year=year,
            featured=featured,
            sort=sort,
            order=order,
            page=page,
            limit=limit,
        )
        return MissionListResponse(
            items=[MissionResponse.model_validate(item) for item in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def get_agency_missions(
        self,
        agency_slug_or_id: str | UUID,
        page: int = 1,
        limit: int = 10,
    ) -> MissionListResponse:
        """List missions conducted by a specific agency."""
        agency = await self.get_agency_model(agency_slug_or_id)
        return await self.list_missions(
            agency=str(agency.id),
            page=page,
            limit=limit,
        )

    async def update_mission(self, identifier: str | UUID, payload: MissionUpdate) -> MissionResponse:
        """Update an existing Mission."""
        mission = await self.get_mission_model(identifier)
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            return MissionResponse.model_validate(mission)

        if "agency_id" in update_data and update_data["agency_id"] is not None:
            await self.get_agency_model(update_data["agency_id"])

        if "name" in update_data and update_data["name"] != mission.name:
            existing_name = await self.mission_repo.get_by_name(update_data["name"])
            if existing_name and existing_name.id != mission.id:
                raise DuplicateNameError(f"A mission with name '{update_data['name']}' already exists.")

        if "slug" in update_data:
            new_slug = update_data["slug"] or slugify(update_data.get("name", mission.name))
            update_data["slug"] = new_slug
            if new_slug != mission.slug:
                existing_slug = await self.mission_repo.get_by_slug(new_slug)
                if existing_slug and existing_slug.id != mission.id:
                    raise DuplicateSlugError(f"A mission with slug '{new_slug}' already exists.")

        await self.mission_repo.update(mission, **update_data)
        updated = await self.mission_repo.get_by_id(mission.id)
        return MissionResponse.model_validate(updated or mission)

    async def delete_mission(self, identifier: str | UUID) -> None:
        """Delete a Mission."""
        mission = await self.get_mission_model(identifier)
        await self.mission_repo.delete(mission)

    async def get_mission_countdown(self, identifier: str | UUID) -> MissionCountdownResponse:
        """Calculate launch countdown timer for a mission."""
        mission = await self.get_mission_model(identifier)
        return CountdownService.calculate_countdown(mission.launch_date, mission.status)

    async def get_dashboard_latest_missions(self) -> dict[str, Any]:
        """Aggregate dashboard metrics: live, upcoming, recent completed, and featured missions."""
        live = await self.mission_repo.list_missions(status="Live", limit=5)
        upcoming = await self.mission_repo.list_missions(status="Upcoming", limit=5)
        completed = await self.mission_repo.list_missions(status="Successful", limit=5)
        featured = await self.mission_repo.list_missions(featured=True, limit=5)

        return {
            "live_missions": [MissionResponse.model_validate(m) for m in live[0]],
            "upcoming_missions": [MissionResponse.model_validate(m) for m in upcoming[0]],
            "recent_completed_missions": [MissionResponse.model_validate(m) for m in completed[0]],
            "featured_missions": [MissionResponse.model_validate(m) for m in featured[0]],
        }

    # -------------------------------------------------------------------------
    # MILESTONES
    # -------------------------------------------------------------------------

    async def create_milestone(
        self,
        mission_identifier: str | UUID,
        payload: MilestoneCreate,
    ) -> MilestoneResponse:
        """Create a new MissionMilestone linked to a mission."""
        mission = await self.get_mission_model(mission_identifier)
        data = payload.model_dump()
        data["mission_id"] = mission.id

        milestone = await self.milestone_repo.create(**data)
        fresh = await self.milestone_repo.get_by_id(milestone.id)
        return MilestoneResponse.model_validate(fresh or milestone)

    async def get_milestones_by_mission(self, mission_identifier: str | UUID) -> list[MilestoneResponse]:
        """Fetch all milestones for a mission."""
        mission = await self.get_mission_model(mission_identifier)
        items = await self.milestone_repo.get_by_mission_id(mission.id)
        return [MilestoneResponse.model_validate(m) for m in items]

    async def update_milestone(self, milestone_id: UUID, payload: MilestoneUpdate) -> MilestoneResponse:
        """Update an existing MissionMilestone."""
        milestone = await self.milestone_repo.get_by_id(milestone_id)
        if not milestone:
            raise MilestoneNotFoundError(f"Milestone with ID '{milestone_id}' not found.")

        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            return MilestoneResponse.model_validate(milestone)

        await self.milestone_repo.update(milestone, **update_data)
        updated = await self.milestone_repo.get_by_id(milestone_id)
        return MilestoneResponse.model_validate(updated or milestone)

    async def delete_milestone(self, milestone_id: UUID) -> None:
        """Delete a MissionMilestone."""
        milestone = await self.milestone_repo.get_by_id(milestone_id)
        if not milestone:
            raise MilestoneNotFoundError(f"Milestone with ID '{milestone_id}' not found.")
        await self.milestone_repo.delete(milestone)

    # -------------------------------------------------------------------------
    # MEDIA
    # -------------------------------------------------------------------------

    async def create_mission_media(
        self,
        mission_identifier: str | UUID,
        payload: MissionMediaCreate,
    ) -> MissionMediaResponse:
        """Create a new MissionMedia item attached to a mission."""
        mission = await self.get_mission_model(mission_identifier)
        data = payload.model_dump()
        data["mission_id"] = mission.id

        media = await self.media_repo.create(**data)
        fresh = await self.media_repo.get_by_id(media.id)
        return MissionMediaResponse.model_validate(fresh or media)

    async def get_media_by_mission(self, mission_identifier: str | UUID) -> list[MissionMediaResponse]:
        """Fetch all media items attached to a mission."""
        mission = await self.get_mission_model(mission_identifier)
        items = await self.media_repo.get_by_mission_id(mission.id)
        return [MissionMediaResponse.model_validate(m) for m in items]

    async def delete_mission_media(self, media_id: UUID) -> None:
        """Delete a MissionMedia item."""
        media = await self.media_repo.get_by_id(media_id)
        if not media:
            raise MissionMediaNotFoundError(f"Mission media with ID '{media_id}' not found.")
        await self.media_repo.delete(media)
