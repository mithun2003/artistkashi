from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from app.auth.users import current_active_user
from app.schemas.responses import ResponseModel

router = APIRouter(prefix="/users", tags=["admin-users"])

@router.get("/", response_model=ResponseModel[List[dict]])
async def list_users(user: Any = Depends(current_active_user)):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    # TODO: implement real user listing
    users = [{"id": "1", "email": "user@example.com"}]
    return ResponseModel(
        message="Users retrieved successfully",
        data=users
    )

@router.get("/{user_id}", response_model=ResponseModel[dict])
async def get_user(user_id: str, current: Any = Depends(current_active_user)):
    if not getattr(current, "is_superuser", False):
        await check_admin_access(current) # just an example
    return ResponseModel(
        message="User retrieved successfully",
        data={"id": user_id, "email": "user@example.com"}
    )

async def check_admin_access(user: Any):
    if not getattr(user, "is_superuser", False):
         raise HTTPException(status_code=403, detail="Admin privileges required")
