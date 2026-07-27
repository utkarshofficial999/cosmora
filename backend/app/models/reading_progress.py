from __future__ import annotations
import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Float, Integer, Boolean, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.story import Story
    from app.models.user import User


class StoryProgress(Base):
    """StoryProgress model tracking user reading completion and progress."""

    __tablename__ = "story_progress"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    story_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("stories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    last_chapter: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )
    progress_percentage: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    last_read_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    # Relationships
    story: Mapped[Story] = relationship(
        "Story",
        back_populates="progress_records",
    )
    user: Mapped[User] = relationship(
        "User",
    )

    def __repr__(self) -> str:
        return f"<StoryProgress(user_id={self.user_id}, story_id={self.story_id}, progress={self.progress_percentage}%)>"
