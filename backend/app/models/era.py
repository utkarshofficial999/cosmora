from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, BigInteger, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.timeline import TimelineEvent


class Era(Base):
    """Era model representing cosmological and space exploration time periods."""

    __tablename__ = "eras"

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
    start_year: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )
    end_year: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )
    color: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    # Relationships
    events: Mapped[list[TimelineEvent]] = relationship(
        "TimelineEvent",
        back_populates="era",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Era(id={self.id}, name={self.name}, slug={self.slug})>"
