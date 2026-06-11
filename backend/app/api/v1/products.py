from fastapi import APIRouter

from app.api.dependencies import DatabaseDep
from app.schemas.responses import SuccessResponse
from app.services.product_service import (
    product_service,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("")
async def list_products(session: DatabaseDep):
    products = await product_service.list_published_products(db=session)

    return SuccessResponse(message="Products retrieved", data=products)


@router.get("/{slug}")
async def get_product(slug: str, session: DatabaseDep):
    product = await product_service.get_product_by_slug(db=session, slug=slug)

    return SuccessResponse(message="Product retrieved", data=product)
