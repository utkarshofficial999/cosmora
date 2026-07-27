"""Cosmos Platform — WebSocket Connection Manager.

Manages active WebSocket client connections for real-time live notification streaming.
"""

from collections import defaultdict
from typing import Any
from uuid import UUID
from fastapi import WebSocket


class ConnectionManager:
    """Manages active WebSocket client connections and real-time message broadcasts."""

    def __init__(self) -> None:
        # Map user_id -> set of active WebSocket connections
        self.active_connections: dict[UUID, set[WebSocket]] = defaultdict(set)
        # Set of unauthenticated or general connections
        self.public_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket, user_id: UUID | None = None) -> None:
        """Accept WebSocket connection and store in active connections pool."""
        await websocket.accept()
        if user_id:
            self.active_connections[user_id].add(websocket)
        else:
            self.public_connections.add(websocket)

    def disconnect(self, websocket: WebSocket, user_id: UUID | None = None) -> None:
        """Remove WebSocket connection from active connections pool."""
        if user_id and user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        else:
            self.public_connections.discard(websocket)

    async def send_personal_message(self, message: dict[str, Any], user_id: UUID) -> None:
        """Send a real-time message payload to all active WebSocket connections of a specific user."""
        if user_id in self.active_connections:
            dead_sockets = set()
            for connection in list(self.active_connections[user_id]):
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_sockets.add(connection)
            for dead in dead_sockets:
                self.disconnect(dead, user_id)

    async def broadcast(self, message: dict[str, Any]) -> None:
        """Broadcast a real-time message payload to all connected clients on the platform."""
        # 1. User connections
        for user_id, sockets in list(self.active_connections.items()):
            dead_sockets = set()
            for connection in list(sockets):
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_sockets.add(connection)
            for dead in dead_sockets:
                self.disconnect(dead, user_id)

        # 2. Public connections
        dead_public = set()
        for connection in list(self.public_connections):
            try:
                await connection.send_json(message)
            except Exception:
                dead_public.add(connection)
        for dead in dead_public:
            self.disconnect(dead, None)


# Global singleton instance
ws_manager = ConnectionManager()
