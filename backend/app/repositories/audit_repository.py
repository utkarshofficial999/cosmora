"""Cosmos Platform — Audit Repository.

Encapsulates database operations for AdminAuditLog entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Any, Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin_audit_log import AdminAuditLog


class AuditRepository:
    """Repository managing AdminAuditLog database persistence and queries."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, audit_id: UUID) -> AdminAuditLog | None:
        """Fetch an AdminAuditLog entry by primary key ID."""
        result = await self.session.execute(
            select(AdminAuditLog).where(AdminAuditLog.id == audit_id)
        )
        return result.scalar_one_or_none()

    async def log_action(
        self,
        admin_id: UUID | None,
        action: str,
        resource_type: str,
        resource_id: str | None = None,
        old_data: dict[str, Any] | None = None,
        new_data: dict[str, Any] | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> AdminAuditLog:
        """Persist a new AdminAuditLog entry."""
        log_entry = AdminAuditLog(
            admin_id=admin_id,
            action=action.upper(),
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            old_data=old_data,
            new_data=new_data,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        self.session.add(log_entry)
        await self.session.flush()
        return log_entry

    async def list_audit_logs(
        self,
        admin_id: UUID | None = None,
        resource_type: str | None = None,
        action: str | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[AdminAuditLog], int, int]:
        """List audit log entries with pagination and filtering."""
        query = select(AdminAuditLog)

        if admin_id:
            query = query.where(AdminAuditLog.admin_id == admin_id)
        if resource_type:
            query = query.where(AdminAuditLog.resource_type.ilike(resource_type))
        if action:
            query = query.where(AdminAuditLog.action.ilike(action))

        total_result = await self.session.execute(select(query.subquery()))
        total = len(total_result.all())

        query = query.order_by(AdminAuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, pages
