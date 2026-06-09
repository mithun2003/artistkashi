from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.dependencies import (
    get_current_admin,
    get_current_user,
)
from app.core.db import get_async_session
from app.schemas.user import User

type DatabaseDep = Annotated[
    AsyncSession,
    Depends(get_async_session),
]

type CurrentUserDep = Annotated[
    User,
    Depends(get_current_user),
]


type CurrentAdminDep = Annotated[
    User,
    Depends(get_current_admin),
]
