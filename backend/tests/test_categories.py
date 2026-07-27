"""Cosmos Platform — Category API Tests.

Tests for StoryCategory CRUD operations.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cat_admin@cosmos.org",
            "username": "cat_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cat_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_category_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle for StoryCategory."""
    # 1. Create
    c_resp = await client.post(
        "/api/v1/story-categories",
        json={"name": "Astronomy Discoveries", "description": "Latest deep space findings"},
        headers=admin_headers,
    )
    assert c_resp.status_code == 201
    cat_id = c_resp.json()["id"]

    # 2. List
    l_resp = await client.get("/api/v1/story-categories")
    assert l_resp.status_code == 200
    assert any(c["id"] == cat_id for c in l_resp.json())

    # 3. Patch
    p_resp = await client.patch(
        f"/api/v1/story-categories/{cat_id}",
        json={"icon": "star"},
        headers=admin_headers,
    )
    assert p_resp.status_code == 200
    assert p_resp.json()["icon"] == "star"

    # 4. Delete
    d_resp = await client.delete(f"/api/v1/story-categories/{cat_id}", headers=admin_headers)
    assert d_resp.status_code == 204
