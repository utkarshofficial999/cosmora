"""Cosmos Platform — Admin Router.

Provides admin-only management endpoints protected by RBAC dependencies.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.models.user import User
from app.schemas.admin_cms import (
    AuditLogListResponse,
    AuditLogResponse,
    BulkActionRequest,
    BulkActionResponse,
    ModerationResponse,
)
from app.schemas.dashboard import DashboardResponse
from app.schemas.user import UserResponse
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/admin", tags=["Admin CMS"])


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Admin Operational Dashboard Overview",
    description="Aggregated platform statistics across all 10 domain modules.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_admin_dashboard_metrics(
    db: AsyncSession = Depends(get_db),
) -> DashboardResponse:
    """Retrieve aggregated platform operational metrics."""
    service = DashboardService(db)
    return await service.get_dashboard_overview()


@router.get(
    "/users",
    response_model=list[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Users (Admin Only)",
    description="Retrieve all registered users across the platform.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def list_users(
    db: AsyncSession = Depends(get_db),
) -> list[UserResponse]:
    """Retrieve all users (Admin privilege required)."""
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload

    result = await db.execute(select(User).options(joinedload(User.role)))
    users = result.scalars().all()
    return [UserResponse.model_validate(u) for u in users]


# AUDIT LOG ENDPOINTS
@router.get(
    "/audit",
    response_model=AuditLogListResponse,
    summary="List Admin Audit Logs",
    description="Fetch paginated audit trail of all administrative actions.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def list_audit_logs(
    admin_id: UUID | None = Query(None, description="Filter by admin user ID"),
    resource_type: str | None = Query(None, description="Filter by resource type"),
    action: str | None = Query(None, description="Filter by action type"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> AuditLogListResponse:
    """Fetch audit log entries."""
    service = AuditService(db)
    return await service.list_audit_logs(
        admin_id=admin_id,
        resource_type=resource_type,
        action=action,
        page=page,
        limit=limit,
    )


@router.get(
    "/audit/{id}",
    response_model=AuditLogResponse,
    summary="Get Audit Log Detail",
    description="Fetch specific admin audit log entry by ID.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_audit_log_detail(
    id: UUID,
    db: AsyncSession = Depends(get_db),
) -> AuditLogResponse:
    """Fetch single audit log entry."""
    service = AuditService(db)
    return await service.get_audit_log(audit_id=id)


# CONTENT MODERATION ENDPOINTS
@router.patch(
    "/stories/{id}/publish",
    response_model=ModerationResponse,
    summary="Publish Story",
    description="Change Story status to Published.",
)
async def publish_story(
    id: str,
    request: Request,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> ModerationResponse:
    """Publish a story."""
    service = AdminService(db)
    return await service.moderate_content(
        admin_id=current_user.id,
        resource_type="Story",
        resource_id=id,
        new_status="Published",
    )


@router.patch(
    "/stories/{id}/archive",
    response_model=ModerationResponse,
    summary="Archive Story",
    description="Change Story status to Archived.",
)
async def archive_story(
    id: str,
    request: Request,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> ModerationResponse:
    """Archive a story."""
    service = AdminService(db)
    return await service.moderate_content(
        admin_id=current_user.id,
        resource_type="Story",
        resource_id=id,
        new_status="Archived",
    )


@router.patch(
    "/missions/{id}/publish",
    response_model=ModerationResponse,
    summary="Publish Mission",
    description="Change Mission status to Active/Published.",
)
async def publish_mission(
    id: str,
    request: Request,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> ModerationResponse:
    """Publish a mission."""
    service = AdminService(db)
    return await service.moderate_content(
        admin_id=current_user.id,
        resource_type="Mission",
        resource_id=id,
        new_status="Active",
    )


@router.patch(
    "/timeline/{id}/publish",
    response_model=ModerationResponse,
    summary="Publish Timeline Event",
    description="Publish a timeline event.",
)
async def publish_timeline_event(
    id: str,
    request: Request,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> ModerationResponse:
    """Publish a timeline event."""
    service = AdminService(db)
    return await service.moderate_content(
        admin_id=current_user.id,
        resource_type="TimelineEvent",
        resource_id=id,
        new_status="Published",
    )


# BULK OPERATIONS ENDPOINTS
@router.post(
    "/bulk/publish",
    response_model=BulkActionResponse,
    summary="Bulk Publish Content",
    description="Bulk publish target content items.",
)
async def bulk_publish_content(
    payload: BulkActionRequest,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> BulkActionResponse:
    """Bulk publish content items."""
    service = AdminService(db)
    return await service.bulk_action(admin_id=current_user.id, action="PUBLISH", payload=payload)


@router.post(
    "/bulk/archive",
    response_model=BulkActionResponse,
    summary="Bulk Archive Content",
    description="Bulk archive target content items.",
)
async def bulk_archive_content(
    payload: BulkActionRequest,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> BulkActionResponse:
    """Bulk archive content items."""
    service = AdminService(db)
    return await service.bulk_action(admin_id=current_user.id, action="ARCHIVE", payload=payload)


@router.post(
    "/bulk/delete",
    response_model=BulkActionResponse,
    summary="Bulk Delete Content",
    description="Bulk delete target content items.",
)
async def bulk_delete_content(
    payload: BulkActionRequest,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> BulkActionResponse:
    """Bulk delete content items."""
    service = AdminService(db)
    return await service.bulk_action(admin_id=current_user.id, action="DELETE", payload=payload)


@router.post(
    "/bulk/restore",
    response_model=BulkActionResponse,
    summary="Bulk Restore Content",
    description="Bulk restore target content items to Draft.",
)
async def bulk_restore_content(
    payload: BulkActionRequest,
    current_user: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
) -> BulkActionResponse:
    """Bulk restore content items."""
    service = AdminService(db)
    return await service.bulk_action(admin_id=current_user.id, action="RESTORE", payload=payload)
