"""Cosmos Platform — Collections API Endpoints.

Provides REST API endpoints for user-curated Collections and items.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_current_user_optional, get_db
from app.models.user import User
from app.schemas.collection import (
    CollectionCreate,
    CollectionItemCreate,
    CollectionItemResponse,
    CollectionListResponse,
    CollectionResponse,
    CollectionUpdate,
)
from app.services.collection_service import CollectionService

router = APIRouter(prefix="/collections", tags=["Collections"])


@router.post(
    "",
    response_model=CollectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Collection",
    description="Creates a new user collection / playlist. Requires Authentication.",
)
async def create_collection(
    payload: CollectionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CollectionResponse:
    """Create a new user collection."""
    service = CollectionService(db)
    return await service.create_collection(current_user.id, payload)


@router.get(
    "",
    response_model=CollectionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List User Collections",
    description="Retrieves collections created by the authenticated user. Requires Authentication.",
)
async def list_collections(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CollectionListResponse:
    """List user's collections with pagination."""
    service = CollectionService(db)
    return await service.list_user_collections(current_user.id, page=page, limit=limit)


@router.get(
    "/{id}",
    response_model=CollectionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Collection by ID",
    description="Retrieves details of a public collection or owned private collection.",
)
async def get_collection(
    id: UUID,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
) -> CollectionResponse:
    """Get collection details."""
    service = CollectionService(db)
    user_id = current_user.id if current_user else None
    return await service.get_collection(id, current_user_id=user_id)


@router.patch(
    "/{id}",
    response_model=CollectionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a Collection",
    description="Updates collection title, description, or visibility. Restricted to collection owner.",
)
async def update_collection(
    id: UUID,
    payload: CollectionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CollectionResponse:
    """Update collection details."""
    service = CollectionService(db)
    return await service.update_collection(current_user.id, id, payload)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a Collection",
    description="Deletes a collection. Restricted to collection owner.",
)
async def delete_collection(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a collection."""
    service = CollectionService(db)
    await service.delete_collection(current_user.id, id)


@router.post(
    "/{id}/items",
    response_model=CollectionItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Item to Collection",
    description="Adds a resource item to a collection. Restricted to collection owner.",
)
async def add_collection_item(
    id: UUID,
    payload: CollectionItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CollectionItemResponse:
    """Add an item to a collection."""
    service = CollectionService(db)
    return await service.add_item(current_user.id, id, payload)


@router.delete(
    "/{id}/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove Item from Collection",
    description="Removes an item from a collection. Restricted to collection owner.",
)
async def remove_collection_item(
    id: UUID,
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Remove an item from a collection."""
    service = CollectionService(db)
    await service.remove_item(current_user.id, id, item_id)
