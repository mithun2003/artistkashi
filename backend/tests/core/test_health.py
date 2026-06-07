from datetime import UTC, datetime

import pytest

from app.core import health
from app.schemas.health import ServiceHealth


@pytest.mark.asyncio
async def test_get_health_detailed_is_healthy_when_all_services_are_healthy(
    monkeypatch,
):
    service_health = ServiceHealth(
        status="healthy",
        timestamp=datetime.now(UTC),
    )

    async def healthy_service():
        return service_health

    monkeypatch.setattr(health, "check_database", healthy_service)
    monkeypatch.setattr(health, "check_redis", healthy_service)

    result = await health.get_health_detailed()

    assert result.status == "healthy"
    assert result.services.database == service_health
    assert result.services.redis == service_health


@pytest.mark.asyncio
async def test_get_health_detailed_is_unhealthy_when_a_service_is_unhealthy(
    monkeypatch,
):
    database_health = ServiceHealth(
        status="healthy",
        timestamp=datetime.now(UTC),
    )
    redis_health = ServiceHealth(
        status="unhealthy",
        timestamp=datetime.now(UTC),
        error="Redis unavailable",
    )

    async def healthy_database():
        return database_health

    async def unhealthy_redis():
        return redis_health

    monkeypatch.setattr(health, "check_database", healthy_database)
    monkeypatch.setattr(health, "check_redis", unhealthy_redis)

    result = await health.get_health_detailed()

    assert result.status == "unhealthy"
    assert result.services.database == database_health
    assert result.services.redis == redis_health
