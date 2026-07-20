"""Cosmos Platform — CORS Middleware Setup."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import Settings


def add_cors_middleware(app: FastAPI, settings: Settings) -> None:
    """Register CORS middleware with origins from settings."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
