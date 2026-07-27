"""Cosmos Platform — Performance Repository.

Tracks API latency metrics and database query performance.
"""

from typing import Any
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class PerformanceRepository:
    """Repository executing performance diagnostics and database latency checks."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def measure_database_latency(self) -> float:
        """Measure database round-trip query latency in milliseconds."""
        import time
        start = time.time()
        await self.session.execute(text("SELECT 1"))
        return round((time.time() - start) * 1000.0, 2)
