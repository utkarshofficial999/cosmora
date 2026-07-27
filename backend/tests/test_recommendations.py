"""Cosmos Platform — Recommendations API Tests.

Tests for personalized recommendations endpoint.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "rec_user@cosmos.org",
            "username": "rec_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "rec_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_user_recommendations(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test GET /api/v1/users/me/recommendations endpoint."""
    resp = await client.get("/api/v1/users/me/recommendations", headers=user_headers)
    assert resp.status_code == 200
    assert "items" in resp.json()
