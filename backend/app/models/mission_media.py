from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.mission import Mission


class MissionMedia(Base):
    """MissionMedia model representing media assets attached to space missions."""

    __tablename__ = "mission_media"

    mission_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("missions.id", ondelete="CASCADE"),
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
    mission: Mapped[Mission] = relationship(
        "Mission",
        back_populates="media",
    )

    def __repr__(self) -> str:
        return f"<MissionMedia(id={self.id}, media_type={self.media_type}, url={self.url})>"
