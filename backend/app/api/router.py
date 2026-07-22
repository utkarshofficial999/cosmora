"""Cosmos Platform — API Router Aggregation.

Collects all route modules into a single versioned router.
All endpoints are served under the ``/api/v1`` prefix.
"""

from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(admin_router)


