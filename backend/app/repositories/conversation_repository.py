"""Cosmos Platform — Conversation Repository.

Encapsulates database operations for AIConversation and AIMessage entities using SQLAlchemy Async 2.0.
"""

from math import ceil
from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage


class ConversationRepository:
    """Repository managing AIConversation and AIMessage database persistence."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, conversation_id: UUID, load_messages: bool = True) -> AIConversation | None:
        """Fetch an AIConversation by primary key ID."""
        query = select(AIConversation).where(AIConversation.id == conversation_id)
        if load_messages:
            query = query.options(selectinload(AIConversation.messages))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def create(self, user_id: UUID, title: str = "Space Exploration Chat") -> AIConversation:
        """Create and persist a new AIConversation entity."""
        conversation = AIConversation(user_id=user_id, title=title)
        self.session.add(conversation)
        await self.session.flush()
        return conversation

    async def update_title(self, conversation: AIConversation, title: str) -> AIConversation:
        """Update conversation title."""
        conversation.title = title
        await self.session.flush()
        return conversation

    async def delete(self, conversation: AIConversation) -> None:
        """Delete an AIConversation entity."""
        await self.session.delete(conversation)
        await self.session.flush()

    async def list_user_conversations(
        self,
        user_id: UUID,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[Sequence[AIConversation], int, int]:
        """List user's AI conversations with pagination."""
        query = select(AIConversation).where(AIConversation.user_id == user_id)
        total_result = await self.session.execute(
            select(select(AIConversation).where(AIConversation.user_id == user_id).subquery())
        )
        total = len(total_result.all())

        query = query.order_by(AIConversation.updated_at.desc()).offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()
        pages = ceil(total / limit) if limit > 0 else 1

        return items, total, pages

    async def add_message(
        self,
        conversation_id: UUID,
        role: str,
        content: str,
        token_count: int = 0,
    ) -> AIMessage:
        """Append a message turn to a conversation."""
        message = AIMessage(
            conversation_id=conversation_id,
            role=role,
            content=content,
            token_count=token_count,
        )
        self.session.add(message)
        await self.session.flush()
        return message

    async def get_conversation_history(self, conversation_id: UUID, limit: int = 20) -> Sequence[AIMessage]:
        """Fetch message history for a conversation."""
        result = await self.session.execute(
            select(AIMessage)
            .where(AIMessage.conversation_id == conversation_id)
            .order_by(AIMessage.created_at.asc())
            .limit(limit)
        )
        return result.scalars().all()
