"""Health check routes."""

from fastapi import APIRouter

from app.core.health import get_health, get_health_detailed
from app.schemas.health import BasicHealthData, DetailedHealthData
from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", summary="Health check", response_model=SuccessResponse[BasicHealthData])
async def health_check():
    """Health check endpoint."""
    return SuccessResponse(message="Service is healthy", data=await get_health())


@router.get(
    "/detailed",
    summary="Detailed health check",
    response_model=SuccessResponse[DetailedHealthData],
)
async def health_check_detailed():
    """Detailed health check endpoint with all services."""
    return SuccessResponse(
        message="Detailed health status retrieved", data=await get_health_detailed()
    )
