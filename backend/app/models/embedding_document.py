from __future__ import annotations
from typing import Any
from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class EmbeddingDocument(Base):
    """EmbeddingDocument model representing vectorized platform content for semantic RAG search."""

    __tablename__ = "embedding_documents"

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
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    embedding: Mapped[list[float]] = mapped_column(
        JSON,
        nullable=False,
    )
    doc_metadata: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    def __repr__(self) -> str:
        return f"<EmbeddingDocument(id={self.id}, type={self.resource_type}, title={self.title})>"
