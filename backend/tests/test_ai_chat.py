"""Cosmos Platform — AI RAG Chat API Tests.

Tests for AI Assistant RAG query submission, citations, and follow-up question synthesis.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def user_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for a regular user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "chat_user@cosmos.org",
            "username": "chat_user",
            "password": "ValidP@ssword123",
            "role_name": "Customer",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "chat_user", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_rag_chat_flow(
    client: AsyncClient,
    user_headers: dict[str, str],
) -> None:
    """Test POST /api/v1/ai/chat RAG question endpoint."""
    payload = {"message": "Why is Mars called the Red Planet?"}
    resp = await client.post("/api/v1/ai/chat", json=payload, headers=user_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "conversation_id" in data
    assert "answer" in data
    assert "sources" in data
    assert "follow_up_questions" in data
    assert len(data["answer"]) > 10
