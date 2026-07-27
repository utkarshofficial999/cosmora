"""Cosmos Platform — AI Streaming API Tests.

Tests for SSE token streaming response endpoint.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "stream_user@cosmos.org",
            "username": "stream_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "stream_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_streaming_chat_endpoint(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test POST /api/v1/ai/chat/stream SSE streaming endpoint."""
    payload = {"message": "Tell me about Apollo 11"}
    resp = await client.post("/api/v1/ai/chat/stream", json=payload, headers=user_headers)
    assert resp.status_code == 200
    assert "text/event-stream" in resp.headers["content-type"]
    assert len(resp.text) > 0
