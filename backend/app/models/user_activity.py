from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class UserActivity(Base):
    """UserActivity model tracking user interactions across the platform for recommendations."""

    __tablename__ = "user_activities"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    resource_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    resource_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    session_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )

    # Relationships
    user: Mapped[User] = relationship(
        "User",
    )

    def __repr__(self) -> str:
        return f"<UserActivity(user_id={self.user_id}, action={self.action}, resource={self.resource_type}:{self.resource_id})>"
