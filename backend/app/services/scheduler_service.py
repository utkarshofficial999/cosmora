"""Cosmos Platform — Scheduler Service.

Manages scheduled notification jobs, background alert processing, retries, and cleanup.
"""

from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scheduled_notification import ScheduledNotification
from app.repositories.scheduled_notification_repository import ScheduledNotificationRepository
from app.schemas.notification import NotificationCreate
from app.services.notification_service import NotificationService


class SchedulerService:
    """Service handling background job scheduling, retry policies, and alert expiration."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.scheduled_repo = ScheduledNotificationRepository(session)
        self.notification_service = NotificationService(session)

    async def schedule_notification(
        self,
        title: str,
        message: str,
        notification_type: str,
        scheduled_for: datetime,
        user_id: UUID | None = None,
    ) -> ScheduledNotification:
        """Schedule a future notification job."""
        return await self.scheduled_repo.create(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            scheduled_for=scheduled_for,
            status="pending",
            retry_count=0,
        )

    async def process_due_notifications(
        self,
        now: datetime | None = None,
        max_retries: int = 3,
    ) -> int:
        """Process and dispatch all pending scheduled notifications that are due."""
        current_time = now or datetime.now(timezone.utc)
        due_items = await self.scheduled_repo.get_due_notifications(current_time)

        processed_count = 0
        for item in due_items:
            try:
                if item.user_id:
                    await self.notification_service.create_and_send_notification(
                        NotificationCreate(
                            user_id=item.user_id,
                            title=item.title,
                            message=item.message,
                            notification_type=item.notification_type,
                        )
                    )
                await self.scheduled_repo.update(
                    item,
                    status="sent",
                    sent_at=current_time,
                )
                processed_count += 1
            except Exception:
                if item.retry_count + 1 >= max_retries:
                    await self.scheduled_repo.update(item, status="failed", retry_count=item.retry_count + 1)
                else:
                    await self.scheduled_repo.update(item, retry_count=item.retry_count + 1)

        return processed_count

    async def expire_outdated_notifications(self, cutoff: datetime) -> int:
        """Mark pending scheduled notifications past the cutoff date as expired."""
        result = await self.session.execute(
            update(ScheduledNotification)
            .where(
                ScheduledNotification.status == "pending",
                ScheduledNotification.scheduled_for < cutoff,
            )
            .values(status="expired")
        )
        await self.session.flush()
        return result.rowcount
