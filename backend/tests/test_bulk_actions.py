"""Cosmos Platform — Bulk Content Actions API Tests.

Tests for bulk publishing, archiving, deleting, and restoring platform content.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "blk_admin@cosmos.org",
            "username": "blk_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "blk_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_bulk_publish_and_archive(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test bulk publish and archive endpoints."""
    # 1. Create 2 test stories
    s1 = await client.post("/api/v1/stories", json={"title": "Bulk Story 1", "content": "Body 1"}, headers=admin_headers)
    s2 = await client.post("/api/v1/stories", json={"title": "Bulk Story 2", "content": "Body 2"}, headers=admin_headers)
    id1 = s1.json()["id"]
    id2 = s2.json()["id"]

    # 2. Bulk publish
    pub_payload = {"resource_type": "Story", "resource_ids": [id1, id2]}
    pub_resp = await client.post("/api/v1/admin/bulk/publish", json=pub_payload, headers=admin_headers)
    assert pub_resp.status_code == 200
    assert pub_resp.json()["affected_count"] == 2

    # 3. Bulk archive
    arc_resp = await client.post("/api/v1/admin/bulk/archive", json=pub_payload, headers=admin_headers)
    assert arc_resp.status_code == 200
    assert arc_resp.json()["affected_count"] == 2
