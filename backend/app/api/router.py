"""Cosmos Platform — API Router Aggregation.

Collects all route modules into a single versioned router.
All endpoints are served under the ``/api/v1`` prefix.
"""

from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.v1.eras import router as eras_router
from app.api.v1.timeline import router as timeline_router
from app.api.v1.planets import router as planets_router
from app.api.v1.moons import router as moons_router
from app.api.v1.planet_facts import router as planet_facts_router
from app.api.v1.agencies import router as agencies_router
from app.api.v1.missions import router as missions_router
from app.api.v1.milestones import router as milestones_router
from app.api.v1.media import router as media_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.stories import router as stories_router
from app.api.v1.chapters import router as chapters_router
from app.api.v1.story_categories import router as story_categories_router
from app.api.v1.story_tags import router as story_tags_router
from app.api.v1.reading_progress import router as reading_progress_router
from app.api.v1.search import router as search_router
from app.api.v1.bookmarks import router as bookmarks_router
from app.api.v1.collections import router as collections_router
from app.api.v1.activity import router as activity_router
from app.api.v1.notifications import router as notifications_router, admin_router as admin_notifications_router
from app.api.v1.notification_preferences import router as notification_preferences_router
from app.api.v1.websocket import router as websocket_router
from app.api.v1.ai import router as ai_router, admin_router as admin_ai_router
from app.api.v1.analytics import analytics_router, reports_router
from app.api.v1.performance import router as performance_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(eras_router)
api_router.include_router(timeline_router)
api_router.include_router(planets_router)
api_router.include_router(moons_router)
api_router.include_router(planet_facts_router)
api_router.include_router(agencies_router)
api_router.include_router(missions_router)
api_router.include_router(milestones_router)
api_router.include_router(media_router)
api_router.include_router(dashboard_router)
api_router.include_router(stories_router)
api_router.include_router(chapters_router)
api_router.include_router(story_categories_router)
api_router.include_router(story_tags_router)
api_router.include_router(reading_progress_router)
api_router.include_router(search_router)
api_router.include_router(bookmarks_router)
api_router.include_router(collections_router)
api_router.include_router(activity_router)
api_router.include_router(notifications_router)
api_router.include_router(admin_notifications_router)
api_router.include_router(notification_preferences_router)
api_router.include_router(websocket_router)
api_router.include_router(ai_router)
api_router.include_router(admin_ai_router)
api_router.include_router(analytics_router)
api_router.include_router(reports_router)
api_router.include_router(performance_router)
