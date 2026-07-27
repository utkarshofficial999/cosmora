"""Cosmos Platform — Collection Service.

Implements business logic for user-curated Collections and items.
"""

from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.auth import PermissionDeniedError
from app.exceptions.catalog import CollectionItemNotFoundError, CollectionNotFoundError
from app.repositories.collection_repository import CollectionRepository
from app.schemas.collection import (
    CollectionCreate,
    CollectionItemCreate,
    CollectionItemResponse,
    CollectionListResponse,
    CollectionResponse,
    CollectionUpdate,
)


class CollectionService:
    """Service handling User Collections and items management."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.collection_repo = CollectionRepository(session)

    async def create_collection(self, user_id: UUID, payload: CollectionCreate) -> CollectionResponse:
        """Create a new user collection."""
        data = payload.model_dump(exclude={"items"})
        data["user_id"] = user_id
        items = [i.model_dump() for i in payload.items]

        collection = await self.collection_repo.create(**data, items=items)
        fresh = await self.collection_repo.get_by_id(collection.id)
        return CollectionResponse.model_validate(fresh or collection)

    async def get_collection(self, collection_id: UUID, current_user_id: UUID | None = None) -> CollectionResponse:
        """Fetch details of a collection."""
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise CollectionNotFoundError(f"Collection '{collection_id}' not found.")

        if not collection.is_public and (not current_user_id or collection.user_id != current_user_id):
            raise PermissionDeniedError("Private collection requires ownership.")

        return CollectionResponse.model_validate(collection)

    async def list_user_collections(self, user_id: UUID, page: int = 1, limit: int = 10) -> CollectionListResponse:
        """List user's collections with pagination."""
        items, total, pages = await self.collection_repo.list_user_collections(user_id, page=page, limit=limit)
        return CollectionListResponse(
            items=[CollectionResponse.model_validate(c) for c in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def update_collection(
        self,
        user_id: UUID,
        collection_id: UUID,
        payload: CollectionUpdate,
    ) -> CollectionResponse:
        """Update an existing collection."""
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise CollectionNotFoundError(f"Collection '{collection_id}' not found.")

        if collection.user_id != user_id:
            raise PermissionDeniedError("Only the collection owner can update it.")

        update_data = payload.model_dump(exclude_unset=True)
        await self.collection_repo.update(collection, **update_data)
        updated = await self.collection_repo.get_by_id(collection_id)
        return CollectionResponse.model_validate(updated or collection)

    async def delete_collection(self, user_id: UUID, collection_id: UUID) -> None:
        """Delete a collection."""
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise CollectionNotFoundError(f"Collection '{collection_id}' not found.")

        if collection.user_id != user_id:
            raise PermissionDeniedError("Only the collection owner can delete it.")

        await self.collection_repo.delete(collection)

    async def add_item(
        self,
        user_id: UUID,
        collection_id: UUID,
        payload: CollectionItemCreate,
    ) -> CollectionItemResponse:
        """Add an item to a collection."""
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise CollectionNotFoundError(f"Collection '{collection_id}' not found.")

        if collection.user_id != user_id:
            raise PermissionDeniedError("Only the collection owner can modify items.")

        item = await self.collection_repo.add_item(
            collection_id=collection_id,
            resource_type=payload.resource_type,
            resource_id=payload.resource_id,
            display_order=payload.display_order,
        )
        return CollectionItemResponse.model_validate(item)

    async def remove_item(
        self,
        user_id: UUID,
        collection_id: UUID,
        item_id: UUID,
    ) -> None:
        """Remove an item from a collection."""
        collection = await self.collection_repo.get_by_id(collection_id)
        if not collection:
            raise CollectionNotFoundError(f"Collection '{collection_id}' not found.")

        if collection.user_id != user_id:
            raise PermissionDeniedError("Only the collection owner can remove items.")

        item = await self.collection_repo.get_item_by_id(item_id)
        if not item or item.collection_id != collection_id:
            raise CollectionItemNotFoundError(f"Collection item '{item_id}' not found in collection.")

        await self.collection_repo.remove_item(item)
