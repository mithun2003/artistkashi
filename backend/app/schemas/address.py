from pydantic import BaseModel, ConfigDict


class AddressBase(BaseModel):
    line1: str
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    phone: str | None = None
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    line1: str | None = None
    line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    phone: str | None = None
    is_default: bool | None = None


class AddressRead(AddressBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
