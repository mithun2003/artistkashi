"""Background job queue using ARQ."""

from typing import Any, Callable

from arq import create_pool
from arq.connections import RedisSettings

from app.core.config import settings

# Global job queue pool
pool: Any = None


async def init_queue() -> None:
    """Initialize ARQ job queue."""
    global pool
    pool = await create_pool(
        RedisSettings(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            database=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD,
        )
    )


async def close_queue() -> None:
    """Close job queue pool."""
    global pool
    if pool:
        await pool.aclose()


async def get_queue():
    """Get job queue instance."""
    if not pool:
        await init_queue()
    return pool


async def enqueue_job(
    func: Callable, *args, job_id: str | None = None, **kwargs
) -> str:
    """
    Enqueue a background job.

    Args:
        func: Async function to execute
        args: Positional arguments
        job_id: Optional job ID
        kwargs: Keyword arguments

    Returns:
        Job ID
    """
    queue = await get_queue()
    job = await queue.enqueue(func, *args, job_id=job_id, **kwargs)
    return job.job_id


async def get_job_result(job_id: str, timeout: int = 10) -> Any:
    """
    Get job result.

    Args:
        job_id: Job ID
        timeout: Timeout in seconds

    Returns:
        Job result or None
    """
    queue = await get_queue()
    job = await queue.job(job_id)
    if job:
        return await job.result(timeout=timeout)
    return None
