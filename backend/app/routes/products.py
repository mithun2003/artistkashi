from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["products"])


class Product(BaseModel):
    id: int | None = None
    name: str
    price: float


_products: dict[int, Product] = {}
_next_product_id = 1


@router.get("/products", response_model=List[Product])
async def list_products():
    return list(_products.values())


@router.post("/products", response_model=Product)
async def create_product(product: Product):
    global _next_product_id
    product.id = _next_product_id
    _products[_next_product_id] = product
    _next_product_id += 1
    return product


@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    product = _products.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
