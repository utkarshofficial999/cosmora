"""Cosmos Platform — Content Analytics API Tests.

Tests for tracking and querying top performing platform content.
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.analytics_service import AnalyticsService


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "ca_admin@cosmos.org",
            "username": "ca_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "ca_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_content_analytics_ranking(
    client: AsyncClient,
    admin_headers: dict[str, str],
    db_session: AsyncSession,
) -> None:
    """Test content analytics view tracking and top content ranking."""
    # 1. Track event
    service = AnalyticsService(db_session)
    await service.track_event(
        user_id=None,
        event_type="Story View",
        resource_type="Story",
        resource_id="sample-story-uuid",
    )

    # 2. Query content analytics
    resp = await client.get("/api/v1/admin/analytics/content", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "top_stories" in data
    assert "top_missions" in data
    assert any(item["resource_id"] == "sample-story-uuid" for item in data["top_stories"])
