from fastapi import APIRouter

from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/users", tags=["ADMIN-USERS"])


@router.get("", response_model=SuccessResponse[list[dict]])
async def list_users():
    users = [{"id": "1", "email": "user@example.com"}]
    return SuccessResponse(message="Users retrieved successfully", data=users)


@router.get("/{user_id}", response_model=SuccessResponse[dict])
async def get_user(user_id: str):

    return SuccessResponse(
        message="User retrieved successfully",
        data={"id": user_id, "email": "user@example.com"},
    )
