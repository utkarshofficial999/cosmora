from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, Boolean, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.moon import Moon
    from app.models.planet_fact import PlanetFact


class Planet(Base):
    """Planet model representing celestial bodies in the Solar System."""

    __tablename__ = "planets"

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
    diameter_km: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    mass: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    gravity: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    escape_velocity: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    orbital_period: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    rotation_period: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    average_temperature: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    distance_from_sun: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )
    number_of_moons: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    atmosphere: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    color: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    texture_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    model_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    is_habitable: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )

    # Relationships
    moons: Mapped[list[Moon]] = relationship(
        "Moon",
        back_populates="planet",
        cascade="all, delete-orphan",
    )
    facts: Mapped[list[PlanetFact]] = relationship(
        "PlanetFact",
        back_populates="planet",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Planet(id={self.id}, name={self.name}, slug={self.slug})>"
