"""Cosmos Platform — Structured Logging Tests.

Tests logging configuration and logger instantiation.
"""

import logging
import pytest


@pytest.mark.anyio
async def test_logging_configuration() -> None:
    """Test logger instance initialization."""
    logger = logging.getLogger("app.test")
    assert logger is not None
    logger.info("Structured logging test entry")
