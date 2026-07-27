"""Cosmos Platform — Milestone API Tests.

Tests for MissionMilestone CRUD operations, sorting, and RBAC permissions.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "ms_admin@cosmos.org",
            "username": "ms_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "ms_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def created_mission_id(client: AsyncClient, admin_headers: dict[str, str]) -> str:
    """Fixture creating an Agency and Mission, returning mission UUID string."""
    a_resp = await client.post(
        "/api/v1/agencies",
        json={"name": "Milestone Test Agency"},
        headers=admin_headers,
    )
    agency_id = a_resp.json()["id"]

    m_resp = await client.post(
        "/api/v1/missions",
        json={"agency_id": agency_id, "name": "Gaganyaan", "mission_type": "Human Spaceflight"},
        headers=admin_headers,
    )
    return m_resp.json()["id"]


@pytest.mark.anyio
async def test_create_milestone_as_admin(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_mission_id: str,
) -> None:
    """Test creating a MissionMilestone linked to a mission."""
    payload = {
        "title": "Uncrewed Test Flight TV-D1",
        "description": "First crew abort demonstration flight.",
        "status": "Achieved",
        "display_order": 1,
    }
    resp = await client.post(
        f"/api/v1/missions/{created_mission_id}/milestones",
        json=payload,
        headers=admin_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Uncrewed Test Flight TV-D1"
    assert data["mission_id"] == created_mission_id
    assert data["display_order"] == 1


@pytest.mark.anyio
async def test_milestone_crud_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
    created_mission_id: str,
) -> None:
    """Test full CRUD lifecycle for MissionMilestone."""
    # 1. Create
    create_resp = await client.post(
        f"/api/v1/missions/{created_mission_id}/milestones",
        json={"title": "Orbital Insertion", "display_order": 2},
        headers=admin_headers,
    )
    assert create_resp.status_code == 201
    ms_id = create_resp.json()["id"]

    # 2. Get list
    list_resp = await client.get(f"/api/v1/missions/{created_mission_id}/milestones")
    assert list_resp.status_code == 200
    assert any(m["id"] == ms_id for m in list_resp.json())

    # 3. Patch
    patch_resp = await client.patch(
        f"/api/v1/milestones/{ms_id}",
        json={"status": "Completed"},
        headers=admin_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "Completed"

    # 4. Delete
    del_resp = await client.delete(f"/api/v1/milestones/{ms_id}", headers=admin_headers)
    assert del_resp.status_code == 204

    # 5. Verify deleted
    list_after = await client.get(f"/api/v1/missions/{created_mission_id}/milestones")
    assert not any(m["id"] == ms_id for m in list_after.json())


@pytest.mark.anyio
async def test_milestone_rbac_permissions(
    client: AsyncClient,
    created_mission_id: str,
) -> None:
    """Test RBAC restrictions on write operations for non-Admin users."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cust_ms@cosmos.org",
            "username": "cust_ms",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cust_ms", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    create_resp = await client.post(
        f"/api/v1/missions/{created_mission_id}/milestones",
        json={"title": "Forbidden Milestone"},
        headers=cust_headers,
    )
    assert create_resp.status_code == 403
