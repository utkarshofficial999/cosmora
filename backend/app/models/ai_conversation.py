from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.ai_message import AIMessage
    from app.models.user import User


class AIConversation(Base):
    """AIConversation model representing chat sessions with the AI Space Assistant."""

    __tablename__ = "ai_conversations"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        default="Space Exploration Chat",
        nullable=False,
    )

    # Relationships
    user: Mapped[User] = relationship(
        "User",
    )
    messages: Mapped[list[AIMessage]] = relationship(
        "AIMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="AIMessage.created_at.asc()",
    )

    def __repr__(self) -> str:
        return f"<AIConversation(id={self.id}, user_id={self.user_id}, title={self.title})>"
