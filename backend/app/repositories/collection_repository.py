"""Cosmos Platform — Collection Repository.

Encapsulates database operations for Collection and CollectionItem entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.collection import Collection, CollectionItem


class CollectionRepository:
    """Repository managing user Collection and CollectionItem persistence."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, collection_id: UUID) -> Collection | None:
        """Fetch a Collection by primary key ID with items loaded."""
        result = await self.session.execute(
            select(Collection)
            .options(selectinload(Collection.items))
            .where(Collection.id == collection_id)
        )
        return result.scalar_one_or_none()

    async def create(self, **fields: object) -> Collection:
        """Create and persist a new Collection."""
        items = fields.pop("items", [])
        collection = Collection(**fields)
        self.session.add(collection)
        await self.session.flush()

        if items:
            for item in items:
                ci = CollectionItem(
                    collection_id=collection.id,
                    resource_type=item["resource_type"],
                    resource_id=str(item["resource_id"]),
                    display_order=item.get("display_order", 0),
                )
                self.session.add(ci)
            await self.session.flush()

        return collection

    async def update(self, collection: Collection, **fields: object) -> Collection:
        """Update fields on an existing Collection entity."""
        for key, value in fields.items():
            if value is not None and hasattr(collection, key):
                setattr(collection, key, value)
        await self.session.flush()
        return collection

    async def delete(self, collection: Collection) -> None:
        """Delete a Collection entity."""
        await self.session.delete(collection)
        await self.session.flush()

    async def list_user_collections(
        self,
        user_id: UUID,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[Collection], int, int]:
        """Fetch user's collections with pagination."""
        query = select(Collection).options(selectinload(Collection.items)).where(Collection.user_id == user_id)

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        query = query.order_by(Collection.created_at.desc()).offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, pages

    async def add_item(
        self,
        collection_id: UUID,
        resource_type: str,
        resource_id: str,
        display_order: int = 0,
    ) -> CollectionItem:
        """Add an item to an existing Collection."""
        item = CollectionItem(
            collection_id=collection_id,
            resource_type=resource_type,
            resource_id=str(resource_id),
            display_order=display_order,
        )
        self.session.add(item)
        await self.session.flush()
        return item

    async def get_item_by_id(self, item_id: UUID) -> CollectionItem | None:
        """Fetch a CollectionItem by primary key ID."""
        result = await self.session.execute(
            select(CollectionItem).where(CollectionItem.id == item_id)
        )
        return result.scalar_one_or_none()

    async def remove_item(self, item: CollectionItem) -> None:
        """Remove a CollectionItem from a Collection."""
        await self.session.delete(item)
        await self.session.flush()
