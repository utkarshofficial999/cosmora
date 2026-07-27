from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Column, ForeignKey, String, Table, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.story import Story

# Junction table for many-to-many relationship between Stories and StoryTags
story_tag_association = Table(
    "story_tag_association",
    Base.metadata,
    Column("story_id", UUID(as_uuid=True), ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", UUID(as_uuid=True), ForeignKey("story_tags.id", ondelete="CASCADE"), primary_key=True),
)


class StoryTag(Base):
    """StoryTag model representing tags attached to stories."""

    __tablename__ = "story_tags"

    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )
    slug: Mapped[str] = mapped_column(
        String(60),
        unique=True,
        nullable=False,
        index=True,
    )

    # Relationships
    stories: Mapped[list[Story]] = relationship(
        "Story",
        secondary=story_tag_association,
        back_populates="tags",
    )

    def __repr__(self) -> str:
        return f"<StoryTag(id={self.id}, name={self.name}, slug={self.slug})>"
