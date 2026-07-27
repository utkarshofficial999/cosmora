"""Cosmos Platform — AI Space Assistant API Endpoints.

REST API routes for RAG chat, conversation history, vector document indexing, and token streaming.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db, require_roles
from app.models.user import User
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationListResponse,
    ConversationResponse,
    RebuildEmbeddingsResponse,
)
from app.services.ai_assistant_service import AIAssistantService
from app.services.embedding_service import EmbeddingService

router = APIRouter(prefix="/ai", tags=["AI Space Assistant"])
admin_router = APIRouter(prefix="/admin/embeddings", tags=["Admin Embeddings"])


@router.get(
    "/conversations",
    response_model=ConversationListResponse,
    summary="Get User Conversations",
    description="Fetch paginated list of AI chat sessions for current user.",
)
async def list_conversations(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ConversationListResponse:
    """List user AI conversations."""
    service = AIAssistantService(db)
    return await service.list_user_conversations(user_id=current_user.id, page=page, limit=limit)


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create AI Conversation",
    description="Create a new AI chat conversation session.",
)
async def create_conversation(
    payload: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ConversationResponse:
    """Create new AI conversation."""
    service = AIAssistantService(db)
    return await service.create_conversation(user_id=current_user.id, payload=payload)


@router.delete(
    "/conversations/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete AI Conversation",
    description="Delete an AI chat conversation session and its messages.",
)
async def delete_conversation(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete AI conversation."""
    service = AIAssistantService(db)
    await service.delete_conversation(user_id=current_user.id, conversation_id=id)


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Ask AI Assistant (RAG)",
    description="Ask the AI Space Assistant a question. Grounded using Cosmora content retrieval.",
)
async def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ChatResponse:
    """Submit prompt to AI Space Assistant with RAG retrieval."""
    service = AIAssistantService(db)
    return await service.chat(user_id=current_user.id, payload=payload)


@router.post(
    "/chat/stream",
    summary="Stream AI Assistant Response",
    description="Stream AI Space Assistant RAG response tokens via Server-Sent Events (SSE).",
)
async def stream_chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    """Stream AI RAG response chunks."""
    service = AIAssistantService(db)
    return StreamingResponse(
        service.stream_chat(user_id=current_user.id, payload=payload),
        media_type="text/event-stream",
    )


# ADMIN EMBEDDING REBUILD ENDPOINT
@admin_router.post(
    "/rebuild",
    response_model=RebuildEmbeddingsResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Rebuild Embeddings Vector Store",
    description="Admin endpoint to batch index all platform content (Stories, Timeline, Planets, Missions, Agencies, Facts).",
    dependencies=[Depends(require_roles("Admin"))],
)
async def rebuild_embeddings(
    db: AsyncSession = Depends(get_db),
) -> RebuildEmbeddingsResponse:
    """Batch index all platform content into the vector store."""
    service = EmbeddingService(db)
    count = await service.batch_rebuild_all_embeddings()
    return RebuildEmbeddingsResponse(indexed_documents_count=count, status="Success")
