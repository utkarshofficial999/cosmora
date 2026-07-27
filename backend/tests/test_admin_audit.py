"""Cosmos Platform — Admin Audit Log API Tests.

Tests for recording and retrieving administrative audit trail entries.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "adt_admin@cosmos.org",
            "username": "adt_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "adt_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_audit_log_lifecycle(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test listing and viewing admin audit log entries."""
    # 1. Trigger an admin action (e.g. publish story) to log audit event
    story_resp = await client.post(
        "/api/v1/stories",
        json={"title": "Audit Test Story", "content": "Sample body"},
        headers=admin_headers,
    )
    story_id = story_resp.json()["id"]
    await client.patch(f"/api/v1/admin/stories/{story_id}/publish", headers=admin_headers)

    # 2. Query audit trail
    audit_resp = await client.get("/api/v1/admin/audit", headers=admin_headers)
    assert audit_resp.status_code == 200
    data = audit_resp.json()
    assert data["total"] >= 1
    assert any(log["action"] == "PUBLISHED" for log in data["items"])
