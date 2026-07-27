from __future__ import annotations
import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.agency import SpaceAgency
    from app.models.milestone import MissionMilestone
    from app.models.mission_media import MissionMedia


class Mission(Base):
    """Mission model representing space exploration missions."""

    __tablename__ = "missions"

    agency_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("agencies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
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
    mission_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    objective: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    destination: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    spacecraft: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )
    rocket: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )
    launch_site: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    launch_date: Mapped[datetime.datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )
    expected_end_date: Mapped[datetime.datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default="Upcoming",
        nullable=False,
        index=True,
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    mission_patch: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    cover_image: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    livestream_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    wikipedia_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    # Relationships
    agency: Mapped[SpaceAgency] = relationship(
        "SpaceAgency",
        back_populates="missions",
    )
    milestones: Mapped[list[MissionMilestone]] = relationship(
        "MissionMilestone",
        back_populates="mission",
        cascade="all, delete-orphan",
    )
    media: Mapped[list[MissionMedia]] = relationship(
        "MissionMedia",
        back_populates="mission",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Mission(id={self.id}, name={self.name}, status={self.status})>"
