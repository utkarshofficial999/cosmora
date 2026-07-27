"""Cosmos Platform — Analytics & Reports API Endpoints.

REST API routes for platform analytics dashboards, AI usage insights, content performance, and CSV report export.
"""

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_roles
from app.schemas.analytics import (
    AIAnalyticsResponse,
    AnalyticsDashboardResponse,
    ContentAnalyticsResponse,
    ReportResponse,
    SearchAnalyticsResponse,
    UserAnalyticsResponse,
)
from app.services.dashboard_analytics_service import DashboardAnalyticsService
from app.services.report_service import ReportService

analytics_router = APIRouter(prefix="/admin/analytics", tags=["Admin Analytics"])
reports_router = APIRouter(prefix="/admin/reports", tags=["Admin Reports"])


@analytics_router.get(
    "/dashboard",
    response_model=AnalyticsDashboardResponse,
    summary="Get Analytics Dashboard Overview",
    description="Fetch high-level platform analytics KPIs (DAU/MAU, AI usage, searches, story reads).",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_analytics_dashboard(
    db: AsyncSession = Depends(get_db),
) -> AnalyticsDashboardResponse:
    """Fetch analytics dashboard metrics."""
    service = DashboardAnalyticsService(db)
    return await service.get_dashboard_kpis()


@analytics_router.get(
    "/users",
    response_model=UserAnalyticsResponse,
    summary="Get User Engagement Analytics",
    description="Fetch user retention rates and active user telemetry.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_user_analytics(
    db: AsyncSession = Depends(get_db),
) -> UserAnalyticsResponse:
    """Fetch user analytics metrics."""
    service = DashboardAnalyticsService(db)
    return await service.get_user_analytics()


@analytics_router.get(
    "/content",
    response_model=ContentAnalyticsResponse,
    summary="Get Content Performance Rankings",
    description="Fetch top performing Stories, Missions, Planets, and Timeline Events.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_content_analytics(
    db: AsyncSession = Depends(get_db),
) -> ContentAnalyticsResponse:
    """Fetch content performance metrics."""
    service = DashboardAnalyticsService(db)
    return await service.get_content_analytics()


@analytics_router.get(
    "/ai",
    response_model=AIAnalyticsResponse,
    summary="Get AI Space Assistant Usage Analytics",
    description="Fetch AI conversation volume, response latency, and popular topics.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_ai_analytics(
    db: AsyncSession = Depends(get_db),
) -> AIAnalyticsResponse:
    """Fetch AI assistant analytics."""
    service = DashboardAnalyticsService(db)
    return await service.get_ai_analytics()


@analytics_router.get(
    "/search",
    response_model=SearchAnalyticsResponse,
    summary="Get Search Volume Analytics",
    description="Fetch search volume, top query terms, and failed searches.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def get_search_analytics(
    db: AsyncSession = Depends(get_db),
) -> SearchAnalyticsResponse:
    """Fetch search analytics."""
    service = DashboardAnalyticsService(db)
    return await service.get_search_analytics()


# EXECUTIVE REPORTING ENDPOINTS
@reports_router.get(
    "/daily",
    response_model=None,
    summary="Export Daily Performance Report",
    description="Export daily executive report in JSON or downloadable CSV format.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def export_daily_report(
    format: str = Query("json", description="Report format: 'json' or 'csv'"),
    db: AsyncSession = Depends(get_db),
) -> ReportResponse | Response:
    """Export daily performance report."""
    service = ReportService(db)
    report = await service.generate_report("daily", fmt=format)
    if format.lower() == "csv":
        return Response(
            content=report.csv_content or "",
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=daily_report.csv"},
        )
    return report


@reports_router.get(
    "/weekly",
    response_model=None,
    summary="Export Weekly Performance Report",
    description="Export weekly executive report in JSON or downloadable CSV format.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def export_weekly_report(
    format: str = Query("json", description="Report format: 'json' or 'csv'"),
    db: AsyncSession = Depends(get_db),
) -> ReportResponse | Response:
    """Export weekly performance report."""
    service = ReportService(db)
    report = await service.generate_report("weekly", fmt=format)
    if format.lower() == "csv":
        return Response(
            content=report.csv_content or "",
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=weekly_report.csv"},
        )
    return report


@reports_router.get(
    "/monthly",
    response_model=None,
    summary="Export Monthly Performance Report",
    description="Export monthly executive report in JSON or downloadable CSV format.",
    dependencies=[Depends(require_roles("Admin"))],
)
async def export_monthly_report(
    format: str = Query("json", description="Report format: 'json' or 'csv'"),
    db: AsyncSession = Depends(get_db),
) -> ReportResponse | Response:
    """Export monthly performance report."""
    service = ReportService(db)
    report = await service.generate_report("monthly", fmt=format)
    if format.lower() == "csv":
        return Response(
            content=report.csv_content or "",
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=monthly_report.csv"},
        )
    return report
