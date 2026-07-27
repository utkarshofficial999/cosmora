"""Cosmos Platform — Collection API Tests.

Tests for Collection CRUD operations, adding/removing items, and public/private access.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "col_user@cosmos.org",
            "username": "col_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "col_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_collection_crud_flow(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle for Collection and CollectionItem."""
    # 1. Create collection with initial item
    c_payload = {
        "title": "Favorite Mars Missions",
        "description": "Curated collection of Mars exploration",
        "is_public": True,
        "items": [{"resource_type": "Mission", "resource_id": "mangalyaan-mom", "display_order": 1}],
    }
    c_resp = await client.post("/api/v1/collections", json=c_payload, headers=user_headers)
    assert c_resp.status_code == 201
    col_id = c_resp.json()["id"]
    assert len(c_resp.json()["items"]) == 1

    # 2. Get collection
    g_resp = await client.get(f"/api/v1/collections/{col_id}")
    assert g_resp.status_code == 200
    assert g_resp.json()["title"] == "Favorite Mars Missions"

    # 3. Add item
    item_payload = {"resource_type": "Planet", "resource_id": "mars", "display_order": 2}
    add_resp = await client.post(f"/api/v1/collections/{col_id}/items", json=item_payload, headers=user_headers)
    assert add_resp.status_code == 201
    item_id = add_resp.json()["id"]

    # 4. Remove item
    rem_resp = await client.delete(f"/api/v1/collections/{col_id}/items/{item_id}", headers=user_headers)
    assert rem_resp.status_code == 204

    # 5. Delete collection
    del_resp = await client.delete(f"/api/v1/collections/{col_id}", headers=user_headers)
    assert del_resp.status_code == 204
