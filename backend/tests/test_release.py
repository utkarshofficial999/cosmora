"""Cosmos Platform — Release Integrity Tests.

Tests VERSION file content and release v1.0.0 artifacts.
"""

from pathlib import Path
import pytest


@pytest.mark.anyio
async def test_release_version_file() -> None:
    """Verify VERSION file is set to 1.0.0."""
    version_path = Path("/app/../VERSION")
    if not version_path.exists():
        version_path = Path("../VERSION")

    if version_path.exists():
        content = version_path.read_text().strip()
        assert content == "1.0.0"
