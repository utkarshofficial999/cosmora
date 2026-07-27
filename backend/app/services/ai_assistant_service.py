"""Cosmos Platform — AI Assistant Service.

Orchestrates RAG workflow, chat conversation management, and LLM response generation.
"""

from collections.abc import AsyncGenerator
from typing import Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.auth import PermissionDeniedError
from app.exceptions.catalog import ConversationNotFoundError
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationListResponse,
    ConversationResponse,
)
from app.services.llm_provider import BaseLLMProvider, CosmoraRAGLLMProvider
from app.services.retrieval_service import RetrievalService


class AIAssistantService:
    """Service managing AI conversations, RAG query execution, and response synthesis."""

    def __init__(
        self,
        session: AsyncSession,
        llm_provider: BaseLLMProvider | None = None,
    ) -> None:
        self.session = session
        self.conv_repo = ConversationRepository(session)
        self.retrieval_service = RetrievalService(session)
        self.llm_provider = llm_provider or CosmoraRAGLLMProvider()

    async def list_user_conversations(self, user_id: UUID, page: int = 1, limit: int = 10) -> ConversationListResponse:
        """List user's AI conversations with pagination."""
        items, total, pages = await self.conv_repo.list_user_conversations(user_id, page=page, limit=limit)
        return ConversationListResponse(
            items=[ConversationResponse.model_validate(c) for c in items],
            page=page,
            limit=limit,
            total=total,
            pages=pages,
        )

    async def create_conversation(self, user_id: UUID, payload: ConversationCreate) -> ConversationResponse:
        """Create a new AI conversation."""
        conv = await self.conv_repo.create(user_id=user_id, title=payload.title)
        fresh = await self.conv_repo.get_by_id(conv.id)
        return ConversationResponse.model_validate(fresh or conv)

    async def delete_conversation(self, user_id: UUID, conversation_id: UUID) -> None:
        """Delete an AI conversation."""
        conv = await self.conv_repo.get_by_id(conversation_id)
        if not conv:
            raise ConversationNotFoundError(f"Conversation '{conversation_id}' not found.")

        if conv.user_id != user_id:
            raise PermissionDeniedError("Cannot delete another user's conversation.")

        await self.conv_repo.delete(conv)

    async def chat(self, user_id: UUID, payload: ChatRequest) -> ChatResponse:
        """Process user query through RAG pipeline and return grounded response."""
        # 1. Resolve conversation
        if payload.conversation_id:
            conv = await self.conv_repo.get_by_id(payload.conversation_id)
            if not conv:
                raise ConversationNotFoundError(f"Conversation '{payload.conversation_id}' not found.")
            if conv.user_id != user_id:
                raise PermissionDeniedError("Cannot access another user's conversation.")
        else:
            # Auto-create conversation titled after user query
            title_summary = payload.message[:40] + ("..." if len(payload.message) > 40 else "")
            conv = await self.conv_repo.create(user_id=user_id, title=title_summary)

        # 2. Append user message
        user_tokens = len(payload.message.split())
        await self.conv_repo.add_message(
            conversation_id=conv.id,
            role="user",
            content=payload.message,
            token_count=user_tokens,
        )

        # 3. Retrieve RAG knowledge contexts & sources
        contexts, sources = await self.retrieval_service.retrieve_contexts_and_sources(payload.message, limit=4)

        # 4. Fetch history
        history_msgs = await self.conv_repo.get_conversation_history(conv.id, limit=10)
        formatted_history = [{"role": m.role, "content": m.content} for m in history_msgs]

        # 5. Generate LLM answer & follow-up suggestions
        answer_text, follow_ups = await self.llm_provider.generate_rag_response(
            query=payload.message,
            retrieved_contexts=contexts,
            history=formatted_history,
        )

        # 6. Append assistant message
        assistant_tokens = len(answer_text.split())
        await self.conv_repo.add_message(
            conversation_id=conv.id,
            role="assistant",
            content=answer_text,
            token_count=assistant_tokens,
        )

        return ChatResponse(
            conversation_id=conv.id,
            answer=answer_text,
            sources=sources,
            follow_up_questions=follow_ups,
        )

    async def stream_chat(self, user_id: UUID, payload: ChatRequest) -> AsyncGenerator[str, None]:
        """Stream RAG response tokens for real-time SSE streaming."""
        contexts, _ = await self.retrieval_service.retrieve_contexts_and_sources(payload.message, limit=4)
        async for chunk in self.llm_provider.stream_rag_response(payload.message, contexts):
            yield chunk
