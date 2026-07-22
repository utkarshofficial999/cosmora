"""Cosmos Platform — Role Schemas.

Pydantic models for Role request and response payloads.
"""

from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class RoleBase(BaseModel):
    """Base fields for Role."""

    name: str = Field(..., max_length=50, examples=["Customer"])
    description: str | None = Field(
        default=None, max_length=255, examples=["Standard customer role"]
    )


class RoleResponse(RoleBase):
    """Response model for Role information."""

    id: UUID

    model_config = ConfigDict(from_attributes=True)
