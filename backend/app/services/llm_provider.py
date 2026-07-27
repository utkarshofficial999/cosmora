"""Cosmos Platform — LLM Provider Interface & RAG Engine.

Provides an abstract LLM provider interface and a grounded RAG generation engine.
"""

from abc import ABC, abstractmethod
import asyncio
from collections.abc import AsyncGenerator
from typing import Any


class BaseLLMProvider(ABC):
    """Abstract Base Class for pluggable LLM providers (Gemini, OpenAI, Anthropic, Local models)."""

    @abstractmethod
    async def generate_rag_response(
        self,
        query: str,
        retrieved_contexts: list[dict[str, Any]],
        history: list[dict[str, str]] | None = None,
    ) -> tuple[str, list[str]]:
        """Generate a grounded RAG response and follow-up question suggestions."""
        pass

    @abstractmethod
    async def stream_rag_response(
        self,
        query: str,
        retrieved_contexts: list[dict[str, Any]],
        history: list[dict[str, str]] | None = None,
    ) -> AsyncGenerator[str, None]:
        """Stream RAG response text tokens as an async generator."""
        pass


class CosmoraRAGLLMProvider(BaseLLMProvider):
    """Default grounded RAG LLM provider for Cosmora space education platform."""

    async def generate_rag_response(
        self,
        query: str,
        retrieved_contexts: list[dict[str, Any]],
        history: list[dict[str, str]] | None = None,
    ) -> tuple[str, list[str]]:
        """Generate grounded answer based on retrieved Cosmora knowledge sources."""
        if not retrieved_contexts:
            answer = (
                f"I couldn't find specific entries in Cosmora's database regarding '{query}'. "
                "However, Cosmora is continuously expanding its space timeline, missions, and story collection! "
                "Try searching for Mars rovers, Apollo 11, black holes, or ISRO missions."
            )
            follow_ups = [
                "What space missions are tracked on Cosmora?",
                "Tell me about the Apollo 11 moon landing.",
                "How does the Solar System interactive map work?",
            ]
            return answer, follow_ups

        # Build grounded response synthesis
        synthesis_parts = []
        top_context = retrieved_contexts[0]
        synthesis_parts.append(
            f"Based on Cosmora's knowledge records regarding **{top_context['title']}**:\n\n"
        )

        for ctx in retrieved_contexts:
            synthesis_parts.append(f"• **{ctx['title']}** ({ctx['resource_type']}): {ctx['content'][:250]}...\n")

        synthesis_parts.append("\nFor detailed exploration, refer to the cited resources below.")
        answer = "".join(synthesis_parts)

        # Generate intelligent follow-up suggestions
        title_ref = top_context['title']
        follow_ups = [
            f"What other discoveries are related to {title_ref}?",
            "Which space agency led this mission or event?",
            "Show me related stories in the Cosmora collection.",
        ]

        return answer, follow_ups

    async def stream_rag_response(
        self,
        query: str,
        retrieved_contexts: list[dict[str, Any]],
        history: list[dict[str, str]] | None = None,
    ) -> AsyncGenerator[str, None]:
        """Stream generated response token chunks for real-time SSE streaming."""
        answer, _ = await self.generate_rag_response(query, retrieved_contexts, history)
        words = answer.split(" ")
        for i, word in enumerate(words):
            chunk = word + (" " if i < len(words) - 1 else "")
            yield chunk
            await asyncio.sleep(0.02)  # Simulate token streaming delay
