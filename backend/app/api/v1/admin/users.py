from fastapi import APIRouter, HTTPException

from app.api.dependencies import CurrentUserDep
from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/users", tags=["admin-users"])

@router.get("/", response_model=SuccessResponse[list[dict]])
async def list_users(user: CurrentUserDep):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    # TODO: implement real user listing
    users = [{"id": "1", "email": "user@example.com"}]
    return SuccessResponse(
        message="Users retrieved successfully",
        data=users
    )

@router.get("/{user_id}", response_model=SuccessResponse[dict])
async def get_user(user_id: str, current: CurrentUserDep):
    if not getattr(current, "is_superuser", False):
        await check_admin_access(current) # just an example
    return SuccessResponse(
        message="User retrieved successfully",
        data={"id": user_id, "email": "user@example.com"}
    )

async def check_admin_access(user: CurrentUserDep):
    if not getattr(user, "is_superuser", False):
         raise HTTPException(status_code=403, detail="Admin privileges required")
