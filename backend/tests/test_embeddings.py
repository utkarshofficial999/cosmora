"""Cosmos Platform — Admin Embeddings API Tests.

Tests for batch indexing platform content into vector embedding store.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "emb_admin@cosmos.org",
            "username": "emb_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "emb_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_admin_batch_rebuild_embeddings(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test POST /api/v1/admin/embeddings/rebuild batch indexing endpoint."""
    resp = await client.post("/api/v1/admin/embeddings/rebuild", headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "Success"
    assert "indexed_documents_count" in data
