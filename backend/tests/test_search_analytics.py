"""Cosmos Platform — Search Analytics API Tests.

Tests for search volume tracking and query term insights.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "srch_admin@cosmos.org",
            "username": "srch_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "srch_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_search_analytics_endpoint(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test GET /api/v1/admin/analytics/search endpoint."""
    resp = await client.get("/api/v1/admin/analytics/search", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "top_searches" in data
    assert "failed_searches" in data
    assert "trending_keywords" in data
    assert "total_searches_today" in data
