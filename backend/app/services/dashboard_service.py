"""Cosmos Platform — Dashboard Service.

Assembles aggregated platform metrics and recent activity streams for the Admin Dashboard.
"""

from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.audit_repository import AuditRepository
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import DashboardResponse, PlatformActivityItem


class DashboardService:
    """Service building platform metrics and executive dashboard insights."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.dashboard_repo = DashboardRepository(session)
        self.audit_repo = AuditRepository(session)

    async def get_dashboard_overview(self) -> DashboardResponse:
        """Aggregate operational counters across all platform modules."""
        total_users = await self.dashboard_repo.get_total_users()
        active_users = await self.dashboard_repo.get_active_users()
        stories_count = await self.dashboard_repo.get_stories_count()
        missions_count = await self.dashboard_repo.get_missions_count()
        planets_count = await self.dashboard_repo.get_planets_count()
        timeline_events_count = await self.dashboard_repo.get_timeline_events_count()
        notifications_count = await self.dashboard_repo.get_notifications_count()
        ai_conversations_count = await self.dashboard_repo.get_ai_conversations_count()
        collections_count = await self.dashboard_repo.get_collections_count()
        searches_today = await self.dashboard_repo.get_searches_today()

        # Fetch recent activities from audit logs
        audit_logs, _, _ = await self.audit_repo.list_audit_logs(limit=5)
        recent_activities = []
        for log in audit_logs:
            recent_activities.append(
                PlatformActivityItem(
                    resource_type=log.resource_type,
                    title=f"{log.resource_type} {log.action.lower()} by admin",
                    action=log.action,
                    timestamp=log.created_at,
                )
            )

        if not recent_activities:
            recent_activities.append(
                PlatformActivityItem(
                    resource_type="System",
                    title="Cosmora Platform Operating Normally",
                    action="HEALTHCHECK",
                    timestamp=datetime.now(timezone.utc),
                )
            )

        return DashboardResponse(
            total_users=total_users,
            stories_count=stories_count,
            missions_count=missions_count,
            planets_count=planets_count,
            timeline_events_count=timeline_events_count,
            notifications_count=notifications_count,
            ai_conversations_count=ai_conversations_count,
            collections_count=collections_count,
            searches_today=searches_today,
            active_users=active_users,
            recent_activities=recent_activities,
        )
