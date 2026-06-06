from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    title: str
    artist: str
    price: float
    image_url: str | None = None
    category: str | None = None
    description: str | None = None
    stock_quantity: int = 1


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    title: str | None = None
    artist: str | None = None
    price: float | None = None


class ProductRead(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
