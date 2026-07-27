"""Cosmos Platform — Mission API Tests.

Tests for Mission CRUD operations, preset filters, dashboard endpoints, search, and RBAC permissions.
"""

from datetime import datetime, timedelta, timezone
import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "mission_admin@cosmos.org",
            "username": "mission_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "mission_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_agency_id(client: AsyncClient, admin_headers: dict[str, str]) -> str:
    """Fixture creating a SpaceAgency and returning its UUID string."""
    a_resp = await client.post(
        "/api/v1/agencies",
        json={"name": "ISRO Mission Test", "country": "India"},
        headers=admin_headers,
    )
    return a_resp.json()["id"]


@pytest.mark.anyio
async def test_create_mission_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_agency_id: str,
) -> None:
    """Test creating a Mission linked to an agency as Admin."""
    future_date = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
    payload = {
        "agency_id": created_agency_id,
        "name": "Chandrayaan-3",
        "mission_type": "Lunar",
        "description": "Third Indian lunar exploration mission",
        "destination": "Moon",
        "spacecraft": "Vikram Lander & Pragyan Rover",
        "rocket": "LVM3-M4",
        "launch_site": "SDSC SHAR, Sriharikota",
        "launch_date": future_date,
        "status": "Upcoming",
        "is_featured": True,
    }
    resp = await client.post("/api/v1/missions", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Chandrayaan-3"
    assert data["slug"] == "chandrayaan-3"
    assert data["agency_id"] == created_agency_id
    assert data["status"] == "Upcoming"


@pytest.mark.anyio
async def test_create_mission_duplicate_name_or_slug(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_agency_id: str,
) -> None:
    """Test that creating a mission with duplicate name/slug returns 409 Conflict."""
    payload = {
        "agency_id": created_agency_id,
        "name": "Artemis II",
        "mission_type": "Human Spaceflight",
    }
    await client.post("/api/v1/missions", json=payload, headers=admin_headers)

    dup_resp = await client.post("/api/v1/missions", json=payload, headers=admin_headers)
    assert dup_resp.status_code == 409
    assert "already exists" in dup_resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_preset_mission_endpoints(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_agency_id: str,
) -> None:
    """Test preset mission listing endpoints (/upcoming, /live, /completed, /failed, /featured)."""
    # Seed live mission
    await client.post(
        "/api/v1/missions",
        json={
            "agency_id": created_agency_id,
            "name": "ISS Expedition 71",
            "mission_type": "Space Station",
            "status": "Live",
        },
        headers=admin_headers,
    )
    # Seed completed mission
    await client.post(
        "/api/v1/missions",
        json={
            "agency_id": created_agency_id,
            "name": "Apollo 11",
            "mission_type": "Human Spaceflight",
            "status": "Successful",
            "is_featured": True,
        },
        headers=admin_headers,
    )

    # 1. GET /missions/live
    live_resp = await client.get("/api/v1/missions/live")
    assert live_resp.status_code == 200
    assert any(m["name"] == "ISS Expedition 71" for m in live_resp.json()["items"])

    # 2. GET /missions/completed
    comp_resp = await client.get("/api/v1/missions/completed")
    assert comp_resp.status_code == 200
    assert any(m["name"] == "Apollo 11" for m in comp_resp.json()["items"])

    # 3. GET /missions/featured
    feat_resp = await client.get("/api/v1/missions/featured")
    assert feat_resp.status_code == 200
    assert any(m["name"] == "Apollo 11" for m in feat_resp.json()["items"])


@pytest.mark.anyio
async def test_dashboard_latest_missions(
    client: AsyncClient,
) -> None:
    """Test dashboard latest-missions aggregation endpoint."""
    resp = await client.get("/api/v1/dashboard/latest-missions")
    assert resp.status_code == 200
    data = resp.json()
    assert "live_missions" in data
    assert "upcoming_missions" in data
    assert "recent_completed_missions" in data
    assert "featured_missions" in data


@pytest.mark.anyio
async def test_mission_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_agency_id: str,
) -> None:
    """Test full CRUD lifecycle for Mission."""
    # 1. Create
    create_resp = await client.post(
        "/api/v1/missions",
        json={
            "agency_id": created_agency_id,
            "name": "Mangalyaan (MOM)",
            "mission_type": "Mars",
            "destination": "Mars",
        },
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    mission_id = create_resp.json()["id"]

    # 2. Get by ID / slug
    get_resp = await client.get(f"/api/v1/missions/{mission_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Mangalyaan (MOM)"

    slug_resp = await client.get("/api/v1/missions/mangalyaan-mom")
    assert slug_resp.status_code == 200
    assert slug_resp.json()["id"] == mission_id

    # 3. Patch
    patch_resp = await client.patch(
        f"/api/v1/missions/{mission_id}",
        json={"status": "Successful"},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "Successful"

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/missions/{mission_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    get_deleted = await client.get(f"/api/v1/missions/{mission_id}")
    assert get_deleted.status_code == 404


@pytest.mark.anyio
async def test_mission_rbac_permissions(client: AsyncClient) -> None:
    """Test RBAC restrictions on write operations for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_mission@cosmos.org",
            "username": "cust_mission",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_mission", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    create_resp = await client.post(
        "/api/v1/missions",
        json={"agency_id": "00000000-0000-0000-0000-000000000000", "name": "Forbidden Mission", "mission_type": "Lunar"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403
