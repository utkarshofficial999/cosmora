"""Cosmos Platform — Cache Repository.

Encapsulates low-level cache telemetry and key inspection.
"""

from typing import Any
from app.services.redis_service import RedisService


class CacheRepository:
    """Repository handling cache key inspection and statistics."""

    def __init__(self, redis_service: RedisService | None = None) -> None:
        self.redis = redis_service or RedisService()

    async def fetch_statistics(self) -> dict[str, Any]:
        """Fetch cache statistics."""
        return await self.redis.get_stats()

    async def clear_all_caches(self) -> None:
        """Flush cache store."""
        await self.redis.flush_all()
