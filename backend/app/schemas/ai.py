"""Cosmos Platform — AI Assistant Schemas.

Defines Pydantic v2 schemas for AI conversations, chat messages, RAG responses, and embeddings.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ConversationCreate(BaseModel):
    """Schema for creating a new AI chat conversation."""

    title: str = Field("Space Exploration Chat", max_length=255, description="Conversation title")


class ConversationResponse(BaseModel):
    """Schema for AIConversation API response."""

    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationListResponse(BaseModel):
    """Paginated list of user AI conversations."""

    items: list[ConversationResponse]
    page: int = Field(..., ge=1)
    limit: int = Field(..., ge=1)
    total: int = Field(..., ge=0)
    pages: int = Field(..., ge=0)


class MessageResponse(BaseModel):
    """Schema for AIMessage API response."""

    id: UUID
    conversation_id: UUID
    role: str
    content: str
    token_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatRequest(BaseModel):
    """Schema for user chat prompt submission."""

    conversation_id: UUID | None = Field(None, description="Optional existing conversation ID to continue chat")
    message: str = Field(..., min_length=1, description="User question or prompt for AI Assistant")


class SourceCitation(BaseModel):
    """Schema representing attributed RAG knowledge source."""

    resource_type: str = Field(..., description="Entity type (Story, Planet, Mission, etc.)")
    resource_title: str = Field(..., description="Entity title or name")
    resource_id: str = Field(..., description="Entity UUID or slug")
    snippet: str | None = Field(None, description="Relevant text snippet used for answer grounding")


class ChatResponse(BaseModel):
    """Schema for AI RAG answer response."""

    conversation_id: UUID
    answer: str
    sources: list[SourceCitation] = Field(default_factory=list)
    follow_up_questions: list[str] = Field(default_factory=list)


class RebuildEmbeddingsResponse(BaseModel):
    """Schema for admin batch embedding rebuild response."""

    indexed_documents_count: int = Field(..., ge=0, description="Total platform documents vectorized")
    status: str = Field("Success", description="Batch indexing completion status")
