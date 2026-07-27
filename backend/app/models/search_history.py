from __future__ import annotations
import datetime
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class SearchHistory(Base):
    """SearchHistory model logging user search queries for analytics and recommendations."""

    __tablename__ = "search_history"

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    keyword: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    module: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        index=True,
    )
    searched_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    # Relationships
    user: Mapped[User | None] = relationship(
        "User",
    )

    def __repr__(self) -> str:
        return f"<SearchHistory(id={self.id}, keyword={self.keyword}, user_id={self.user_id})>"
