"""Cosmos Platform — Reading Progress API Tests.

Tests for saving reading progress, history, and continue-reading features.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "progress_user@cosmos.org",
            "username": "progress_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "progress_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_story_slug(client: AsyncClient) -> str:
    """Fixture registering admin and creating a story, returning story slug."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "prog_admin@cosmos.org",
            "username": "prog_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "prog_admin", "password": "ValidP@ssword123"},
    )
    headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    s_resp = await client.post(
        "/api/v1/stories",
        json={"title": "Progress Story Test", "content": "Sample content"},
        headers=headers,
    )
    return s_resp.json()["slug"]


@pytest.mark.anyio
async def test_reading_progress_flow(
    client: AsyncClient,
    user_headers: dict[str, str],
    created_story_slug: str,
) -> None:
    """Test saving reading progress, fetching history, and continue-reading list."""
    # 1. Post progress
    p_resp = await client.post(
        f"/api/v1/stories/{created_story_slug}/progress",
        json={"last_chapter": 2, "progress_percentage": 50.0, "completed": False},
        headers=user_headers,
    )
    assert p_resp.status_code == 200
    assert p_resp.json()["last_chapter"] == 2
    assert p_resp.json()["progress_percentage"] == 50.0

    # 2. Get reading history
    hist_resp = await client.get("/api/v1/users/me/reading-history", headers=user_headers)
    assert hist_resp.status_code == 200
    assert len(hist_resp.json()) >= 1

    # 3. Get continue reading
    cont_resp = await client.get("/api/v1/users/me/continue-reading", headers=user_headers)
    assert cont_resp.status_code == 200
    assert len(cont_resp.json()) >= 1
