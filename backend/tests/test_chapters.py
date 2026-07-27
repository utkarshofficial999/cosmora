"""Cosmos Platform — Chapter API Tests.

Tests for StoryChapter CRUD operations and ordering.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "ch_admin@cosmos.org",
            "username": "ch_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "ch_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_story_id(client: AsyncClient, admin_headers: dict[str, str]) -> str:
    """Fixture creating a Story and returning its UUID string."""
    s_resp = await client.post(
        "/api/v1/stories",
        json={"title": "Multi-Chapter Cosmos Story", "content": "Intro"},
        headers=admin_headers,
    )
    return s_resp.json()["id"]


@pytest.mark.anyio
async def test_chapter_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_story_id: str,
) -> None:
    """Test full CRUD lifecycle for StoryChapter."""
    # 1. Create
    c_resp = await client.post(
        f"/api/v1/stories/{created_story_id}/chapters",
        json={"title": "Chapter 1: Dawn of Space Flight", "chapter_number": 1, "content": "Body text 1"},
        headers=admin_headers,
    )
    assert c_resp.status_code == 201
    chapter_id = c_resp.json()["id"]

    # 2. Get list
    l_resp = await client.get(f"/api/v1/stories/{created_story_id}/chapters")
    assert l_resp.status_code == 200
    assert len(l_resp.json()) == 1

    # 3. Patch
    p_resp = await client.patch(
        f"/api/v1/chapters/{chapter_id}",
        json={"title": "Chapter 1: Modified Dawn"},
        headers=admin_headers,
    )
    assert p_resp.status_code == 200
    assert p_resp.json()["title"] == "Chapter 1: Modified Dawn"

    # 4. Delete
    d_resp = await client.delete(f"/api/v1/chapters/{chapter_id}", headers=admin_headers)
    assert d_resp.status_code == 204
