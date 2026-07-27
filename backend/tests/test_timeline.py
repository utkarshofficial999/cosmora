"""Cosmos Platform — Timeline API Tests.

Tests for TimelineEvent CRUD operations, media attachments, search/filtering, pagination, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "timeline_admin@cosmos.org",
            "username": "timeline_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "timeline_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def customer_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a Customer user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "timeline_cust@cosmos.org",
            "username": "timeline_cust",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "timeline_cust", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_era_id(client: AsyncClient, admin_headers: dict[str, str]) -> str:
    """Fixture creating an Era and returning its UUID string."""
    era_resp = await client.post(
        "/api/v1/eras",
        json={"name": "Apollo Era", "start_year": 1960, "end_year": 1975},
        headers=admin_headers,
    )
    return era_resp.json()["id"]


@pytest.mark.anyio
async def test_create_timeline_event_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_era_id: str,
) -> None:
    """Test creating a TimelineEvent with attached media as Admin."""
    payload = {
        "title": "Apollo 11 Landing",
        "short_description": "First human moon landing",
        "content": "Neil Armstrong and Buzz Aldrin landed the Lunar Module Eagle on the Moon on July 20, 1969.",
        "event_date": "July 20, 1969",
        "year": 1969,
        "importance": 5,
        "image_url": "https://assets.cosmora.org/apollo11.jpg",
        "era_id": created_era_id,
        "is_featured": True,
        "media": [
            {
                "media_type": "image",
                "url": "https://assets.cosmora.org/buzz_aldrin.jpg",
                "caption": "Buzz Aldrin on the lunar surface",
            }
        ],
    }
    resp = await client.post("/api/v1/timeline", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Apollo 11 Landing"
    assert data["slug"] == "apollo-11-landing"
    assert data["year"] == 1969
    assert data["importance"] == 5
    assert data["is_featured"] is True
    assert len(data["media"]) == 1
    assert data["media"][0]["caption"] == "Buzz Aldrin on the lunar surface"


@pytest.mark.anyio
async def test_create_event_invalid_era(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test that creating a timeline event with a non-existent era returns 400 Bad Request."""
    payload = {
        "title": "Fake Event",
        "content": "Content",
        "year": 2000,
        "era_id": "00000000-0000-0000-0000-000000000000",
    }
    resp = await client.post("/api/v1/timeline", json=payload, headers=admin_headers)
    assert resp.status_code == 400
    assert "era" in resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_create_event_invalid_importance(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_era_id: str,
) -> None:
    """Test that importance out of 1-5 range returns 422 Unprocessable Entity."""
    payload = {
        "title": "Bad Importance Event",
        "content": "Content",
        "year": 2000,
        "importance": 10,
        "era_id": created_era_id,
    }
    resp = await client.post("/api/v1/timeline", json=payload, headers=admin_headers)
    assert resp.status_code == 422


@pytest.mark.anyio
async def test_timeline_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_era_id: str,
) -> None:
    """Test full CRUD lifecycle (Create, Get, Patch, Delete) for TimelineEvent."""
    # 1. Create
    create_resp = await client.post(
        "/api/v1/timeline",
        json={
            "title": "Sputnik 1 Launch",
            "content": "First artificial satellite launched into space.",
            "year": 1957,
            "era_id": created_era_id,
        },
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    event_id = create_resp.json()["id"]

    # 2. Get by ID
    get_resp = await client.get(f"/api/v1/timeline/{event_id}", headers=admin_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Sputnik 1 Launch"

    # 3. Patch Update
    patch_resp = await client.patch(
        f"/api/v1/timeline/{event_id}",
        json={"title": "Sputnik 1 Satellite Launch", "is_featured": True},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["title"] == "Sputnik 1 Satellite Launch"
    assert patch_resp.json()["is_featured"] is True

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/timeline/{event_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/timeline/{event_id}", headers=admin_headers)
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_timeline_search_filtering_pagination(
    client: AsyncClient,
    admin_headers: dict[str, str],
    customer_headers: dict[str, str],
    created_era_id: str,
) -> None:
    """Test searching, filtering by year/era/featured, and pagination."""
    # Seed events
    await client.post(
        "/api/v1/timeline",
        json={
            "title": "Voyager 1 Launch",
            "content": "Deep space probe launched to explore outer solar system.",
            "year": 1977,
            "importance": 4,
            "era_id": created_era_id,
            "is_featured": True,
        },
        headers=admin_headers,
    )
    await client.post(
        "/api/v1/timeline",
        json={
            "title": "Hubble Space Telescope",
            "content": "Optical telescope launched into low Earth orbit.",
            "year": 1990,
            "importance": 4,
            "era_id": created_era_id,
            "is_featured": False,
        },
        headers=admin_headers,
    )

    # 1. Search by title "Voyager"
    search_resp = await client.get("/api/v1/timeline?search=Voyager", headers=customer_headers)
    assert search_resp.status_code == 200
    assert search_resp.json()["total"] == 1
    assert search_resp.json()["items"][0]["title"] == "Voyager 1 Launch"

    # 2. Filter featured=true
    feat_resp = await client.get("/api/v1/timeline?featured=true", headers=customer_headers)
    assert feat_resp.status_code == 200
    for item in feat_resp.json()["items"]:
        assert item["is_featured"] is True

    # 3. Filter by year=1990
    year_resp = await client.get("/api/v1/timeline?year=1990", headers=customer_headers)
    assert year_resp.status_code == 200
    assert len(year_resp.json()["items"]) == 1
    assert year_resp.json()["items"][0]["title"] == "Hubble Space Telescope"


@pytest.mark.anyio
async def test_timeline_rbac_permissions(
    client: AsyncClient,
    customer_headers: dict[str, str],
    created_era_id: str,
) -> None:
    """Test that non-Admin users get 403 on write endpoints and 401 on unauthenticated requests."""
    # Customer POST -> 403 Forbidden
    post_resp = await client.post(
        "/api/v1/timeline",
        json={"title": "Forbidden", "content": "Content", "year": 2020, "era_id": created_era_id},
        headers=customer_headers,
    )
    assert post_resp.status_code == 403

    # Anonymous GET -> 401 Unauthorized
    anon_resp = await client.get("/api/v1/timeline")
    assert anon_resp.status_code == 401
