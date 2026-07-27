"""Cosmos Platform — Moderation API Tests.

Tests for story, mission, and timeline event moderation workflows.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "mod_admin@cosmos.org",
            "username": "mod_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "mod_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_story_moderation(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test publishing and archiving a story via moderation endpoints."""
    # 1. Create story
    story_resp = await client.post(
        "/api/v1/stories",
        json={"title": "Moderation Story Test", "content": "Body text"},
        headers=admin_headers,
    )
    story_id = story_resp.json()["id"]

    # 2. Publish story
    pub_resp = await client.patch(f"/api/v1/admin/stories/{story_id}/publish", headers=admin_headers)
    assert pub_resp.status_code == 200
    assert pub_resp.json()["new_status"] == "Published"

    # 3. Archive story
    arc_resp = await client.patch(f"/api/v1/admin/stories/{story_id}/archive", headers=admin_headers)
    assert arc_resp.status_code == 200
    assert arc_resp.json()["new_status"] == "Archived"
