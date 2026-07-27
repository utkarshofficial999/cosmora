"""Cosmos Platform — Application Entry Point.

Creates and configures the FastAPI application instance.
"""

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

from app.api.router import api_router
from app.config.settings import get_settings
from app.config.logging import setup_logging
from app.database.session import engine
from app.exceptions import register_exception_handlers
from app.middleware.cors import add_cors_middleware
from app.middleware.request_timer import RequestTimerMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle application startup and shutdown events."""
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    logger.info("Environment: %s", settings.app_env)
    logger.info("Database: %s", settings.postgres_host)

    # Seed default roles on application startup
    try:
        from app.database.session import async_session_factory
        from app.repositories.role import RoleRepository

        async with async_session_factory() as session:
            role_repo = RoleRepository(session)
            await role_repo.seed_default_roles()
            await session.commit()
    except Exception:
        logger.exception("Failed to seed default roles on startup")

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
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestTimerMiddleware)

# ── Exception Handlers ──────────────────────
register_exception_handlers(app)

# ── Routes ───────────────────────────────────
app.include_router(api_router)
