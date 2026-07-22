"""Cosmos Platform — Role Repository.

Encapsulates database access methods for Role entities.
"""

import logging
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.role import Role

logger = logging.getLogger(__name__)


class RoleRepository:
    """Repository for handling Role database operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, role_id: UUID) -> Role | None:
        """Fetch a role by its primary key ID."""
        result = await self.session.execute(
            select(Role).where(Role.id == role_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Role | None:
        """Fetch a role by unique role name."""
        result = await self.session.execute(
            select(Role).where(Role.name == name)
        )
        return result.scalar_one_or_none()

    async def create(self, name: str, description: str | None = None) -> Role:
        """Create and persist a new role."""
        role = Role(name=name, description=description)
        self.session.add(role)
        await self.session.flush()
        return role

    async def seed_default_roles(self) -> list[Role]:
        """Seed default system roles (Admin, Seller, Customer) if missing."""
        default_roles = [
            ("Admin", "Administrator with full system privileges"),
            ("Seller", "Seller with access to product and inventory management"),
            ("Customer", "Standard customer with purchasing privileges"),
        ]
        created_roles = []
        for role_name, description in default_roles:
            role = await self.get_by_name(role_name)
            if not role:
                logger.info("Seeding default role: %s", role_name)
                role = await self.create(name=role_name, description=description)
            created_roles.append(role)
        return created_roles
