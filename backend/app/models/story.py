from __future__ import annotations
import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.models.story_tag import story_tag_association

if TYPE_CHECKING:
    from app.models.story_category import StoryCategory
    from app.models.story_tag import StoryTag
    from app.models.chapter import StoryChapter
    from app.models.reading_progress import StoryProgress


class Story(Base):
    """Story model representing educational narratives and space discoveries."""

    __tablename__ = "stories"

    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("story_categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
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
    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    cover_image: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    estimated_read_time: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
    )
    author: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    source: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    language: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False,
    )
    difficulty: Mapped[str] = mapped_column(
        String(30),
        default="Intermediate",
        nullable=False,
        index=True,
    )
    story_type: Mapped[str] = mapped_column(
        String(50),
        default="General",
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="Draft",
        nullable=False,
        index=True,
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    view_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        index=True,
    )
    published_at: Mapped[datetime.datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    # Relationships
    category: Mapped[StoryCategory | None] = relationship(
        "StoryCategory",
        back_populates="stories",
    )
    chapters: Mapped[list[StoryChapter]] = relationship(
        "StoryChapter",
        back_populates="story",
        cascade="all, delete-orphan",
    )
    tags: Mapped[list[StoryTag]] = relationship(
        "StoryTag",
        secondary=story_tag_association,
        back_populates="stories",
    )
    progress_records: Mapped[list[StoryProgress]] = relationship(
        "StoryProgress",
        back_populates="story",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Story(id={self.id}, title={self.title}, status={self.status})>"
