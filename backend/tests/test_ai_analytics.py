"""Cosmos Platform — AI Analytics API Tests.

Tests for AI Assistant usage analytics and query statistics.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "ai_admin@cosmos.org",
            "username": "ai_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "ai_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_ai_analytics_endpoint(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test GET /api/v1/admin/analytics/ai endpoint."""
    resp = await client.get("/api/v1/admin/analytics/ai", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_conversations" in data
    assert "questions_per_day" in data
    assert "average_response_time_ms" in data
    assert "most_asked_topics" in data
