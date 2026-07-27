"""Cosmos Platform — WebSocket Notification Gateway.

Live WebSocket endpoint for real-time push notifications and live event streaming.
"""

from uuid import UUID
from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.core.security import decode_token
from app.services.websocket_manager import ws_manager

router = APIRouter(tags=["WebSockets"])


@router.websocket("/ws/notifications")
async def websocket_notifications_endpoint(
    websocket: WebSocket,
    token: str | None = Query(None, description="JWT Access Token for user authentication"),
) -> None:
    """WebSocket gateway streaming real-time notifications to connected clients."""
    user_id: UUID | None = None

    if token:
        try:
            payload = decode_token(token, expected_type="access")
            sub = payload.get("sub")
            if sub:
                user_id = UUID(sub)
        except Exception:
            user_id = None

    await ws_manager.connect(websocket, user_id=user_id)

    try:
        while True:
            data = await websocket.receive_text()
            # Heartbeat ping/pong support
            if data.strip().lower() == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, user_id=user_id)
    except Exception:
        ws_manager.disconnect(websocket, user_id=user_id)
