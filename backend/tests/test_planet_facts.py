"""Cosmos Platform — PlanetFact API Tests.

Tests for PlanetFact CRUD operations, display ordering, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "fact_admin@cosmos.org",
            "username": "fact_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "fact_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_planet_id(client: AsyncClient, admin_headers: dict[str, str]) -> str:
    """Fixture creating a Planet and returning its UUID string."""
    p_resp = await client.post(
        "/api/v1/planets",
        json={"name": "Venus", "distance_from_sun": 108.2},
        headers=admin_headers,
    )
    return p_resp.json()["id"]


@pytest.mark.anyio
async def test_create_planet_fact_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_planet_id: str,
) -> None:
    """Test creating a PlanetFact linked to a planet."""
    payload = {
        "planet_id": created_planet_id,
        "title": "Hottest Planet",
        "description": "Venus is the hottest planet in our solar system due to a runaway greenhouse effect.",
        "display_order": 1,
    }
    resp = await client.post("/api/v1/planet-facts", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Hottest Planet"
    assert data["display_order"] == 1
    assert data["planet_id"] == created_planet_id


@pytest.mark.anyio
async def test_create_fact_nonexistent_planet(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test creating a fact for a non-existent planet returns 404 Not Found."""
    payload = {
        "planet_id": "00000000-0000-0000-0000-000000000000",
        "title": "Phantom Fact",
        "description": "Description",
    }
    resp = await client.post("/api/v1/planet-facts", json=payload, headers=admin_headers)
    assert resp.status_code == 404


@pytest.mark.anyio
async def test_planet_fact_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_planet_id: str,
) -> None:
    """Test full CRUD lifecycle for PlanetFact."""
    # 1. Create
    create_resp = await client.post(
        "/api/v1/planet-facts",
        json={
            "planet_id": created_planet_id,
            "title": "Spin Direction",
            "description": "Venus spins backwards compared to most other planets.",
            "display_order": 2,
        },
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    fact_id = create_resp.json()["id"]

    # 2. Get by ID
    get_resp = await client.get(f"/api/v1/planet-facts/{fact_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Spin Direction"

    # 3. Patch
    patch_resp = await client.patch(
        f"/api/v1/planet-facts/{fact_id}",
        json={"display_order": 10},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["display_order"] == 10

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/planet-facts/{fact_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/planet-facts/{fact_id}")
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_planet_fact_rbac_permissions(client: AsyncClient) -> None:
    """Test RBAC restrictions on write operations for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_fact@cosmos.org",
            "username": "cust_fact",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_fact", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    create_resp = await client.post(
        "/api/v1/planet-facts",
        json={"planet_id": "00000000-0000-0000-0000-000000000000", "title": "Forbidden Fact", "description": "Text"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403
