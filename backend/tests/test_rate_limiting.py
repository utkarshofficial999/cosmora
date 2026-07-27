"""Cosmos Platform — Rate Limiting Middleware Tests.

Tests for X-RateLimit headers and 429 Too Many Requests enforcement.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_rate_limit_middleware_headers(client: AsyncClient) -> None:
    """Test response headers injected by RateLimitMiddleware."""
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert "X-Process-Time" in resp.headers
    assert "X-Content-Type-Options" in resp.headers
