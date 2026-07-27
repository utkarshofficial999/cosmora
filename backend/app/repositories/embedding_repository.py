"""Cosmos Platform — Embedding Repository.

Encapsulates database operations and vector similarity search for EmbeddingDocument entities.
"""

import math
from typing import Any, Sequence
from uuid import UUID
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.embedding_document import EmbeddingDocument


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Calculate cosine similarity between two float vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    if norm_v1 == 0.0 or norm_v2 == 0.0:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)


class EmbeddingRepository:
    """Repository managing EmbeddingDocument storage and vector similarity search."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, doc_id: UUID) -> EmbeddingDocument | None:
        """Fetch an EmbeddingDocument by ID."""
        result = await self.session.execute(
            select(EmbeddingDocument).where(EmbeddingDocument.id == doc_id)
        )
        return result.scalar_one_or_none()

    async def get_by_resource(self, resource_type: str, resource_id: str) -> EmbeddingDocument | None:
        """Fetch an EmbeddingDocument by resource_type and resource_id."""
        result = await self.session.execute(
            select(EmbeddingDocument).where(
                EmbeddingDocument.resource_type == resource_type,
                EmbeddingDocument.resource_id == str(resource_id),
            )
        )
        return result.scalar_one_or_none()

    async def create_or_update(
        self,
        resource_type: str,
        resource_id: str,
        title: str,
        content: str,
        embedding: list[float],
        metadata: dict[str, Any] | None = None,
    ) -> EmbeddingDocument:
        """Upsert an EmbeddingDocument entity."""
        existing = await self.get_by_resource(resource_type, resource_id)
        if existing:
            existing.title = title
            existing.content = content
            existing.embedding = embedding
            existing.doc_metadata = metadata
            await self.session.flush()
            return existing

        doc = EmbeddingDocument(
            resource_type=resource_type,
            resource_id=str(resource_id),
            title=title,
            content=content,
            embedding=embedding,
            doc_metadata=metadata,
        )
        self.session.add(doc)
        await self.session.flush()
        return doc

    async def delete_by_resource(self, resource_type: str, resource_id: str) -> None:
        """Delete document embeddings for a specific resource."""
        await self.session.execute(
            delete(EmbeddingDocument).where(
                EmbeddingDocument.resource_type == resource_type,
                EmbeddingDocument.resource_id == str(resource_id),
            )
        )
        await self.session.flush()

    async def delete_all(self) -> None:
        """Purge all embedding documents from the vector store."""
        await self.session.execute(delete(EmbeddingDocument))
        await self.session.flush()

    async def similarity_search(
        self,
        query_embedding: list[float],
        limit: int = 5,
        min_score: float = 0.1,
    ) -> list[tuple[EmbeddingDocument, float]]:
        """Execute vector similarity search across all stored EmbeddingDocuments."""
        result = await self.session.execute(select(EmbeddingDocument))
        documents = result.scalars().all()

        scored_docs: list[tuple[EmbeddingDocument, float]] = []
        for doc in documents:
            score = cosine_similarity(query_embedding, doc.embedding)
            if score >= min_score:
                scored_docs.append((doc, score))

        scored_docs.sort(key=lambda x: x[1], reverse=True)
        return scored_docs[:limit]
