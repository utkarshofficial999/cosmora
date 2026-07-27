"""Cosmos Platform — Report Service.

Generates executive daily, weekly, and monthly platform performance reports in JSON and CSV formats.
"""

import csv
from datetime import datetime, timedelta, timezone
from io import StringIO
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.analytics import ReportResponse


class ReportService:
    """Service compiling executive performance reports and generating downloadable CSV spreadsheets."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.dashboard_repo = DashboardRepository(session)

    async def generate_report(self, period: str, fmt: str = "json") -> ReportResponse:
        """Generate executive analytics report for specified period (Daily, Weekly, Monthly)."""
        now = datetime.now(timezone.utc)
        period_upper = period.upper().strip()

        if period_upper == "WEEKLY":
            start_date = (now - timedelta(days=7)).date()
        elif period_upper == "MONTHLY":
            start_date = (now - timedelta(days=30)).date()
        else:
            start_date = now.date()

        end_date = now.date()

        # Collect metrics
        metrics = {
            "Total Users": await self.dashboard_repo.get_total_users(),
            "Active Users": await self.dashboard_repo.get_active_users(),
            "Stories": await self.dashboard_repo.get_stories_count(),
            "Missions": await self.dashboard_repo.get_missions_count(),
            "Planets": await self.dashboard_repo.get_planets_count(),
            "Timeline Events": await self.dashboard_repo.get_timeline_events_count(),
            "Notifications Sent": await self.dashboard_repo.get_notifications_count(),
            "AI Conversations": await self.dashboard_repo.get_ai_conversations_count(),
            "Collections": await self.dashboard_repo.get_collections_count(),
            "Searches Executed": await self.dashboard_repo.get_searches_today(),
        }

        csv_text = None
        if fmt.lower() == "csv":
            output = StringIO()
            writer = csv.writer(output)
            writer.writerow(["Metric Name", "Value", "Report Period", "Generated At"])
            for key, val in metrics.items():
                writer.writerow([key, val, period.capitalize(), now.isoformat()])
            csv_text = output.getvalue()

        return ReportResponse(
            period=period.capitalize(),
            start_date=start_date,
            end_date=end_date,
            generated_at=now,
            metrics=metrics,
            csv_content=csv_text,
        )
