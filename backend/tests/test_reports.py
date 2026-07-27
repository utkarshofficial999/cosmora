"""Cosmos Platform — Executive Reports API Tests.

Tests for exporting daily, weekly, and monthly reports in JSON and CSV formats.
"""

import pytest
from httpx import AsyncClient


@pytest.fixture
async def admin_headers(client: AsyncClient) -> dict[str, str]:
    """Fixture providing authentication headers for an Admin user."""
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "rpt_admin@cosmos.org",
            "username": "rpt_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "rpt_admin", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.anyio
async def test_export_reports_json_and_csv(
    client: AsyncClient,
    admin_headers: dict[str, str],
) -> None:
    """Test exporting executive reports in JSON and CSV formats."""
    # 1. JSON Report
    json_resp = await client.get("/api/v1/admin/reports/daily?format=json", headers=admin_headers)
    assert json_resp.status_code == 200
    assert json_resp.json()["period"] == "Daily"
    assert "metrics" in json_resp.json()

    # 2. CSV Report
    csv_resp = await client.get("/api/v1/admin/reports/weekly?format=csv", headers=admin_headers)
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "Metric Name" in csv_resp.text
    assert "Total Users" in csv_resp.text
