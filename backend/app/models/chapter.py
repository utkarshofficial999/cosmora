from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Integer, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.story import Story


class StoryChapter(Base):
    """StoryChapter model representing individual chapters of a multi-part story."""

    __tablename__ = "story_chapters"

    story_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    chapter_number: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
        index=True,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    estimated_read_time: Mapped[int] = mapped_column(
        Integer,
        default=3,
        nullable=False,
    )

    # Relationships
    story: Mapped[Story] = relationship(
        "Story",
        back_populates="chapters",
    )

    def __repr__(self) -> str:
        return f"<StoryChapter(id={self.id}, title={self.title}, chapter_number={self.chapter_number})>"
