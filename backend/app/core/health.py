"""Health check utilities and dependencies."""

from datetime import datetime

from sqlalchemy import text

from app.core.db import async_session


async def check_database() -> dict:
    """Check database connection status."""
    try:
        async with async_session() as db:
            await db.execute(text("SELECT 1"))
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }


async def check_redis() -> dict:
    """Check Redis connection status."""
    try:
        from app.core.cache import get_redis

        redis_client = await get_redis()
        await redis_client.ping()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }


async def get_health() -> dict:
    """Get overall health status."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "0.1.0",
    }


async def get_health_detailed() -> dict:
    """Get detailed health status with all services."""
    db_status = await check_database()
    redis_status = await check_redis()

    overall_status = (
        "healthy"
        if db_status["status"] == "healthy" and redis_status["status"] == "healthy"
        else "unhealthy"
    )

    return {
        "status": overall_status,
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": db_status,
            "redis": redis_status,
        },
    }
