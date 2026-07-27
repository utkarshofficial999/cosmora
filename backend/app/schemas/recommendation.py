"""Cosmos Platform — Recommendation Schema.

Defines Pydantic v2 schemas for personalized recommendations.
"""

from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class RecommendationItem(BaseModel):
    """Single personalized content recommendation."""

    id: UUID | str
    title: str
    slug: str
    resource_type: str = Field(..., description="Entity type (story, planet, mission, timeline)")
    summary: str | None = None
    cover_image: str | None = None
    score: float = Field(1.0, description="Recommendation relevance score")
    reason: str = Field("Based on your interest", description="Explanation for recommendation")

    model_config = ConfigDict(from_attributes=True)


class RecommendationResponse(BaseModel):
    """Personalized recommendations response wrapper."""

    items: list[RecommendationItem] = Field(default_factory=list)
