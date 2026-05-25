"""Redis cache and utilities."""

import json
from typing import Any

import redis.asyncio as redis

from app.config import settings

# Global redis client and pool
client: redis.Redis | None = None
pool: redis.ConnectionPool | None = None


async def init_redis() -> None:
    """Initialize Redis connection pool and client."""
    global client, pool
    pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)
    client = redis.Redis.from_pool(pool)


async def close_redis() -> None:
    """Close Redis connection."""
    global client, pool
    if client:
        await client.aclose()
    if pool:
        await pool.aclose()


async def get_redis() -> redis.Redis:
    """Get Redis client instance."""
    if not client:
        await init_redis()
    return client


async def cache_get(key: str) -> Any:
    """Get value from cache."""
    redis_client = await get_redis()
    value = await redis_client.get(key)
    if value:
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value
    return None


async def cache_set(key: str, value: Any, expire: int = 3600) -> None:
    """Set value in cache with expiration."""
    redis_client = await get_redis()
    if isinstance(value, (dict, list)):
        value = json.dumps(value)
    await redis_client.setex(key, expire, value)


async def cache_delete(key: str) -> None:
    """Delete key from cache."""
    redis_client = await get_redis()
    await redis_client.delete(key)


async def cache_clear(pattern: str = "*") -> None:
    """Clear cache keys matching pattern."""
    redis_client = await get_redis()
    keys = await redis_client.keys(pattern)
    if keys:
        await redis_client.delete(*keys)


async def cache_exists(key: str) -> bool:
    """Check if key exists in cache."""
    redis_client = await get_redis()
    return await redis_client.exists(key) > 0


async def cache_ttl(key: str) -> int:
    """Get time to live for a key."""
    redis_client = await get_redis()
    return await redis_client.ttl(key)


class Cache:
    """Decorator for caching function results."""

    def __init__(self, expire: int = 3600, key_prefix: str = "cache"):
        self.expire = expire
        self.key_prefix = key_prefix

    def __call__(self, func):
        async def async_wrapper(*args, **kwargs):
            # Create cache key from function name, args, and kwargs
            cache_key = f"{self.key_prefix}:{func.__name__}"
            if args:
                cache_key += f":{':'.join(str(arg) for arg in args)}"
            if kwargs:
                cache_key += f":{':'.join(f'{k}={v}' for k, v in kwargs.items())}"

            # Try to get from cache
            cached = await cache_get(cache_key)
            if cached is not None:
                return cached

            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache_set(cache_key, result, self.expire)
            return result

        return async_wrapper
