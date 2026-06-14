from fastapi import APIRouter

from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/dashboard", tags=["admin-dashboard"])


@router.get("/overview", response_model=SuccessResponse[dict[str, int]])
async def overview():
    return SuccessResponse(
        message="Admin overview retrieved successfully",
        data={"users": 42, "courses": 7, "products": 13},
    )
