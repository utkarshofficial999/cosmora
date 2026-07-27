"""Cosmos Platform — Background Worker Cleanup Routines.

Executes automated maintenance tasks for purging expired JWT refresh tokens and old notifications.
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


async def cleanup_old_notifications(session: AsyncSession, days: int = 30) -> int:
    """Purge notifications older than X days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    res = await session.execute(delete(Notification).where(Notification.created_at < cutoff))
    await session.flush()
    return res.rowcount
