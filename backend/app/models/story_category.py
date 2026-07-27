from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.story import Story


class StoryCategory(Base):
    """StoryCategory model representing thematic groupings for stories."""

    __tablename__ = "story_categories"

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )
    slug: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    icon: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # Relationships
    stories: Mapped[list[Story]] = relationship(
        "Story",
        back_populates="category",
    )

    def __repr__(self) -> str:
        return f"<StoryCategory(id={self.id}, name={self.name}, slug={self.slug})>"
