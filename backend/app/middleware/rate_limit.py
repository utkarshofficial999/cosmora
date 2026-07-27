"""Cosmos Platform — Rate Limit Middleware.

Enforces per-IP and per-path API rate limits using a sliding window token bucket.
"""

import time
from fastapi import status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware enforcing route-specific rate limits."""

    _ip_buckets: dict[str, list[float]] = {}

    def __init__(self, app: Any, requests_per_minute: int = 300) -> None:
        super().__init__(app)
        self.default_limit = requests_per_minute

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        client_ip = request.client.host if request.client else "127.0.0.1"
        path = request.url.path.lower()

        # Determine rate limit based on path
        limit = self.default_limit
        if "/auth/" in path:
            limit = 20
        elif "/ai/chat" in path:
            limit = 30
        elif "/search" in path:
            limit = 100

        bucket_key = f"{client_ip}:{path}"
        now = time.time()
        window_start = now - 60.0

        # Clean timestamps older than 60 seconds
        timestamps = [ts for ts in self._ip_buckets.get(bucket_key, []) if ts > window_start]

        if len(timestamps) >= limit:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Rate limit exceeded. Please wait before making more requests.",
                    "status_code": status.HTTP_429_TOO_MANY_REQUESTS,
                },
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                },
            )

        timestamps.append(now)
        self._ip_buckets[bucket_key] = timestamps

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(limit - len(timestamps))
        return response
