from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Integer, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.planet import Planet


class PlanetFact(Base):
    """PlanetFact model representing interesting trivia and facts about planets."""

    __tablename__ = "planet_facts"

    planet_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("planets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        index=True,
    )

    # Relationships
    planet: Mapped[Planet] = relationship(
        "Planet",
        back_populates="facts",
    )

    def __repr__(self) -> str:
        return f"<PlanetFact(id={self.id}, title={self.title}, planet_id={self.planet_id})>"
