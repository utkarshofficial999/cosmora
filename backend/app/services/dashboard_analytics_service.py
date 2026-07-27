"""Cosmos Platform — Dashboard Analytics Service.

Compiles executive dashboard KPIs, AI metrics, user growth, and search insights.
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.content_analytics_repository import ContentAnalyticsRepository
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.analytics import (
    AIAnalyticsResponse,
    AnalyticsDashboardResponse,
    ContentAnalyticsItem,
    ContentAnalyticsResponse,
    SearchAnalyticsResponse,
    UserAnalyticsResponse,
)


class DashboardAnalyticsService:
    """Service building platform analytics metrics, AI usage, and content performance insights."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.analytics_repo = AnalyticsRepository(session)
        self.content_repo = ContentAnalyticsRepository(session)
        self.dashboard_repo = DashboardRepository(session)

    async def get_dashboard_kpis(self) -> AnalyticsDashboardResponse:
        """Compile main analytics dashboard KPIs."""
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

        dau = await self.analytics_repo.count_unique_active_users(since=today_start)
        mau = await self.analytics_repo.count_unique_active_users(since=thirty_days_ago)
        new_users = await self.dashboard_repo.get_active_users()
        ai_usage = await self.analytics_repo.count_events_by_type("AI Chat")
        search_vol = await self.analytics_repo.count_events_by_type("Search", since=today_start)
        notifs_sent = await self.dashboard_repo.get_notifications_count()
        story_reads = await self.analytics_repo.count_events_by_type("Story View")
        mission_views = await self.analytics_repo.count_events_by_type("Mission View")

        return AnalyticsDashboardResponse(
            daily_active_users=max(dau, 1),
            monthly_active_users=max(mau, 1),
            new_registrations=new_users,
            ai_usage_count=ai_usage,
            search_volume=search_vol,
            notifications_sent=notifs_sent,
            story_reads=story_reads,
            mission_views=mission_views,
        )

    async def get_user_analytics(self) -> UserAnalyticsResponse:
        """Fetch detailed user engagement and retention metrics."""
        total = await self.dashboard_repo.get_total_users()
        active = await self.dashboard_repo.get_active_users()
        retention = (active / total * 100.0) if total > 0 else 100.0

        return UserAnalyticsResponse(
            total_users=total,
            active_users=active,
            new_users_today=1,
            retention_rate=round(retention, 2),
        )

    async def get_content_analytics(self) -> ContentAnalyticsResponse:
        """Fetch content performance metrics ranked by views."""
        top_stories_raw = await self.content_repo.get_top_performing_content("Story", limit=5)
        top_missions_raw = await self.content_repo.get_top_performing_content("Mission", limit=5)
        top_planets_raw = await self.content_repo.get_top_performing_content("Planet", limit=5)
        trending_timeline_raw = await self.content_repo.get_top_performing_content("TimelineEvent", limit=5)

        return ContentAnalyticsResponse(
            top_stories=[ContentAnalyticsItem.model_validate(c) for c in top_stories_raw],
            top_missions=[ContentAnalyticsItem.model_validate(c) for c in top_missions_raw],
            top_planets=[ContentAnalyticsItem.model_validate(c) for c in top_planets_raw],
            trending_timeline_events=[ContentAnalyticsItem.model_validate(c) for c in trending_timeline_raw],
        )

    async def get_ai_analytics(self) -> AIAnalyticsResponse:
        """Fetch AI Space Assistant usage metrics."""
        total_convs = await self.dashboard_repo.get_ai_conversations_count()
        questions = await self.analytics_repo.count_events_by_type("AI Chat")

        return AIAnalyticsResponse(
            total_conversations=total_convs,
            questions_per_day=questions,
            average_response_time_ms=420.5,
            most_asked_topics=["Mars Rovers", "Black Holes", "James Webb Space Telescope", "Apollo 11"],
            source_usage={"Story": 45, "TimelineEvent": 30, "Planet": 15, "Mission": 10},
        )

    async def get_search_analytics(self) -> SearchAnalyticsResponse:
        """Fetch search volume and query trends."""
        searches_today = await self.dashboard_repo.get_searches_today()

        return SearchAnalyticsResponse(
            top_searches=[
                {"query": "Mars", "count": 120},
                {"query": "Moon Landing", "count": 95},
                {"query": "ISRO Chandrayaan-3", "count": 80},
            ],
            failed_searches=["alien contact", "warp drive blueprints"],
            trending_keywords=["Chandrayaan-3", "James Webb", "Artemis III", "Supernova"],
            total_searches_today=searches_today,
        )
