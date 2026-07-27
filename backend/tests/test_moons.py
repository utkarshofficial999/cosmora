"""Cosmos Platform — Moon API Tests.

Tests for Moon CRUD operations, planet relationships, pagination, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "moon_admin@cosmos.org",
            "username": "moon_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "moon_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_planet_id(client: AsyncClient, admin_headers: dict[str, str]) -> str:
    """Fixture creating a Planet and returning its UUID string."""
    p_resp = await client.post(
        "/api/v1/planets",
        json={"name": "Jupiter", "distance_from_sun": 778.5},
        headers=admin_headers,
    )
    return p_resp.json()["id"]


@pytest.mark.anyio
async def test_create_moon_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_planet_id: str,
) -> None:
    """Test creating a Moon linked to a planet."""
    payload = {
        "planet_id": created_planet_id,
        "name": "Ganymede",
        "diameter": 5268.2,
        "orbital_period": 7.15,
        "description": "Largest moon in the Solar System.",
    }
    resp = await client.post("/api/v1/moons", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Ganymede"
    assert data["slug"] == "ganymede"
    assert data["planet_id"] == created_planet_id


@pytest.mark.anyio
async def test_create_moon_nonexistent_planet(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test creating a moon for a non-existent planet returns 404 Not Found."""
    payload = {
        "planet_id": "00000000-0000-0000-0000-000000000000",
        "name": "Phantom Moon",
    }
    resp = await client.post("/api/v1/moons", json=payload, headers=admin_headers)
    assert resp.status_code == 404


@pytest.mark.anyio
async def test_moon_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_planet_id: str,
) -> None:
    """Test full CRUD lifecycle for Moon."""
    # 1. Create
    create_resp = await client.post(
        "/api/v1/moons",
        json={"planet_id": created_planet_id, "name": "Callisto", "diameter": 4820.6},
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    moon_id = create_resp.json()["id"]

    # 2. Get by ID
    get_resp = await client.get(f"/api/v1/moons/{moon_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Callisto"

    # 3. Patch
    patch_resp = await client.patch(
        f"/api/v1/moons/{moon_id}",
        json={"description": "Heavily cratered moon."},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["description"] == "Heavily cratered moon."

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/moons/{moon_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/moons/{moon_id}")
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_moon_rbac_permissions(client: AsyncClient) -> None:
    """Test RBAC restrictions on write operations for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_moon@cosmos.org",
            "username": "cust_moon",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_moon", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    create_resp = await client.post(
        "/api/v1/moons",
        json={"planet_id": "00000000-0000-0000-0000-000000000000", "name": "Forbidden Moon"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403
