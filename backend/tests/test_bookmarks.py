"""Cosmos Platform — Bookmark API Tests.

Tests for Bookmark creation, listing, duplicate prevention, and deletion.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "bm_user@cosmos.org",
            "username": "bm_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "bm_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_bookmark_crud_flow(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle for Bookmarks."""
    # 1. Create bookmark
    payload = {"resource_type": "Planet", "resource_id": "mars"}
    c_resp = await client.post("/api/v1/bookmarks", json=payload, headers=user_headers)
    assert c_resp.status_code == 201
    bm_id = c_resp.json()["id"]

    # 2. Duplicate bookmark returns 409 Conflict
    dup_resp = await client.post("/api/v1/bookmarks", json=payload, headers=user_headers)
    assert dup_resp.status_code == 409

    # 3. List bookmarks
    l_resp = await client.get("/api/v1/bookmarks", headers=user_headers)
    assert l_resp.status_code == 200
    assert any(b["id"] == bm_id for b in l_resp.json())

    # 4. Delete bookmark
    d_resp = await client.delete(f"/api/v1/bookmarks/{bm_id}", headers=user_headers)
    assert d_resp.status_code == 204
