from __future__ import annotations
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Integer, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Collection(Base):
    """Collection model representing user-created playlists/groupings of space content."""

    __tablename__ = "collections"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    is_public: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )
    cover_image: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    # Relationships
    user: Mapped[User] = relationship(
        "User",
    )
    items: Mapped[list[CollectionItem]] = relationship(
        "CollectionItem",
        back_populates="collection",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Collection(id={self.id}, title={self.title}, user_id={self.user_id})>"


class CollectionItem(Base):
    """CollectionItem model representing an individual resource inside a collection."""

    __tablename__ = "collection_items"

    collection_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("collections.id", ondelete="CASCADE"),
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
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        index=True,
    )

    # Relationships
    collection: Mapped[Collection] = relationship(
        "Collection",
        back_populates="items",
    )

    def __repr__(self) -> str:
        return f"<CollectionItem(id={self.id}, collection_id={self.collection_id}, resource={self.resource_type}:{self.resource_id})>"
