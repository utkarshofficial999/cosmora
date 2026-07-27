"""Cosmos Platform — Agency API Tests.

Tests for SpaceAgency CRUD operations, search/filtering, pagination, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "agency_admin@cosmos.org",
            "username": "agency_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "agency_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_create_agency_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test creating a SpaceAgency as an Admin user."""
    payload = {
        "name": "ISRO",
        "country": "India",
        "description": "Indian Space Research Organisation",
        "founded_year": 1969,
        "website": "https://www.isro.gov.in",
        "headquarters": "Bengaluru, Karnataka, India",
    }
    resp = await client.post("/api/v1/agencies", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "ISRO"
    assert data["slug"] == "isro"
    assert data["country"] == "India"


@pytest.mark.anyio
async def test_create_agency_duplicate(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test that creating an agency with a duplicate name/slug returns 409 Conflict."""
    payload = {"name": "NASA", "country": "United States"}
    await client.post("/api/v1/agencies", json=payload, headers=admin_headers)

    dup_resp = await client.post("/api/v1/agencies", json=payload, headers=admin_headers)
    assert dup_resp.status_code == 409
    assert "already exists" in dup_resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_list_agencies_public_and_search(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test public listing of agencies with search and country filters."""
    await client.post(
        "/api/v1/agencies",
        json={"name": "ESA", "country": "Europe", "founded_year": 1975},
        headers=admin_headers,
    )
    await client.post(
        "/api/v1/agencies",
        json={"name": "JAXA", "country": "Japan", "founded_year": 2003},
        headers=admin_headers,
    )

    # 1. Public list (no auth header required)
    resp = await client.get("/api/v1/agencies?page=1&limit=10")
    assert resp.status_code == 200
    assert "items" in resp.json()
    assert resp.json()["total"] >= 2

    # 2. Filter search="Japan"
    search_resp = await client.get("/api/v1/agencies?search=Japan")
    assert search_resp.status_code == 200
    assert len(search_resp.json()["items"]) == 1
    assert search_resp.json()["items"][0]["name"] == "JAXA"


@pytest.mark.anyio
async def test_agency_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle for SpaceAgency."""
    # 1. Create
    create_resp = await client.post(
        "/api/v1/agencies",
        json={"name": "SpaceX", "country": "USA", "founded_year": 2002},
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    agency_id = create_resp.json()["id"]

    # 2. Get by ID / slug
    get_resp = await client.get(f"/api/v1/agencies/{agency_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "SpaceX"

    slug_resp = await client.get("/api/v1/agencies/spacex")
    assert slug_resp.status_code == 200
    assert slug_resp.json()["id"] == agency_id

    # 3. Patch
    patch_resp = await client.patch(
        f"/api/v1/agencies/{agency_id}",
        json={"headquarters": "Hawthorne, California"},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["headquarters"] == "Hawthorne, California"

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/agencies/{agency_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/agencies/{agency_id}")
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_agency_rbac_permissions(client: AsyncClient) -> None:
    """Test RBAC restrictions on write operations for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_agency@cosmos.org",
            "username": "cust_agency",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_agency", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    create_resp = await client.post(
        "/api/v1/agencies",
        json={"name": "Forbidden Agency"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403
