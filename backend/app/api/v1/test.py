"""Test endpoints for demonstration."""


from fastapi import APIRouter

from app.schemas.responses import SuccessResponse

router = APIRouter(tags=["test"])


@router.get("/test/ping", summary="Ping endpoint", response_model=SuccessResponse[dict])
async def ping():
    """Simple ping endpoint to test API connectivity."""
    return SuccessResponse(
        message="Pong! API is working",
        data={"status": "healthy", "timestamp": "now"}
    )


@router.post("/test/echo", summary="Echo endpoint", response_model=SuccessResponse[dict])
async def echo(message: str):
    """Echo back the message sent."""
    return SuccessResponse(
        message="Message echoed successfully",
        data={"your_message": message, "received_at": "now"}
    )
