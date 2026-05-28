from collections.abc import AsyncGenerator, Callable
from contextlib import asynccontextmanager
from typing import Any

import logging
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.cache import init_redis, close_redis
from app.core.db import create_db_and_tables
from app.core.error_handler import setup_exception_handlers
from app.core.queue import init_queue, close_queue
from app.middleware.response import ResponseWrapperMiddleware

logger = logging.getLogger(__name__)


async def initialize_database() -> None:
    """Initialize database tables."""
    logger.info("📦 Creating database tables...")
    await create_db_and_tables()
    logger.info("✅ Database tables created successfully")


async def initialize_redis() -> None:
    """Initialize Redis connection."""
    logger.info("🔴 Connecting to Redis...")
    await init_redis()
    logger.info("✅ Redis connected successfully")


async def initialize_queue() -> None:
    """Initialize ARQ job queue."""
    logger.info("📋 Initializing job queue...")
    await init_queue()
    logger.info("✅ Job queue initialized successfully")


def lifespan_factory(
    settings: Any,
    create_tables_on_start: bool = True,
    enable_redis: bool = True,
    enable_queue: bool = True,
) -> Callable[[FastAPI], AsyncGenerator[None, None]]:
    """
    Create lifespan context manager for FastAPI app.

    Args:
        settings: Application settings
        create_tables_on_start: Whether to create database tables on startup
        enable_redis: Whether to initialize Redis
        enable_queue: Whether to initialize job queue

    Returns:
        Lifespan context manager
    """

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
        """Handle app startup and shutdown."""
        # Startup
        logger.info("🚀 Starting application...")

        if create_tables_on_start:
            await initialize_database()

        if enable_redis:
            try:
                await initialize_redis()
            except Exception as e:
                logger.warning(f"⚠️  Redis initialization failed: {e}")

        if enable_queue:
            try:
                await initialize_queue()
            except Exception as e:
                logger.warning(f"⚠️  Queue initialization failed: {e}")

        logger.info("✨ Application started successfully")

        yield

        # Shutdown
        logger.info("🛑 Shutting down application...")

        if enable_queue:
            try:
                await close_queue()
                logger.info("📋 Job queue closed")
            except Exception as e:
                logger.warning(f"⚠️  Job queue close failed: {e}")

        if enable_redis:
            try:
                await close_redis()
                logger.info("🔴 Redis connection closed")
            except Exception as e:
                logger.warning(f"⚠️  Redis close failed: {e}")

        logger.info("✅ Application shutdown complete")

    return lifespan


def create_application(
    router: APIRouter,
    settings: Any,
    create_tables_on_start: bool = True,
    enable_redis: bool = True,
    enable_queue: bool = True,
    lifespan: Callable[[FastAPI], AsyncGenerator[None, None]] | None = None,
    **kwargs: Any,
) -> FastAPI:
    """
    Create and configure FastAPI application.

    Args:
        router: API router
        settings: Application settings
        create_tables_on_start: Whether to create database tables on startup
        enable_redis: Whether to initialize Redis
        enable_queue: Whether to initialize job queue
        lifespan: Custom lifespan context manager
        **kwargs: Additional FastAPI arguments

    Returns:
        Configured FastAPI application
    """
    if lifespan is None:
        lifespan = lifespan_factory(
            settings,
            create_tables_on_start=create_tables_on_start,
            enable_redis=enable_redis,
            enable_queue=enable_queue,
        )

    kwargs.setdefault("openapi_url", settings.OPENAPI_URL)
    kwargs.setdefault("title", settings.APP_NAME)
    kwargs.setdefault("description", settings.APP_DESCRIPTION)
    kwargs.setdefault("version", settings.APP_VERSION)

    application = FastAPI(lifespan=lifespan, **kwargs)

    # Include router
    application.include_router(router)

    # Add CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.CORS_ORIGINS),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add Response Wrapper Middleware
    application.add_middleware(ResponseWrapperMiddleware)

    # Setup exception handlers
    setup_exception_handlers(application)

    return application

