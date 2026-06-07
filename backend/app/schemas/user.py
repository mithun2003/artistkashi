import uuid

from fastapi_users import schemas
from pydantic import BaseModel

from app.schemas.address import AddressRead


class UserRead(schemas.BaseUser[uuid.UUID]):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None
    addresses: list[AddressRead] | None = None


class PublicUserRead(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None = None
    role: str | None = None


class UserCreate(schemas.BaseUserCreate):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None


class UserUpdate(schemas.BaseUserUpdate):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None
