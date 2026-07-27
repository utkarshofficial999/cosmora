"""Cosmos Platform — Bookmark Service.

Implements business logic for User Bookmarks across all space resources.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import BookmarkNotFoundError, DuplicateBookmarkError
from app.repositories.bookmark_repository import BookmarkRepository
from app.schemas.bookmark import BookmarkCreate, BookmarkResponse


class BookmarkService:
    """Service handling user Bookmarks management."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.bookmark_repo = BookmarkRepository(session)

    async def create_bookmark(self, user_id: UUID, payload: BookmarkCreate) -> BookmarkResponse:
        """Create a new bookmark for a user."""
        existing = await self.bookmark_repo.get_by_user_and_resource(
            user_id=user_id,
            resource_type=payload.resource_type,
            resource_id=payload.resource_id,
        )
        if existing:
            raise DuplicateBookmarkError(
                f"Resource '{payload.resource_id}' of type '{payload.resource_type}' is already bookmarked."
            )

        bookmark = await self.bookmark_repo.create(
            user_id=user_id,
            resource_type=payload.resource_type,
            resource_id=payload.resource_id,
        )
        return BookmarkResponse.model_validate(bookmark)

    async def list_user_bookmarks(
        self,
        user_id: UUID,
        resource_type: str | None = None,
    ) -> list[BookmarkResponse]:
        """List all bookmarks saved by a user."""
        items = await self.bookmark_repo.list_user_bookmarks(user_id, resource_type=resource_type)
        return [BookmarkResponse.model_validate(b) for b in items]

    async def delete_bookmark(self, user_id: UUID, bookmark_id: UUID) -> None:
        """Delete a user's bookmark."""
        bookmark = await self.bookmark_repo.get_by_id(bookmark_id)
        if not bookmark or bookmark.user_id != user_id:
            raise BookmarkNotFoundError(f"Bookmark with ID '{bookmark_id}' not found.")

        await self.bookmark_repo.delete(bookmark)
