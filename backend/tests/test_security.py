"""Cosmos Platform — Security Hardening Tests.

Tests security header presence and protection policies.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_security_headers_present(client: AsyncClient) -> None:
    """Test HTTP response security headers."""
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.headers.get("X-Content-Type-Options") == "nosniff"
    assert resp.headers.get("X-Frame-Options") == "DENY"
    assert "Strict-Transport-Security" in resp.headers
