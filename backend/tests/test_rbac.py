"""Cosmos Platform — Role-Based Access Control (RBAC) Tests.

Tests for role permission dependencies on protected endpoints (Admin, Seller, Customer).
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_admin_dashboard_as_admin(client: AsyncClient) -> None:
    """Test that an Admin user can access the Admin dashboard."""
    reg_payload = {
        "email": "admin@cosmos.org",
        "username": "adminuser",
        "password": "ValidP@ssword123",
        "role_name": "Admin",
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201

    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "adminuser", "password": "ValidP@ssword123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dashboard_resp = await client.get("/api/v1/admin/dashboard", headers=headers)
    assert dashboard_resp.status_code == 200
    assert "Welcome" in dashboard_resp.json()["message"]


@pytest.mark.anyio
async def test_admin_dashboard_as_customer(client: AsyncClient) -> None:
    """Test that a Customer user is denied access (403 Forbidden) to Admin dashboard."""
    reg_payload = {
        "email": "cust@cosmos.org",
        "username": "custuser",
        "password": "ValidP@ssword123",
        "role_name": "Customer",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "custuser", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dashboard_resp = await client.get("/api/v1/admin/dashboard", headers=headers)
    assert dashboard_resp.status_code == 403
    assert "permission" in dashboard_resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_admin_list_users_privileges(client: AsyncClient) -> None:
    """Test listing all users as Admin vs Customer."""
    # Register Admin
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "sysadmin@cosmos.org",
            "username": "sysadmin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )

    # Register Customer
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "buyer@cosmos.org",
            "username": "buyer",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )

    # Login Admin
    admin_login = await client.post(
        "/api/v1/auth/login",
        json={"username": "sysadmin", "password": "ValidP@ssword123"},
    )
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    # Login Customer
    cust_login = await client.post(
        "/api/v1/auth/login",
        json={"username": "buyer", "password": "ValidP@ssword123"},
    )
    cust_headers = {"Authorization": f"Bearer {cust_login.json()['access_token']}"}

    # Admin access -> 200 OK
    admin_resp = await client.get("/api/v1/admin/users", headers=admin_headers)
    assert admin_resp.status_code == 200
    users_data = admin_resp.json()
    assert len(users_data) >= 2

    # Customer access -> 403 Forbidden
    cust_resp = await client.get("/api/v1/admin/users", headers=cust_headers)
    assert cust_resp.status_code == 403
