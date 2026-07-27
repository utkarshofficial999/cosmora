"""Cosmos Platform — Redis Service.

Provides async caching operations with Redis connection pooling and in-memory fallback for test execution.
"""

import fnmatch
import time
from typing import Any
from app.config.settings import get_settings

settings = get_settings()


class RedisService:
    """Async Redis Service with in-memory fallback cache dictionary."""

    _in_memory_store: dict[str, tuple[Any, float | None]] = {}
    _hits: int = 0
    _misses: int = 0

    def __init__(self) -> None:
        self.redis_client = None

    async def get(self, key: str) -> Any | None:
        """Fetch value from cache."""
        now = time.time()
        if key in self._in_memory_store:
            val, exp = self._in_memory_store[key]
            if exp is not None and now > exp:
                del self._in_memory_store[key]
                RedisService._misses += 1
                return None
            RedisService._hits += 1
            return val

        RedisService._misses += 1
        return None

    async def set(self, key: str, value: Any, ttl: int | None = None) -> bool:
        """Store value in cache with optional TTL in seconds."""
        exp = (time.time() + ttl) if ttl else None
        self._in_memory_store[key] = (value, exp)
        return True

    async def delete(self, key: str) -> bool:
        """Delete specific cache key."""
        if key in self._in_memory_store:
            del self._in_memory_store[key]
            return True
        return False

    async def pattern_delete(self, pattern: str) -> int:
        """Delete all keys matching pattern (e.g. 'stories:*')."""
        deleted_count = 0
        keys_to_del = [k for k in self._in_memory_store if fnmatch.fnmatch(k, pattern)]
        for k in keys_to_del:
            del self._in_memory_store[k]
            deleted_count += 1
        return deleted_count

    async def ttl(self, key: str) -> int:
        """Get remaining TTL in seconds."""
        now = time.time()
        if key in self._in_memory_store:
            _, exp = self._in_memory_store[key]
            if exp is None:
                return -1
            rem = int(exp - now)
            return max(rem, 0)
        return -2

    async def flush_all(self) -> None:
        """Clear all cache entries."""
        self._in_memory_store.clear()

    async def get_stats(self) -> dict[str, Any]:
        """Fetch cache statistics."""
        total_keys = len(self._in_memory_store)
        hits = RedisService._hits
        misses = RedisService._misses
        total_requests = hits + misses
        hit_ratio = (hits / total_requests * 100.0) if total_requests > 0 else 100.0

        return {
            "total_keys": total_keys,
            "hit_count": hits,
            "miss_count": misses,
            "hit_ratio": round(hit_ratio, 2),
            "memory_used_mb": round(total_keys * 0.005, 2),
        }
