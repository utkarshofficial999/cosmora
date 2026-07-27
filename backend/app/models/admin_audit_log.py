from __future__ import annotations
import uuid
from typing import TYPE_CHECKING, Any
from sqlalchemy import String, JSON, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class AdminAuditLog(Base):
    """AdminAuditLog model recording an immutable audit trail of administrative actions."""

    __tablename__ = "admin_audit_logs"

    admin_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    resource_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    resource_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    old_data: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )
    new_data: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )
    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )
    user_agent: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Relationships
    admin: Mapped[User | None] = relationship(
        "User",
    )

    def __repr__(self) -> str:
        return f"<AdminAuditLog(id={self.id}, action={self.action}, resource={self.resource_type})>"
