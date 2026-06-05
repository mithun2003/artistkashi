from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import CurrentUserDep
from app.core.db import get_async_session
from app.crud.user import crud_user
from app.schemas.responses import ResponseModel
from app.schemas.user import UserRead

get_async_session_dep = Depends(get_async_session)

router = APIRouter(tags=["users"])


@router.get("/profiles/me", response_model=ResponseModel[UserRead])
async def read_own_profile(user: CurrentUserDep):
    """Example: returns the currently authenticated user's public profile."""
    return ResponseModel(message="Profile retrieved successfully", data=user)


@router.get("/profiles", response_model=ResponseModel[list[UserRead]])
async def list_profiles(
    q: str | None = None, session: AsyncSession = get_async_session_dep
):
    """Search for public profiles using FastCRUD."""
    if q:
        # Example search by email
        users = await crud_user.get_multi(db=session, email=q)
    else:
        users = await crud_user.get_multi(db=session)

    return ResponseModel(
        message="Profiles retrieved successfully",
        data=users["data"] if isinstance(users, dict) and "data" in users else users,
    )
