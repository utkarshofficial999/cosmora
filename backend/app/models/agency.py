from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.mission import Mission


class SpaceAgency(Base):
    """SpaceAgency model representing governmental or private space organizations."""

    __tablename__ = "agencies"

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
    country: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    founded_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    logo_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    website: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    headquarters: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Relationships
    missions: Mapped[list[Mission]] = relationship(
        "Mission",
        back_populates="agency",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<SpaceAgency(id={self.id}, name={self.name}, slug={self.slug})>"
