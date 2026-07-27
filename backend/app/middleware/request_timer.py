"""Cosmos Platform — Request Timer Middleware.

Measures API request processing latency and injects the X-Process-Time header.
"""

import time
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class RequestTimerMiddleware(BaseHTTPMiddleware):
    """Middleware measuring request latency."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000.0
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        return response
