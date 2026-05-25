import logging

from app.api import router as api_router
from app.config import settings
from app.core.logger import configure_logging
from app.core.setup import create_application
from app.utils.routing import simple_generate_unique_route_id

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

# Disable creating DB tables on serverless platforms (VERCEL) or when explicitly requested
import os
disable_create = bool(os.getenv("VERCEL")) or os.getenv("DISABLE_CREATE_TABLES") == "1"
if disable_create:
    logger.info("⚠️ Detected serverless environment or DISABLE_CREATE_TABLES=1 — skipping create_tables_on_start")

app = create_application(
    router=api_router,
    settings=settings,
    generate_unique_id_function=simple_generate_unique_route_id,
    enable_redis=True,
    enable_queue=True,
    create_tables_on_start=not disable_create,
)

logger.info("🚀 ArtistKashi FastAPI Backend initialized")


