"""Cosmos Platform — Global Exception Handlers.

Registers centralized exception handlers on the FastAPI application
to ensure that:
  - Unhandled exceptions never leak stack traces to clients.
  - All errors are logged with full context for debugging.
  - Clients always receive a consistent JSON error response.
"""

import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.exceptions.auth import AuthBaseException

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    """Register all global exception handlers on the application."""

    @app.exception_handler(AuthBaseException)
    async def auth_exception_handler(
        request: Request,
        exc: AuthBaseException,
    ) -> JSONResponse:
        """Handle domain authentication and authorization exceptions."""
        headers = {}
        if exc.status_code == status.HTTP_401_UNAUTHORIZED:
            headers["WWW-Authenticate"] = "Bearer"
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=headers,
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ) -> JSONResponse:
        """Handle known HTTP exceptions (404, 403, etc.)."""
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        """Handle Pydantic request validation errors.

        Returns a 422 with sanitized field-level error details.
        """
        logger.warning(
            "Validation error on %s %s: %s",
            request.method,
            request.url.path,
            exc.errors(),
        )
        return JSONResponse(
            status_code=422,
            content={
                "detail": "Validation error",
                "errors": [
                    {
                        "field": " -> ".join(str(loc) for loc in err["loc"]),
                        "message": err["msg"],
                        "type": err["type"],
                    }
                    for err in exc.errors()
                ],
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        """Catch-all for any unhandled exception.

        Logs the full traceback server-side but returns only a
        generic message to the client — never exposing internals.
        """
        logger.exception(
            "Unhandled %s on %s %s",
            type(exc).__name__,
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )
