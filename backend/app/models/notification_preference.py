from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Boolean, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class NotificationPreference(Base):
    """NotificationPreference model configuring user notification channel settings."""

    __tablename__ = "notification_preferences"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    mission_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    story_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    timeline_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    weekly_digest: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    email_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    push_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    user: Mapped[User] = relationship(
        "User",
    )

    def __repr__(self) -> str:
        return f"<NotificationPreference(user_id={self.user_id}, missions={self.mission_notifications}, stories={self.story_notifications})>"
