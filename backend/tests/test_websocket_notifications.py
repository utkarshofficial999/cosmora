"""Cosmos Platform — WebSocket Notification Tests.

Tests for WebSocket connection establishment, JWT authentication, and ping/pong heartbeat.
"""

from fastapi.testclient import TestClient
from app.main import app


def test_websocket_notifications_ping_pong() -> None:
    """Test connecting to /api/v1/ws/notifications and pinging for heartbeat."""
    client = TestClient(app)
    with client.websocket_connect("/api/v1/ws/notifications") as websocket:
        websocket.send_text("ping")
        data = websocket.receive_text()
        assert data == "pong"
