"""Cosmos Platform — Scheduler Service Tests.

Tests for background job scheduling, retry policies, and alert expiration.
"""

from datetime import datetime, timedelta, timezone
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.scheduler_service import SchedulerService


@pytest.mark.anyio
async def test_scheduler_process_due_notifications(db_session: AsyncSession) -> None:
    """Test scheduling and processing due notifications."""
    scheduler = SchedulerService(db_session)
    past_time = datetime.now(timezone.utc) - timedelta(minutes=10)

    # 1. Schedule notification
    item = await scheduler.schedule_notification(
        title="Scheduled Launch Alert",
        message="Launch approaching",
        notification_type="Mission Launch",
        scheduled_for=past_time,
    )
    assert item.status == "pending"

    # 2. Process due items
    processed = await scheduler.process_due_notifications(now=datetime.now(timezone.utc))
    assert processed >= 1
    assert item.status == "sent"
    assert item.sent_at is not None
