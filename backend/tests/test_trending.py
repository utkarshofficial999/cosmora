"""Cosmos Platform — Trending Search API Tests.

Tests for trending searches and popular content highlights.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_trending_searches(client: AsyncClient) -> None:
    """Test GET /api/v1/search/trending endpoint."""
    resp = await client.get("/api/v1/search/trending")
    assert resp.status_code == 200
    data = resp.json()
    assert "keywords" in data
    assert "popular_planets" in data
    assert "popular_missions" in data
    assert "trending_stories" in data
