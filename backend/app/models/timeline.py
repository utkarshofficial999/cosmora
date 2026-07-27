from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, BigInteger, Integer, Boolean, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.era import Era
    from app.models.event_media import EventMedia
    from app.models.user import User


class TimelineEvent(Base):
    """TimelineEvent model representing historical/cosmological events in space history."""

    __tablename__ = "timeline_events"

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    short_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    event_date: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    year: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        index=True,
    )
    importance: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
        index=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    thumbnail: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    era_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("eras.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Relationships
    era: Mapped[Era] = relationship(
        "Era",
        back_populates="events",
    )
    media: Mapped[list[EventMedia]] = relationship(
        "EventMedia",
        back_populates="timeline_event",
        cascade="all, delete-orphan",
    )
    author: Mapped[User | None] = relationship(
        "User",
    )

    def __repr__(self) -> str:
        return f"<TimelineEvent(id={self.id}, title={self.title}, year={self.year})>"
