"""Cosmos Platform — Admin Analytics Dashboard API Tests.

Tests for high-level platform analytics KPIs.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "an_admin@cosmos.org",
            "username": "an_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "an_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_analytics_dashboard_endpoint(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test GET /api/v1/admin/analytics/dashboard KPI metrics endpoint."""
    resp = await client.get("/api/v1/admin/analytics/dashboard", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "daily_active_users" in data
    assert "monthly_active_users" in data
    assert "ai_usage_count" in data
    assert "search_volume" in data
