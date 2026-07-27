"""Cosmos Platform — Planet API Tests.

Tests for Planet CRUD operations, overview endpoint, search/filtering, pagination, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "planet_admin@cosmos.org",
            "username": "planet_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "planet_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_create_planet_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test creating a Planet as an Admin user."""
    payload = {
        "name": "Mars",
        "description": "The Red Planet",
        "diameter_km": 6779.0,
        "mass": "6.4171 × 10^23 kg",
        "gravity": 3.721,
        "escape_velocity": 5.027,
        "orbital_period": 686.98,
        "rotation_period": 24.62,
        "average_temperature": -63.0,
        "distance_from_sun": 227.9,
        "number_of_moons": 2,
        "atmosphere": "95.32% Carbon Dioxide",
        "color": "#C1440E",
        "is_habitable": False,
    }
    resp = await client.post("/api/v1/planets", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Mars"
    assert data["slug"] == "mars"
    assert data["diameter_km"] == 6779.0
    assert data["number_of_moons"] == 2


@pytest.mark.anyio
async def test_create_planet_duplicate_name_or_slug(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test that creating a planet with duplicate name/slug returns 409 Conflict."""
    payload = {"name": "Earth", "is_habitable": True}
    await client.post("/api/v1/planets", json=payload, headers=admin_headers)

    # Duplicate attempt
    dup_resp = await client.post("/api/v1/planets", json=payload, headers=admin_headers)
    assert dup_resp.status_code == 409
    assert "already exists" in dup_resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_list_planets_public_and_filters(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test public listing of planets with search, habitability, and moon filters."""
    # Seed planets
    await client.post(
        "/api/v1/planets",
        json={"name": "Venus", "is_habitable": False, "number_of_moons": 0, "distance_from_sun": 108.2},
        headers=admin_headers,
    )
    await client.post(
        "/api/v1/planets",
        json={"name": "Jupiter", "is_habitable": False, "number_of_moons": 95, "distance_from_sun": 778.5},
        headers=admin_headers,
    )

    # 1. Public list (no auth header)
    resp = await client.get("/api/v1/planets?page=1&limit=10")
    assert resp.status_code == 200
    assert "items" in resp.json()
    assert resp.json()["total"] >= 2

    # 2. Filter has_moons=true
    moons_resp = await client.get("/api/v1/planets?has_moons=true")
    assert moons_resp.status_code == 200
    for item in moons_resp.json()["items"]:
        assert item["number_of_moons"] > 0

    # 3. Filter search="Jupiter"
    search_resp = await client.get("/api/v1/planets?search=Jupiter")
    assert search_resp.status_code == 200
    assert len(search_resp.json()["items"]) == 1
    assert search_resp.json()["items"][0]["name"] == "Jupiter"


@pytest.mark.anyio
async def test_get_planet_by_slug(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test fetching a planet using its human-readable slug."""
    await client.post(
        "/api/v1/planets",
        json={"name": "Neptune", "distance_from_sun": 4495.1},
        headers=admin_headers,
    )

    # Get by slug
    resp = await client.get("/api/v1/planets/neptune")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Neptune"


@pytest.mark.anyio
async def test_planet_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle (Create, Get, Patch, Delete) for Planet."""
    # 1. Create
    create_resp = await client.post(
        "/api/v1/planets",
        json={"name": "Saturn", "color": "#E3E0CC"},
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    planet_id = create_resp.json()["id"]

    # 2. Get by ID
    get_resp = await client.get(f"/api/v1/planets/{planet_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Saturn"

    # 3. Patch
    patch_resp = await client.patch(
        f"/api/v1/planets/{planet_id}",
        json={"number_of_moons": 146},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["number_of_moons"] == 146

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/planets/{planet_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/planets/{planet_id}")
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_planet_overview(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test full aggregated planet overview endpoint (Planet + Moons + Facts)."""
    # 1. Create Planet
    p_resp = await client.post(
        "/api/v1/planets",
        json={"name": "Uranus", "distance_from_sun": 2871.0},
        headers=admin_headers,
    )
    planet_id = p_resp.json()["id"]

    # 2. Add Moon
    await client.post(
        "/api/v1/moons",
        json={"planet_id": planet_id, "name": "Titania", "diameter": 1577.8},
        headers=admin_headers,
    )

    # 3. Add Fact
    await client.post(
        "/api/v1/planet-facts",
        json={"planet_id": planet_id, "title": "Ice Giant", "description": "Uranus is an ice giant."},
        headers=admin_headers,
    )

    # 4. Get Overview
    overview_resp = await client.get(f"/api/v1/planets/{planet_id}/overview")
    assert overview_resp.status_code == 200
    data = overview_resp.json()
    assert data["planet"]["name"] == "Uranus"
    assert len(data["moons"]) == 1
    assert data["moons"][0]["name"] == "Titania"
    assert len(data["facts"]) == 1
    assert data["facts"][0]["title"] == "Ice Giant"


@pytest.mark.anyio
async def test_planet_rbac_permissions(client: AsyncClient) -> None:
    """Test RBAC restrictions on write operations for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_planet@cosmos.org",
            "username": "cust_planet",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_planet", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    # Customer attempt to create -> 403 Forbidden
    create_resp = await client.post(
        "/api/v1/planets",
        json={"name": "Forbidden Planet"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403
