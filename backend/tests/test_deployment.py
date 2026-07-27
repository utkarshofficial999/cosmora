"""Cosmos Platform — Production Deployment Environment Tests.

Tests environment configuration and platform version integrity.
"""

import pytest
from app.config.settings import get_settings


@pytest.mark.anyio
async def test_environment_settings_and_version() -> None:
    """Verify system settings and version identifier."""
    get_settings.cache_clear()
    settings = get_settings()
    assert settings.app_name == "Cosmos Platform"
    assert settings.app_version is not None
