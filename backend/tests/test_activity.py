"""Cosmos Platform — Activity API Tests.

Tests for User Activity history and Recently Viewed content.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "act_user@cosmos.org",
            "username": "act_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "act_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_user_activity_and_recent(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test user activity history and recently viewed endpoints."""
    # 1. Access a public entity (e.g. GET planet) to generate view activity
    await client.get("/api/v1/planets")

    # 2. GET /users/me/activity
    act_resp = await client.get("/api/v1/users/me/activity", headers=user_headers)
    assert act_resp.status_code == 200

    # 3. GET /users/me/recent
    rec_resp = await client.get("/api/v1/users/me/recent", headers=user_headers)
    assert rec_resp.status_code == 200
