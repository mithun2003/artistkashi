import uuid

from pydantic import BaseModel, ConfigDict

from app.schemas.course import CourseRead
from app.schemas.product import ProductRead


class CartItemBase(BaseModel):
    product_id: int | None = None
    course_id: int | None = None
    quantity: int = 1


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemRead(CartItemBase):
    id: int
    user_id: uuid.UUID
    product: ProductRead | None = None
    course: CourseRead | None = None

    model_config = ConfigDict(from_attributes=True)
