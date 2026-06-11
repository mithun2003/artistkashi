from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import crud_user
from app.schemas.user import User, UserRead


class UserService:
    async def get_by_id(
        self,
        session: AsyncSession,
        user_id: UUID,
        user_schema: type[UserRead | User] = UserRead,
    ):
        return await crud_user.get(
            db=session, id=user_id, return_as_model=True, schema_to_select=user_schema
        )

    async def get_by_email(
        self,
        session: AsyncSession,
        email: str,
        user_schema: type[UserRead | User] = UserRead,
    ):
        return await crud_user.get(
            db=session, email=email, return_as_model=True, schema_to_select=user_schema
        )

    async def verify_user(self, session: AsyncSession, user_id: UUID):
        return await crud_user.update(
            db=session, id=user_id, object={"is_verified": True}
        )

    async def update_password(
        self, session: AsyncSession, user_id: UUID, hashed_password: str
    ):
        return await crud_user.update(
            db=session, id=user_id, object={"hashed_password": hashed_password}
        )

    async def deactivate_user(self, session: AsyncSession, user_id: UUID):
        return await crud_user.update(
            db=session, id=user_id, object={"is_active": False}
        )


user_service = UserService()
