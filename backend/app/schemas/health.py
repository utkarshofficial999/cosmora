"""Cosmos Platform — Health Check Schema."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str = Field(
        ...,
        examples=["healthy"],
        description="Current service health status.",
    )
    app_name: str = Field(
        ...,
        examples=["Cosmos Platform"],
        description="Application name.",
    )
    version: str = Field(
        ...,
        examples=["0.1.0"],
        description="Application version.",
    )
    database: str = Field(
        ...,
        examples=["connected"],
        description="Database connectivity status.",
    )
