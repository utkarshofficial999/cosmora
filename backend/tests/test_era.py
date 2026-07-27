"""Cosmos Platform — Era API Tests.

Tests for Era CRUD operations, duplicate validation, pagination, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_create_era_as_admin(client: AsyncClient) -> None:
    """Test creating an Era as an Admin user."""
    # 1. Register Admin
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin_era@cosmos.org",
            "username": "admin_era",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    # 2. Login
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin_era", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create Era
    era_payload = {
        "name": "Space Race Era",
        "description": "Period of space exploration competition",
        "start_year": 1955,
        "end_year": 1975,
        "color": "#FF5733",
    }
    resp = await client.post("/api/v1/eras", json=era_payload, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Space Race Era"
    assert data["slug"] == "space-race-era"
    assert data["start_year"] == 1955
    assert "id" in data


@pytest.mark.anyio
async def test_create_era_duplicate_name_or_slug(client: AsyncClient) -> None:
    """Test that creating an Era with a duplicate name or slug returns 409 Conflict."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin_dup@cosmos.org",
            "username": "admin_dup",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin_dup", "password": "ValidP@ssword123"},
    )
    headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    era_payload = {"name": "Big Bang", "start_year": -13800000000}
    await client.post("/api/v1/eras", json=era_payload, headers=headers)

    # Second attempt with same name -> 409 Conflict
    dup_resp = await client.post("/api/v1/eras", json=era_payload, headers=headers)
    assert dup_resp.status_code == 409
    assert "already exists" in dup_resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_list_eras_and_pagination(client: AsyncClient) -> None:
    """Test listing Eras with pagination and authentication."""
    # Register & Login Customer
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "reader_era@cosmos.org",
            "username": "reader_era",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "reader_era", "password": "ValidP@ssword123"},
    )
    headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    # List Eras
    resp = await client.get("/api/v1/eras?page=1&limit=5", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "page" in data
    assert "limit" in data
    assert "total" in data
    assert "pages" in data


@pytest.mark.anyio
async def test_era_crud_flow_as_admin(client: AsyncClient) -> None:
    """Test full CRUD lifecycle for Era as Admin."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "crud_era@cosmos.org",
            "username": "crud_era",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "crud_era", "password": "ValidP@ssword123"},
    )
    headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    # 1. Create
    create_resp = await client.post(
        "/api/v1/eras",
        json={"name": "Apollo Era", "start_year": 1961, "end_year": 1972},
        headers=headers,
    )
    assert create_resp.status_code == 201
    era_id = create_resp.json()["id"]

    # 2. Get by ID
    get_resp = await client.get(f"/api/v1/eras/{era_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Apollo Era"

    # 3. Update
    patch_resp = await client.patch(
        f"/api/v1/eras/{era_id}",
        json={"name": "Apollo Project Era", "color": "#00FF00"},
        headers=headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["name"] == "Apollo Project Era"
    assert patch_resp.json()["color"] == "#00FF00"

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/eras/{era_id}", headers=headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/eras/{era_id}", headers=headers)
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_era_rbac_permissions(client: AsyncClient) -> None:
    """Test RBAC restrictions for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_era@cosmos.org",
            "username": "cust_era",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_era", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    # Customer attempt to create -> 403 Forbidden
    create_resp = await client.post(
        "/api/v1/eras",
        json={"name": "Forbidden Era"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403

    # Anonymous attempt to list -> 401 Unauthorized
    anon_resp = await client.get("/api/v1/eras")
    assert anon_resp.status_code == 401
