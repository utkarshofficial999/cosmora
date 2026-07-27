"""Cosmos Platform — Health Check Tests.

Tests base and deep dependency health checks (/health, /health/db, /health/cache, /health/workers, /health/ai).
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_health_endpoint_returns_200(client: AsyncClient) -> None:
    """The /health endpoint should return 200 with service metadata."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["app_name"] == "Cosmos Platform"
    assert "status" in data
    assert "version" in data
    assert "database" in data


@pytest.mark.anyio
async def test_deep_component_health_endpoints(client: AsyncClient) -> None:
    """Test deep component health endpoints."""
    # 1. DB health
    db_resp = await client.get("/api/v1/health/db")
    assert db_resp.status_code == 200
    assert db_resp.json()["status"] == "healthy"

    # 2. Cache health
    cache_resp = await client.get("/api/v1/health/cache")
    assert cache_resp.status_code == 200
    assert cache_resp.json()["status"] == "healthy"

    # 3. Workers health
    w_resp = await client.get("/api/v1/health/workers")
    assert w_resp.status_code == 200
    assert w_resp.json()["status"] == "healthy"

    # 4. AI health
    ai_resp = await client.get("/api/v1/health/ai")
    assert ai_resp.status_code == 200
    assert ai_resp.json()["status"] == "healthy"
