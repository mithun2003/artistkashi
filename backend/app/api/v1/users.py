from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from app.auth.users import current_active_user
from app.crud.user import crud_user
from app.schemas.responses import ResponseModel
from app.schemas.user import UserRead
from typing import Any, List

router = APIRouter(tags=["users"])


@router.get("/profiles/me", response_model=ResponseModel[UserRead])
async def read_own_profile(user: Any = Depends(current_active_user)):
    """Example: returns the currently authenticated user's public profile."""
    return ResponseModel(
        message="Profile retrieved successfully",
        data=user
    )


@router.get("/profiles", response_model=ResponseModel[List[UserRead]])
async def list_profiles(
    q: str | None = None, 
    session: AsyncSession = Depends(get_async_session)
):
    """Search for public profiles using FastCRUD."""
    if q:
        # Example search by email
        users = await crud_user.get_multi(db=session, email=q)
    else:
        users = await crud_user.get_multi(db=session)
    
    return ResponseModel(
        message="Profiles retrieved successfully",
        data=users["data"] if isinstance(users, dict) and "data" in users else users
    )
