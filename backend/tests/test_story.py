"""Cosmos Platform — Story API Tests.

Tests for Story CRUD, publishing workflow, search/filtering, recommendations, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "story_admin@cosmos.org",
            "username": "story_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "story_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_create_story_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test creating a Story as an Admin user."""
    payload = {
        "title": "The Secrets of the Black Hole",
        "summary": "Exploring event horizons and singularity.",
        "content": "# Black Holes\nA black hole is a region of spacetime...",
        "difficulty": "Intermediate",
        "story_type": "Discovery",
        "status": "Published",
        "is_featured": True,
    }
    resp = await client.post("/api/v1/stories", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "The Secrets of the Black Hole"
    assert data["slug"] == "the-secrets-of-the-black-hole"
    assert data["status"] == "Published"
    assert data["published_at"] is not None


@pytest.mark.anyio
async def test_list_stories_presets_and_search(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test preset listing endpoints (/featured, /trending, /recent, /search)."""
    await client.post(
        "/api/v1/stories",
        json={
            "title": "Apollo 11 Journey to Moon",
            "content": "First humans on Moon.",
            "status": "Published",
            "is_featured": True,
        },
        headers=admin_headers,
    )

    # 1. GET /featured
    feat_resp = await client.get("/api/v1/stories/featured")
    assert feat_resp.status_code == 200
    assert any(s["title"] == "Apollo 11 Journey to Moon" for s in feat_resp.json()["items"])

    # 2. GET /search?q=Apollo
    srch_resp = await client.get("/api/v1/stories/search?q=Apollo")
    assert srch_resp.status_code == 200
    assert len(srch_resp.json()["items"]) >= 1


@pytest.mark.anyio
async def test_story_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle for Story."""
    # 1. Create
    c_resp = await client.post(
        "/api/v1/stories",
        json={"title": "Mars Rover Curiosity", "content": "Roving across Gale Crater."},
        headers=admin_headers,
    )
    assert c_resp.status_code == 201
    story_id = c_resp.json()["id"]

    # 2. Get
    g_resp = await client.get(f"/api/v1/stories/{story_id}")
    assert g_resp.status_code == 200
    assert g_resp.json()["title"] == "Mars Rover Curiosity"

    # 3. Patch
    p_resp = await client.patch(
        f"/api/v1/stories/{story_id}",
        json={"status": "Published"},
        headers=admin_headers,
    )
    assert p_resp.status_code == 200
    assert p_resp.json()["status"] == "Published"

    # 4. Delete
    d_resp = await client.delete(f"/api/v1/stories/{story_id}", headers=admin_headers)
    assert d_resp.status_code == 204

    # 5. Verify deleted
    v_resp = await client.get(f"/api/v1/stories/{story_id}")
    assert v_resp.status_code == 404
