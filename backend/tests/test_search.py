"""Cosmos Platform — Search API Tests.

Tests for Universal Search across Planets, Moons, Missions, Agencies, Timeline Events, and Stories.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def seeded_entities(client: AsyncClient) -> dict[str, str]:
    """Seed test entities across modules for global search testing."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "srch_admin@cosmos.org",
            "username": "srch_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "srch_admin", "password": "ValidP@ssword123"},
    )
    headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    # Seed planet
    await client.post(
        "/api/v1/planets",
        json={"name": "Mars Red Planet", "type": "Terrestrial"},
        headers=headers,
    )
    # Seed story
    await client.post(
        "/api/v1/stories",
        json={"title": "Mars Rovers Discovery", "content": "Exploring Martian soil", "status": "Published"},
        headers=headers,
    )
    return headers


@pytest.mark.anyio
async def test_global_search(
    client: AsyncClient,
    seeded_entities: dict[str, str],
) -> None:
    """Test global cross-entity search endpoint."""
    resp = await client.get("/api/v1/search?q=Mars")
    assert resp.status_code == 200
    data = resp.json()
    assert data["query"] == "Mars"
    assert data["total_results"] >= 2
    assert "results" in data
    assert len(data["results"]["planets"]) >= 1
    assert len(data["results"]["stories"]) >= 1


@pytest.mark.anyio
async def test_module_specific_search(
    client: AsyncClient,
    seeded_entities: dict[str, str],
) -> None:
    """Test module-specific search routes."""
    # 1. Search planets
    p_resp = await client.get("/api/v1/search/planets?q=Mars")
    assert p_resp.status_code == 200
    assert len(p_resp.json()) >= 1
    assert p_resp.json()[0]["module"] == "planet"

    # 2. Search stories
    s_resp = await client.get("/api/v1/search/stories?q=Mars")
    assert s_resp.status_code == 200
    assert len(s_resp.json()) >= 1
    assert s_resp.json()[0]["module"] == "story"
