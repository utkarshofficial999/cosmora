"""Cosmos Platform — Admin Dashboard API Tests.

Tests for aggregated operational platform metrics.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "dash_admin@cosmos.org",
            "username": "dash_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "dash_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_admin_dashboard_metrics(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test GET /api/v1/admin/dashboard aggregated operational metrics."""
    resp = await client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_users" in data
    assert "stories_count" in data
    assert "missions_count" in data
    assert "planets_count" in data
    assert "recent_activities" in data
    assert data["total_users"] >= 1
