"""Cosmos Platform — Cache Service Tests.

Tests for RedisService & CacheService get/set, TTL, and pattern invalidations.
"""

import pytest
from app.services.cache_service import CacheService
from app.services.redis_service import RedisService


@pytest.mark.anyio
async def test_cache_service_hit_miss_and_invalidation() -> None:
    """Test CacheService caching behavior, fetch_coro execution, and pattern invalidations."""
    redis = RedisService()
    await redis.flush_all()
    cache = CacheService(redis)

    fetch_counter = 0

    async def sample_fetch() -> str:
        nonlocal fetch_counter
        fetch_counter += 1
        return f"Data_{fetch_counter}"

    # 1. First call -> Cache Miss, fetch_coro executes
    val1 = await cache.get_or_set("planet:mars", sample_fetch, ttl=60)
    assert val1 == "Data_1"
    assert fetch_counter == 1

    # 2. Second call -> Cache Hit, returns cached value without executing fetch_coro
    val2 = await cache.get_or_set("planet:mars", sample_fetch, ttl=60)
    assert val2 == "Data_1"
    assert fetch_counter == 1

    # 3. Invalidate module -> Pattern delete
    deleted = await cache.invalidate_module("planet")
    assert deleted == 1

    # 4. Third call -> Cache Miss after invalidation
    val3 = await cache.get_or_set("planet:mars", sample_fetch, ttl=60)
    assert val3 == "Data_2"
    assert fetch_counter == 2
