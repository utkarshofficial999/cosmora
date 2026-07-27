"""Cosmos Platform — FastAPI Dependencies.

Provides injectable dependencies for database sessions, authentication,
and Role-Based Access Control (RBAC).
"""

from collections.abc import AsyncGenerator, Callable, Coroutine
from typing import Any
from uuid import UUID

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.database.session import async_session_factory
from app.exceptions.auth import (
    AuthenticationError,
    InvalidTokenError,
    PermissionDeniedError,
)
from app.models.user import User
from app.repositories.user import UserRepository

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    description="JWT Bearer Authentication. Submit your credentials to /api/v1/auth/login to get tokens.",
)

oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async database session, ensuring cleanup on exit."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Validate bearer token and retrieve current authenticated user."""
    payload = decode_token(token, expected_type="access")
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise InvalidTokenError("Token payload missing subject identifier.")

    try:
        user_id = UUID(user_id_str)
    except ValueError as err:
        raise InvalidTokenError("Invalid user ID in token.") from err

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id, load_role=True)
    if not user:
        raise InvalidTokenError("User associated with this token no longer exists.")

    if not user.is_active:
        raise AuthenticationError("User account is inactive.")

    return user


async def get_current_user_optional(
    token: str | None = Depends(oauth2_scheme_optional),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Optionally validate bearer token and retrieve authenticated user if present."""
    if not token:
        return None
    try:
        return await get_current_user(token=token, db=db)
    except Exception:
        return None


def require_roles(
    *allowed_roles: str,
) -> Callable[..., Coroutine[Any, Any, User]]:
    """Dependency factory for Role-Based Access Control (RBAC).

    Usage:
        @router.get("/admin", dependencies=[Depends(require_roles("Admin"))])
        async def admin_only_route(): ...
    """

    async def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if current_user.is_superuser:
            return current_user

        if current_user.role.name not in allowed_roles:
            raise PermissionDeniedError(
                f"Role '{current_user.role.name}' does not have permission to access this resource. Required: {', '.join(allowed_roles)}"
            )
        return current_user

    return role_checker
