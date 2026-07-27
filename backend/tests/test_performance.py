"""Cosmos Platform — Performance & Cache Admin Endpoints Tests.

Tests for performance metrics, cache statistics, and flush endpoints.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "prf_admin@cosmos.org",
            "username": "prf_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "prf_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_admin_performance_and_cache_stats(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test Admin performance telemetry, cache stats, and flush endpoints."""
    # 1. Performance overview
    p_resp = await client.get("/api/v1/admin/performance", headers=admin_headers)
    assert p_resp.status_code == 200
    assert "average_latency_ms" in p_resp.json()

    # 2. Cache stats
    c_resp = await client.get("/api/v1/admin/cache", headers=admin_headers)
    assert c_resp.status_code == 200
    assert "hit_ratio" in c_resp.json()

    # 3. Cache flush
    f_resp = await client.post("/api/v1/admin/cache/clear", headers=admin_headers)
    assert f_resp.status_code == 200
