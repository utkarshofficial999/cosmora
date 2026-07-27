from __future__ import annotations
import uuid
from typing import TYPE_CHECKING, Any
from sqlalchemy import String, JSON, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class AnalyticsEvent(Base):
    """AnalyticsEvent model recording raw user and system telemetry events."""

    __tablename__ = "analytics_events"

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    event_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    resource_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )
    resource_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    session_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    device_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    browser: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    os: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    country: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    referrer: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    event_metadata: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    # Relationships
    user: Mapped[User | None] = relationship("User")

    def __repr__(self) -> str:
        return f"<AnalyticsEvent(id={self.id}, type={self.event_type}, resource={self.resource_type})>"
