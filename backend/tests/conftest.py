import uuid

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.auth.security import (
    create_access_token,
    hash_password,
)
from app.core.config import settings
from app.core.db import get_async_session
from app.main import app
from app.models import Base, User


@pytest_asyncio.fixture(scope="function")
async def engine():
    """Create a fresh test database engine for each test function."""
    engine = create_async_engine(settings.TEST_DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def db_session(engine):
    """Create a fresh database session for each test."""
    async_session_maker = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session_maker() as session:
        yield session
        await session.rollback()
        await session.close()


@pytest_asyncio.fixture(scope="function")
async def test_client(
    db_session,
):
    async def override_get_async_session():
        yield db_session

    app.dependency_overrides[get_async_session] = override_get_async_session

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://localhost:8000",
    ) as client:
        yield client

    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def authenticated_user(
    test_client,
    db_session,
):
    user_data = {
        "id": uuid.uuid4(),
        "email": "test@example.com",
        "hashed_password": hash_password("TestPassword123#"),
        "is_active": True,
        "is_verified": True,
        "is_superuser": False,
        "full_name": "Test User",
    }

    user = User(**user_data)

    db_session.add(user)

    await db_session.commit()

    await db_session.refresh(user)

    access_token = create_access_token(
        user_id=user.id,
    )

    return {
        "headers": {"Authorization": f"Bearer {access_token}"},
        "user": user,
        "user_data": {
            "email": user.email,
            "password": "TestPassword123#",
        },
    }
