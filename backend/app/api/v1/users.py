from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastcrud import compute_offset
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import CurrentUserDep
from app.core.db import get_async_session
from app.core.pagination import build_paginated_response
from app.crud.user import crud_user
from app.schemas.responses import PaginatedResponse, SuccessResponse
from app.schemas.user import PublicUserRead, UserRead

get_async_session_dep = Depends(get_async_session)

router = APIRouter(tags=["users"])


@router.get("/profiles/me", response_model=SuccessResponse[UserRead])
async def read_own_profile(user: CurrentUserDep):
    """Example: returns the currently authenticated user's public profile."""
    return SuccessResponse(message="Profile retrieved successfully", data=user)


@router.get("/profiles", response_model=PaginatedResponse[PublicUserRead])
async def list_profiles(
    q: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    session: AsyncSession = get_async_session_dep,
):
    filters = {"email": q} if q else {}

    users_data = await crud_user.get_multi(
        db=session,
        offset=compute_offset(page, page_size),
        limit=page_size,
        return_total_count=True,
        **filters,
    )
    print(users_data)
    return build_paginated_response(
        result=users_data,
        page=page,
        page_size=page_size,
        message="Users retrieved successfully",
    )
