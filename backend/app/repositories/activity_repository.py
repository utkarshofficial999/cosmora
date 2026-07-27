"""Cosmos Platform — Activity Repository.

Encapsulates database operations for UserActivity tracking using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_activity import UserActivity


class ActivityRepository:
    """Repository managing UserActivity interaction logs."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def log_activity(
        self,
        user_id: UUID,
        resource_type: str,
        resource_id: str,
        action: str,
        session_id: str | None = None,
        ip_address: str | None = None,
    ) -> UserActivity:
        """Create and persist a user activity interaction log."""
        activity = UserActivity(
            user_id=user_id,
            resource_type=resource_type,
            resource_id=str(resource_id),
            action=action,
            session_id=session_id,
            ip_address=ip_address,
        )
        self.session.add(activity)
        await self.session.flush()
        return activity

    async def get_user_activities(
        self,
        user_id: UUID,
        action: str | None = None,
        limit: int = 20,
    ) -> Sequence[UserActivity]:
        """Fetch recent interaction activities for a user."""
        query = select(UserActivity).where(UserActivity.user_id == user_id)
        if action:
            query = query.where(UserActivity.action.ilike(action))

        query = query.order_by(UserActivity.created_at.desc()).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()
