import uuid

from fastapi_users import schemas
from pydantic import BaseModel


class AddressRead(BaseModel):
    id: int
    line1: str
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    phone: str | None = None
    is_default: bool = False


class UserRead(schemas.BaseUser[uuid.UUID]):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None
    addresses: list[AddressRead] | None = None


class UserCreate(schemas.BaseUserCreate):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None


class UserUpdate(schemas.BaseUserUpdate):
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None
