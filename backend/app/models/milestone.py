from __future__ import annotations
import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.mission import Mission


class MissionMilestone(Base):
    """MissionMilestone model representing milestone events during a space mission."""

    __tablename__ = "mission_milestones"

    mission_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("missions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    milestone_date: Mapped[datetime.datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        index=True,
    )

    # Relationships
    mission: Mapped[Mission] = relationship(
        "Mission",
        back_populates="milestones",
    )

    def __repr__(self) -> str:
        return f"<MissionMilestone(id={self.id}, title={self.title}, mission_id={self.mission_id})>"
