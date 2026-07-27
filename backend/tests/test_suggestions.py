"""Cosmos Platform — Search Suggestions API Tests.

Tests for autocomplete search suggestions endpoint.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_search_suggestions(client: AsyncClient) -> None:
    """Test GET /api/v1/search/suggestions autocomplete endpoint."""
    resp = await client.get("/api/v1/search/suggestions?q=Mar")
    assert resp.status_code == 200
    data = resp.json()
    assert "matching_titles" in data
    assert "popular_searches" in data
    assert "categories" in data
