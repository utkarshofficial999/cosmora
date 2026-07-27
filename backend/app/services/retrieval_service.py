"""Cosmos Platform — Retrieval Service.

Performs vector semantic search, context assembly, and source citation mapping.
"""

from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.embedding_repository import EmbeddingRepository
from app.schemas.ai import SourceCitation
from app.services.embedding_service import generate_text_embedding


class RetrievalService:
    """Service executing RAG retrieval, document ranking, and source attribution."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.embedding_repo = EmbeddingRepository(session)

    async def retrieve_contexts_and_sources(
        self,
        query: str,
        limit: int = 4,
        min_score: float = -1.0,
    ) -> tuple[list[dict[str, Any]], list[SourceCitation]]:
        """Retrieve top matching document contexts and source citations for a query."""
        query_vector = generate_text_embedding(query)
        scored_docs = await self.embedding_repo.similarity_search(
            query_embedding=query_vector,
            limit=limit,
            min_score=min_score,
        )

        contexts = []
        sources = []

        for doc, score in scored_docs:
            contexts.append(
                {
                    "resource_type": doc.resource_type,
                    "resource_id": doc.resource_id,
                    "title": doc.title,
                    "content": doc.content,
                    "score": score,
                }
            )
            sources.append(
                SourceCitation(
                    resource_type=doc.resource_type,
                    resource_title=doc.title,
                    resource_id=doc.resource_id,
                    snippet=doc.content[:150] if doc.content else None,
                )
            )

        return contexts, sources
