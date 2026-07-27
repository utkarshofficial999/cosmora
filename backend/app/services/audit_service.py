"""Cosmos Platform — Audit Service.

Manages administrative audit trail logging and audit log retrieval.
"""

from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import AuditLogNotFoundError
from app.repositories.audit_repository import AuditRepository
from app.schemas.admin_cms import AuditLogListResponse, AuditLogResponse


class AuditService:
    """Service logging and querying admin audit trail entries."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.audit_repo = AuditRepository(session)

    async def record_action(
        self,
        admin_id: UUID | None,
        action: str,
        resource_type: str,
        resource_id: str | None = None,
        old_data: dict[str, Any] | None = None,
        new_data: dict[str, Any] | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> AuditLogResponse:
        """Record an admin action in the audit log."""
        entry = await self.audit_repo.log_action(
            admin_id=admin_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            old_data=old_data,
            new_data=new_data,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        return AuditLogResponse.model_validate(entry)

    async def list_audit_logs(
        self,
        admin_id: UUID | None = None,
        resource_type: str | None = None,
        action: str | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> AuditLogListResponse:
        """Fetch audit log history with pagination and filtering."""
        items, total, pages = await self.audit_repo.list_audit_logs(
            admin_id=admin_id,
            resource_type=resource_type,
            action=action,
            page=page,
            limit=limit,
        )
        return AuditLogListResponse(
            items=[AuditLogResponse.model_validate(log) for log in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def get_audit_log(self, audit_id: UUID) -> AuditLogResponse:
        """Fetch a specific audit log entry by ID."""
        entry = await self.audit_repo.get_by_id(audit_id)
        if not entry:
            raise AuditLogNotFoundError(f"Audit log '{audit_id}' not found.")
        return AuditLogResponse.model_validate(entry)
