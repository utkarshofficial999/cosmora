from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Float, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.planet import Planet


class Moon(Base):
    """Moon model representing natural satellites orbiting planets."""

    __tablename__ = "moons"

    planet_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("planets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
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
    diameter: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    orbital_period: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    # Relationships
    planet: Mapped[Planet] = relationship(
        "Planet",
        back_populates="moons",
    )

    def __repr__(self) -> str:
        return f"<Moon(id={self.id}, name={self.name}, planet_id={self.planet_id})>"
