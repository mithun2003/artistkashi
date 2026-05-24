import uuid
from typing import List, Optional

from pydantic import BaseModel
from fastapi_users import schemas


class AddressRead(BaseModel):
    id: int
    line1: str
    line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    is_default: bool = False


class UserRead(schemas.BaseUser[uuid.UUID]):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    addresses: Optional[List[AddressRead]] = None


class UserCreate(schemas.BaseUserCreate):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
