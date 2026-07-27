"""Cosmos Platform — Activity Service.

Implements business logic for User Activity tracking and Recently Viewed content history.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.activity_repository import ActivityRepository
from app.schemas.activity import ActivityCreate, ActivityResponse


class ActivityService:
    """Service handling User Activity logging and recent interaction history."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.activity_repo = ActivityRepository(session)

    async def log_activity(self, user_id: UUID, payload: ActivityCreate) -> ActivityResponse:
        """Log a user activity interaction event."""
        activity = await self.activity_repo.log_activity(
            user_id=user_id,
            resource_type=payload.resource_type,
            resource_id=payload.resource_id,
            action=payload.action,
            session_id=payload.session_id,
            ip_address=payload.ip_address,
        )
        return ActivityResponse.model_validate(activity)

    async def get_user_activities(
        self,
        user_id: UUID,
        action: str | None = None,
        limit: int = 20,
    ) -> list[ActivityResponse]:
        """Fetch user interaction history logs."""
        items = await self.activity_repo.get_user_activities(user_id, action=action, limit=limit)
        return [ActivityResponse.model_validate(a) for a in items]

    async def get_recently_viewed(self, user_id: UUID, limit: int = 10) -> list[ActivityResponse]:
        """Fetch user's recently viewed resources."""
        return await self.get_user_activities(user_id, action="View", limit=limit)
