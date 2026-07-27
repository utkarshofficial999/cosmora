"""Cosmos Platform — Admin Repository.

Executes bulk actions and content moderation state transitions across platform entities.
"""

from typing import Any, Sequence
from uuid import UUID
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.mission import Mission
from app.models.moon import Moon
from app.models.planet import Planet
from app.models.story import Story
from app.models.timeline import TimelineEvent


class AdminRepository:
    """Repository handling content moderation and bulk database operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def update_status(self, resource_type: str, resource_id: str, new_status: str) -> bool:
        """Update publication/moderation status of a specific content entity."""
        target_model = self._resolve_model(resource_type)
        if not target_model or not hasattr(target_model, "status"):
            return False

        query = select(target_model).where(
            (target_model.id == UUID(resource_id)) if self._is_uuid(resource_id) else (target_model.slug == resource_id)
        )
        result = await self.session.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            return False

        item.status = new_status
        await self.session.flush()
        return True

    async def bulk_update_status(self, resource_type: str, resource_ids: list[str], new_status: str) -> int:
        """Execute bulk status update across multiple items of a resource_type."""
        target_model = self._resolve_model(resource_type)
        if not target_model or not hasattr(target_model, "status"):
            return 0

        uuids = [UUID(rid) for rid in resource_ids if self._is_uuid(rid)]
        slugs = [rid for rid in resource_ids if not self._is_uuid(rid)]

        affected = 0
        if uuids:
            res1 = await self.session.execute(
                update(target_model).where(target_model.id.in_(uuids)).values(status=new_status)
            )
            affected += res1.rowcount
        if slugs:
            res2 = await self.session.execute(
                update(target_model).where(target_model.slug.in_(slugs)).values(status=new_status)
            )
            affected += res2.rowcount

        await self.session.flush()
        return affected

    async def bulk_delete(self, resource_type: str, resource_ids: list[str]) -> int:
        """Execute bulk deletion across target resource items."""
        target_model = self._resolve_model(resource_type)
        if not target_model:
            return 0

        uuids = [UUID(rid) for rid in resource_ids if self._is_uuid(rid)]
        slugs = [rid for rid in resource_ids if not self._is_uuid(rid)]

        affected = 0
        for u_id in uuids:
            res = await self.session.execute(select(target_model).where(target_model.id == u_id))
            item = res.scalar_one_or_none()
            if item:
                await self.session.delete(item)
                affected += 1

        for s_slug in slugs:
            res = await self.session.execute(select(target_model).where(target_model.slug == s_slug))
            item = res.scalar_one_or_none()
            if item:
                await self.session.delete(item)
                affected += 1

        await self.session.flush()
        return affected

    def _resolve_model(self, resource_type: str) -> Any:
        """Resolve entity string to SQLAlchemy model class."""
        mapping = {
            "story": Story,
            "mission": Mission,
            "timelineevent": TimelineEvent,
            "planet": Planet,
            "moon": Moon,
        }
        return mapping.get(resource_type.lower().strip())

    @staticmethod
    def _is_uuid(val: str) -> bool:
        """Check if string is valid UUID."""
        try:
            UUID(val)
            return True
        except ValueError:
            return False
