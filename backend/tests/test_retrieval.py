"""Cosmos Platform — Retrieval Service Tests.

Tests for semantic similarity vector retrieval and source citation extraction.
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.embedding_service import EmbeddingService
from app.services.retrieval_service import RetrievalService


@pytest.mark.anyio
async def test_semantic_retrieval(db_session: AsyncSession) -> None:
    """Test vector embedding indexing and retrieval service."""
    emb_service = EmbeddingService(db_session)
    ret_service = RetrievalService(db_session)

    # 1. Index sample story document
    await emb_service.index_document(
        resource_type="Story",
        resource_id="sample-mars-story",
        title="Red Planet Rovers",
        content="Curiosity and Perseverance rovers search for signs of ancient water on Mars.",
    )

    # 2. Retrieve context for query
    contexts, sources = await ret_service.retrieve_contexts_and_sources("Mars water rovers", limit=2)
    assert len(contexts) >= 1
    assert contexts[0]["title"] == "Red Planet Rovers"
    assert len(sources) >= 1
    assert sources[0].resource_type == "Story"
