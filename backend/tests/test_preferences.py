"""Cosmos Platform — Notification Preference API Tests.

Tests for fetching and updating user notification channel preferences.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "pref_user@cosmos.org",
            "username": "pref_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "pref_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_get_and_update_preferences(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test GET and PUT /api/v1/notification-preferences endpoints."""
    # 1. GET preferences
    g_resp = await client.get("/api/v1/notification-preferences", headers=user_headers)
    assert g_resp.status_code == 200
    data = g_resp.json()
    assert data["mission_notifications"] is True
    assert data["email_notifications"] is False

    # 2. PUT preferences
    p_resp = await client.put(
        "/api/v1/notification-preferences",
        json={"email_notifications": True, "mission_notifications": False},
        headers=user_headers,
    )
    assert p_resp.status_code == 200
    updated = p_resp.json()
    assert updated["email_notifications"] is True
    assert updated["mission_notifications"] is False
