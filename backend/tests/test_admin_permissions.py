"""Cosmos Platform — Admin Permissions Security Tests.

Tests ensuring RBAC protection blocks non-Admin users from CMS endpoints.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def customer_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular Customer user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "perm_cust@cosmos.org",
            "username": "perm_cust",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "perm_cust", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_customer_blocked_from_cms(
    client: AsyncClient,
    customer_headers: dict[str, str],
) -> None:
    """Test Customer user receiving 403 Forbidden when attempting to access CMS endpoints."""
    # 1. Dashboard access
    d_resp = await client.get("/api/v1/admin/dashboard", headers=customer_headers)
    assert d_resp.status_code == 403

    # 2. Audit logs access
    a_resp = await client.get("/api/v1/admin/audit", headers=customer_headers)
    assert a_resp.status_code == 403

    # 3. Bulk action access
    b_resp = await client.post(
        "/api/v1/admin/bulk/publish",
        json={"resource_type": "Story", "resource_ids": ["dummy"]},
        headers=customer_headers,
    )
    assert b_resp.status_code == 403
