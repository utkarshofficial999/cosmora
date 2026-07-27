from __future__ import annotations
import datetime
from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class DailyAnalytics(Base):
    """DailyAnalytics model storing aggregated daily platform metrics."""

    __tablename__ = "daily_analytics"

    date: Mapped[datetime.date] = mapped_column(
        Date,
        nullable=False,
        unique=True,
        index=True,
    )
    active_users: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    new_users: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    stories_read: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    missions_viewed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    timeline_views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    planet_views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    searches: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    ai_questions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    notifications_sent: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    notifications_opened: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    def __repr__(self) -> str:
        return f"<DailyAnalytics(date={self.date}, active_users={self.active_users})>"
