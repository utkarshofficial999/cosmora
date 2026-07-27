"""Cosmos Platform — Admin Broadcast API Tests.

Tests for Admin system broadcast announcements and RBAC protection.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "bc_admin@cosmos.org",
            "username": "bc_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "bc_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def customer_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "bc_cust@cosmos.org",
            "username": "bc_cust",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "bc_cust", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_admin_broadcast_announcement(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test broadcasting system announcements as Admin."""
    payload = {
        "title": "Cosmora System Maintenance Alert",
        "message": "Scheduled server upgrade tonight at 02:00 UTC.",
        "notification_type": "System Notification",
        "priority": "high",
    }
    resp = await client.post("/api/v1/admin/notifications/broadcast", json=payload, headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "Dispatched"
    assert data["delivered_count"] >= 1


@pytest.mark.anyio
async def test_broadcast_rbac_permissions(
    client: AsyncClient,
    customer_headers: dict[str, str],
) -> None:
    """Test Customer receiving 403 Forbidden when attempting broadcast."""
    payload = {"title": "Unauthorized Alert", "message": "Test"}
    resp = await client.post("/api/v1/admin/notifications/broadcast", json=payload, headers=customer_headers)
    assert resp.status_code == 403
