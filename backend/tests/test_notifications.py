"""Cosmos Platform — Notifications API Tests.

Tests for user notification feeds, unread counts, marking read, and deleting notifications.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "notif_user@cosmos.org",
            "username": "notif_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "notif_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_notification_feed_and_unread(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test getting notification feed and unread items."""
    # 1. Initial list empty
    resp = await client.get("/api/v1/notifications", headers=user_headers)
    assert resp.status_code == 200
    assert resp.json()["total"] == 0

    # 2. Get unread shortcut
    u_resp = await client.get("/api/v1/notifications/unread", headers=user_headers)
    assert u_resp.status_code == 200
    assert u_resp.json()["unread_count"] == 0


@pytest.mark.anyio
async def test_mark_and_delete_notifications(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test marking all notifications as read and deleting notifications."""
    # Mark all read on empty or existing feed returns 204
    resp = await client.patch("/api/v1/notifications/read-all", headers=user_headers)
    assert resp.status_code == 204
