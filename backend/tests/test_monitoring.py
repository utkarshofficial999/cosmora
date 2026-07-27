"""Cosmos Platform — Prometheus Monitoring Tests.

Tests Prometheus text metrics exporter endpoint.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_prometheus_metrics_endpoint(client: AsyncClient) -> None:
    """Test GET /api/v1/metrics Prometheus text exporter endpoint."""
    resp = await client.get("/api/v1/metrics")
    assert resp.status_code == 200
    assert "text/plain" in resp.headers["content-type"]
    assert "cosmora_requests_total" in resp.text
    assert "cosmora_up" in resp.text
