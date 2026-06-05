from collections.abc import AsyncGenerator
from urllib.parse import urlparse

from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

import app.models  # noqa: F401
from app.core.config import settings
from app.models.base import Base
from app.models.user import User

# Parse database URL for asyncpg
parsed_db_url = urlparse(settings.DATABASE_URL)
async_db_connection_url = (
    f"postgresql+asyncpg://{parsed_db_url.username}:{parsed_db_url.password}@"
    f"{parsed_db_url.hostname}{':' + str(parsed_db_url.port) if parsed_db_url.port else ''}"
    f"{parsed_db_url.path}"
)

# Create async engine
# Disable connection pooling for serverless environments like Vercel
engine = create_async_engine(
    async_db_connection_url,
    echo=False,
    future=True,
    poolclass=NullPool,
)

# Backwards compatible alias
async_engine = engine

# Create async session factory
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=settings.EXPIRE_ON_COMMIT,
)

# Backwards compatible alias
async_session = async_session_maker


async def get_db() -> AsyncGenerator[AsyncSession]:
    """Dependency to get database session."""
    async with async_session_maker() as db:
        yield db


async def get_async_session() -> AsyncGenerator[AsyncSession]:
    """Alias for get_db, used by fastapi-users and some routes."""
    async with async_session_maker() as session:
        yield session


# Module-level Depends singleton to avoid function calls in default args (Ruff B008)
get_async_session_dep = Depends(get_async_session)


async def get_user_db(
    session: AsyncSession = get_async_session_dep,
) -> AsyncGenerator[SQLAlchemyUserDatabase]:
    """Get user database adapter for fastapi-users."""
    if session is None:
        async with async_session_maker() as session:
            yield SQLAlchemyUserDatabase(session, User)
    else:
        yield SQLAlchemyUserDatabase(session, User)


async def create_db_and_tables() -> None:
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_db_and_tables() -> None:
    """Drop all database tables (use with caution!)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
