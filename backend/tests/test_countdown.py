"""Cosmos Platform — Countdown Service Tests.

Tests for launch countdown calculations and GET /api/v1/missions/{slug}/countdown endpoint.
"""

from datetime import datetime, timedelta, timezone
import pytest
from httpx import AsyncClient
from app.services.countdown_service import CountdownService


def test_countdown_future_date() -> None:
    """Test countdown logic for a launch scheduled in the future."""
    future_time = datetime.now(timezone.utc) + timedelta(days=24, hours=18, minutes=32, seconds=12)
    res = CountdownService.calculate_countdown(future_time, status="Upcoming")
    assert res.days == 24
    assert res.hours in (18, 17)
    assert res.status == "Upcoming"


def test_countdown_past_date() -> None:
    """Test countdown logic for a past launch date returns zero."""
    past_time = datetime.now(timezone.utc) - timedelta(days=10)
    res = CountdownService.calculate_countdown(past_time, status="Successful")
    assert res.days == 0
    assert res.hours == 0
    assert res.minutes == 0
    assert res.seconds == 0
    assert res.status == "Successful"


def test_countdown_none_date() -> None:
    """Test countdown logic for unassigned launch date returns zero."""
    res = CountdownService.calculate_countdown(None, status="Preparing")
    assert res.days == 0
    assert res.hours == 0
    assert res.minutes == 0
    assert res.seconds == 0
    assert res.status == "Preparing"


@pytest.mark.anyio
async def test_countdown_api_endpoint(client: AsyncClient) -> None:
    """Test GET /api/v1/missions/{slug}/countdown endpoint."""
    # 1. Register Admin & create Agency + Mission
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cd_admin@cosmos.org",
            "username": "cd_admin",
            "password": "ValidP@ssword123",
            "role_name": "Admin",
        },
    )
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "cd_admin", "password": "ValidP@ssword123"},
    )
    headers = {"Authorization": f"Bearer {login_resp.json()['access_token']}"}

    agency_resp = await client.post(
        "/api/v1/agencies",
        json={"name": "Countdown Agency"},
        headers=headers,
    )
    agency_id = agency_resp.json()["id"]

    future_launch = (datetime.now(timezone.utc) + timedelta(days=5, hours=3)).isoformat()
    await client.post(
        "/api/v1/missions",
        json={
            "agency_id": agency_id,
            "name": "Countdown Mission 1",
            "mission_type": "Satellite",
            "launch_date": future_launch,
            "status": "Upcoming",
        },
        headers=headers,
    )

    # 2. Public GET countdown endpoint
    res = await client.get("/api/v1/missions/countdown-mission-1/countdown")
    assert res.status_code == 200
    data = res.json()
    assert data["days"] == 5
    assert data["hours"] in (2, 3)
    assert data["status"] == "Upcoming"
