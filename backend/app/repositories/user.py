"""Cosmos Platform — User Repository.

Encapsulates database access methods for User entities.
"""

from typing import Any
from uuid import UUID

from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.user import User


class UserRepository:
    """Repository for handling User database operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: UUID, load_role: bool = True) -> User | None:
        """Fetch a user by ID with optional eager-loaded Role relationship."""
        query = select(User).where(User.id == user_id)
        if load_role:
            query = query.options(joinedload(User.role))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str, load_role: bool = True) -> User | None:
        """Fetch a user by unique email address."""
        query = select(User).where(User.email == email)
        if load_role:
            query = query.options(joinedload(User.role))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str, load_role: bool = True) -> User | None:
        """Fetch a user by unique username."""
        query = select(User).where(User.username == username)
        if load_role:
            query = query.options(joinedload(User.role))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_email_or_username(
        self, identifier: str, load_role: bool = True
    ) -> User | None:
        """Fetch a user matching either email or username."""
        query = select(User).where(
            or_(User.email == identifier, User.username == identifier)
        )
        if load_role:
            query = query.options(joinedload(User.role))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def create(self, user_data: dict[str, Any]) -> User:
        """Create and persist a new User."""
        user = User(**user_data)
        self.session.add(user)
        await self.session.flush()
        return user

    async def update(self, user: User, update_data: dict[str, Any]) -> User:
        """Update fields on an existing User."""
        for key, value in update_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        await self.session.flush()
        return user
