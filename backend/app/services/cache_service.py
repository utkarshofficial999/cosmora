"""Cosmos Platform — Cache Service.

High-level domain caching abstraction managing TTL rules and pattern invalidations.
"""

from typing import Any, Callable, Coroutine
from app.services.redis_service import RedisService


class CacheService:
    """Domain caching helper enforcing TTL rules per module."""

    TTLS = {
        "planet": 3600,     # 1 hour
        "story": 1800,      # 30 minutes
        "timeline": 7200,   # 2 hours
        "search": 600,      # 10 minutes
        "analytics": 300,   # 5 minutes
    }

    def __init__(self, redis_service: RedisService | None = None) -> None:
        self.redis = redis_service or RedisService()

    async def get_or_set(
        self,
        key: str,
        fetch_coro: Callable[[], Coroutine[Any, Any, Any]],
        ttl: int = 300,
    ) -> Any:
        """Fetch value from cache, or execute fetch_coro() and cache the result."""
        cached_val = await self.redis.get(key)
        if cached_val is not None:
            return cached_val

        fresh_val = await fetch_coro()
        if fresh_val is not None:
            await self.redis.set(key, fresh_val, ttl=ttl)
        return fresh_val

    async def invalidate_module(self, module_name: str) -> int:
        """Invalidate all cached items belonging to a specific module."""
        pattern = f"{module_name.lower()}:*"
        return await self.redis.pattern_delete(pattern)
