"""Cosmos Platform — API Router Aggregation.

Collects all route modules into a single versioned router.
All endpoints are served under the ``/api/v1`` prefix.
"""

from fastapi import APIRouter

from app.api.health import router as health_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)

