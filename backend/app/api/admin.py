"""Cosmos Platform — Admin Router.

Provides admin-only management endpoints protected by RBAC dependencies.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.auth import MessageResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get(
    "/dashboard",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Admin Dashboard Access Check",
    description="Restricted endpoint accessible only to users with Admin role.",
)
async def admin_dashboard(
    current_user: User = Depends(require_roles("Admin")),
) -> MessageResponse:
    """Access check for Admin-only dashboard."""
    return MessageResponse(
        message=f"Welcome to Admin Dashboard, {current_user.first_name or current_user.username}!"
    )


@router.get(
    "/users",
    response_model=list[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Users (Admin Only)",
    description="Retrieve all registered users across the platform.",
)
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("Admin")),
) -> list[UserResponse]:
    """Retrieve all users (Admin privilege required)."""
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload

    result = await db.execute(select(User).options(joinedload(User.role)))
    users = result.scalars().all()
    return [UserResponse.model_validate(u) for u in users]
