"""Cosmos Platform — Admin Service.

Handles content moderation state transitions, bulk publishing/archiving, and asset validations.
"""

from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.catalog import AppDomainException, ValidationError
from app.repositories.admin_repository import AdminRepository
from app.schemas.admin_cms import BulkActionRequest, BulkActionResponse, ModerationResponse
from app.services.audit_service import AuditService


class AdminService:
    """Service executing content moderation workflows and bulk CMS actions."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.admin_repo = AdminRepository(session)
        self.audit_service = AuditService(session)

    async def moderate_content(
        self,
        admin_id: UUID,
        resource_type: str,
        resource_id: str,
        new_status: str,
    ) -> ModerationResponse:
        """Update single item moderation status and record audit log."""
        success = await self.admin_repo.update_status(resource_type, resource_id, new_status)
        if not success:
            raise AppDomainException(f"Failed to update status for {resource_type} '{resource_id}'.")

        await self.audit_service.record_action(
            admin_id=admin_id,
            action=new_status.upper(),
            resource_type=resource_type,
            resource_id=resource_id,
            new_data={"status": new_status},
        )

        return ModerationResponse(
            id=resource_id,
            resource_type=resource_type,
            new_status=new_status,
            updated_at=datetime.now(timezone.utc),
        )

    async def bulk_action(
        self,
        admin_id: UUID,
        action: str,
        payload: BulkActionRequest,
    ) -> BulkActionResponse:
        """Execute bulk content action (publish, archive, delete, restore) and log audit event."""
        act_upper = action.upper().strip()
        resource_type = payload.resource_type
        resource_ids = payload.resource_ids

        if not resource_ids:
            raise ValidationError("Bulk action requires at least one resource ID.")

        affected_count = 0
        if act_upper == "PUBLISH":
            affected_count = await self.admin_repo.bulk_update_status(resource_type, resource_ids, "Published")
        elif act_upper == "ARCHIVE":
            affected_count = await self.admin_repo.bulk_update_status(resource_type, resource_ids, "Archived")
        elif act_upper == "DELETE":
            affected_count = await self.admin_repo.bulk_delete(resource_type, resource_ids)
        elif act_upper == "RESTORE":
            affected_count = await self.admin_repo.bulk_update_status(resource_type, resource_ids, "Draft")
        else:
            raise ValidationError(f"Unsupported bulk action '{action}'.")

        await self.audit_service.record_action(
            admin_id=admin_id,
            action=f"BULK_{act_upper}",
            resource_type=resource_type,
            new_data={"affected_count": affected_count, "ids": resource_ids},
        )

        return BulkActionResponse(
            affected_count=affected_count,
            action=act_upper,
            resource_type=resource_type,
            status="Completed",
        )
