"""Health check utilities and dependencies."""

from datetime import UTC, datetime

from sqlalchemy import text

from app.core.db import async_session
from app.schemas.health import BasicHealthData, DetailedHealthData, ServiceHealth


async def check_database() -> ServiceHealth:
    """Check database connection status."""
    try:
        async with async_session() as db:
            await db.execute(text("SELECT 1"))
        return ServiceHealth(status="healthy", timestamp=datetime.now(UTC))
    except Exception as e:
        return ServiceHealth(
            status="unhealthy", timestamp=datetime.now(UTC), error=str(e)
        )


async def check_redis() -> ServiceHealth:
    """Check Redis connection status."""
    try:
        from app.core.cache import get_redis

        redis_client = await get_redis()
        await redis_client.ping()
        return ServiceHealth(status="healthy", timestamp=datetime.now(UTC))
    except Exception as e:
        return ServiceHealth(
            status="unhealthy", timestamp=datetime.now(UTC), error=str(e)
        )


async def get_health() -> BasicHealthData:
    """Get overall health status."""
    return BasicHealthData(
        status="healthy", timestamp=datetime.now(UTC), version="0.1.0"
    )


async def get_health_detailed() -> DetailedHealthData:
    """Get detailed health status with all services."""
    db_status = await check_database()
    redis_status = await check_redis()

    overall_status = (
        "healthy"
        if db_status.status == "healthy" and redis_status.status == "healthy"
        else "unhealthy"
    )

    return DetailedHealthData(
        status=overall_status,
        timestamp=datetime.now(UTC),
        services={
            "database": db_status,
            "redis": redis_status,
        },
    )
