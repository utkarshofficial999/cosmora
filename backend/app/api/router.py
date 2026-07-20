"""Cosmos Platform — API Router Aggregation.

Collects all route modules into a single router for the application.
"""

from fastapi import APIRouter

from app.api.health import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
