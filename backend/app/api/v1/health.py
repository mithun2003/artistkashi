"""Health check routes."""

from typing import Any

from fastapi import APIRouter

from app.core.health import get_health, get_health_detailed
from app.schemas.responses import ResponseModel

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", summary="Health check", response_model=ResponseModel[Any])
async def health_check():
    """Health check endpoint."""
    return ResponseModel(message="Service is healthy", data=await get_health())


@router.get(
    "/detailed", summary="Detailed health check", response_model=ResponseModel[Any]
)
async def health_check_detailed():
    """Detailed health check endpoint with all services."""
    return ResponseModel(
        message="Detailed health status retrieved", data=await get_health_detailed()
    )
