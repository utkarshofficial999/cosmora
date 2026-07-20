"""Cosmos Platform — Application Entry Point.

Creates and configures the FastAPI application instance.
"""

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from app.api.router import api_router
from app.config.settings import get_settings
from app.config.logging import setup_logging
from app.db.session import engine
from app.middleware.cors import add_cors_middleware

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle application startup and shutdown events."""
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    logger.info("Environment: %s", settings.app_env)
    logger.info("Database: %s", settings.postgres_host)
    yield
    logger.info("Shutting down — disposing database engine")
    await engine.dispose()


settings = get_settings()
setup_logging(settings.log_level)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A story-driven space exploration platform.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ── Middleware ───────────────────────────────
add_cors_middleware(app, settings)

# ── Routes ───────────────────────────────────
app.include_router(api_router)
