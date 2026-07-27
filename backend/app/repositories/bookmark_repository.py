"""Cosmos Platform — Bookmark Repository.

Encapsulates database operations for user Bookmarks using SQLAlchemy Async 2.0.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.bookmark import Bookmark


class BookmarkRepository:
    """Repository managing user Bookmark entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, bookmark_id: UUID) -> Bookmark | None:
        """Fetch a Bookmark by primary key ID."""
        result = await self.session.execute(
            select(Bookmark).where(Bookmark.id == bookmark_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user_and_resource(
        self,
        user_id: UUID,
        resource_type: str,
        resource_id: str,
    ) -> Bookmark | None:
        """Fetch a Bookmark for a specific user and resource."""
        result = await self.session.execute(
            select(Bookmark).where(
                Bookmark.user_id == user_id,
                Bookmark.resource_type.ilike(resource_type),
                Bookmark.resource_id == str(resource_id),
            )
        )
        return result.scalar_one_or_none()

    async def create(self, user_id: UUID, resource_type: str, resource_id: str) -> Bookmark:
        """Create and persist a new Bookmark."""
        bookmark = Bookmark(
            user_id=user_id,
            resource_type=resource_type,
            resource_id=str(resource_id),
        )
        self.session.add(bookmark)
        await self.session.flush()
        return bookmark

    async def delete(self, bookmark: Bookmark) -> None:
        """Delete a Bookmark entity."""
        await self.session.delete(bookmark)
        await self.session.flush()

    async def list_user_bookmarks(
        self,
        user_id: UUID,
        resource_type: str | None = None,
    ) -> Sequence[Bookmark]:
        """Fetch all bookmarks for a user, with optional resource_type filter."""
        query = select(Bookmark).where(Bookmark.user_id == user_id)
        if resource_type:
            query = query.where(Bookmark.resource_type.ilike(resource_type))

        query = query.order_by(Bookmark.created_at.desc())
        result = await self.session.execute(query)
        return result.scalars().all()
