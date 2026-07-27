"""Cosmos Platform — AI Conversations API Tests.

Tests for AI conversation session creation, listing, and deletion.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "ai_user@cosmos.org",
            "username": "ai_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "ai_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_conversation_crud_lifecycle(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test full CRUD lifecycle for AIConversation."""
    # 1. Create conversation
    c_resp = await client.post(
        "/api/v1/ai/conversations",
        json={"title": "Mars Exploration Q&A"},
        headers=user_headers,
    )
    assert c_resp.status_code == 201
    conv_id = c_resp.json()["id"]

    # 2. List conversations
    l_resp = await client.get("/api/v1/ai/conversations", headers=user_headers)
    assert l_resp.status_code == 200
    assert any(c["id"] == conv_id for c in l_resp.json()["items"])

    # 3. Delete conversation
    d_resp = await client.delete(f"/api/v1/ai/conversations/{conv_id}", headers=user_headers)
    assert d_resp.status_code == 204
