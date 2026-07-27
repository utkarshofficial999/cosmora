from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.timeline import TimelineEvent


class EventMedia(Base):
    """EventMedia model representing media assets linked to timeline events."""

    __tablename__ = "event_media"

    timeline_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("timeline_events.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    media_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    url: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )
    caption: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Relationships
    timeline_event: Mapped[TimelineEvent] = relationship(
        "TimelineEvent",
        back_populates="media",
    )

    def __repr__(self) -> str:
        return f"<EventMedia(id={self.id}, media_type={self.media_type}, url={self.url})>"
