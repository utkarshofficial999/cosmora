"""Cosmos Platform — Countdown Service.

Implements real-time countdown logic for space mission launches.
"""

from datetime import datetime, timezone
from app.schemas.countdown import MissionCountdownResponse


class CountdownService:
    """Service providing real-time launch countdown calculations."""

    @staticmethod
    def calculate_countdown(
        launch_date: datetime | None,
        status: str,
    ) -> MissionCountdownResponse:
        """Calculate remaining days, hours, minutes, and seconds until launch.

        Returns zero for past launch dates or non-upcoming mission statuses.
        """
        if not launch_date:
            return MissionCountdownResponse(
                days=0,
                hours=0,
                minutes=0,
                seconds=0,
                launch_date=None,
                status=status,
            )

        now = datetime.now(timezone.utc)
        if launch_date.tzinfo is None:
            launch_date = launch_date.replace(tzinfo=timezone.utc)

        if launch_date <= now:
            return MissionCountdownResponse(
                days=0,
                hours=0,
                minutes=0,
                seconds=0,
                launch_date=launch_date,
                status=status,
            )

        delta = launch_date - now
        days = delta.days
        hours = delta.seconds // 3600
        minutes = (delta.seconds % 3600) // 60
        seconds = delta.seconds % 60

        return MissionCountdownResponse(
            days=days,
            hours=hours,
            minutes=minutes,
            seconds=seconds,
            launch_date=launch_date,
            status=status,
        )
