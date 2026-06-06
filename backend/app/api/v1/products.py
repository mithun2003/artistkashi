from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from fastcrud import compute_offset, paginated_response

from app.api.dependencies import DatabaseDep
from app.crud.product import crud_product
from app.schemas.product import ProductRead
from app.schemas.responses import PaginatedResponse, SuccessResponse

router = APIRouter(tags=["products"])


@router.get("/products", response_model=PaginatedResponse[ProductRead])
async def list_products(
    db: DatabaseDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    products_data = await crud_product.get_multi(
        db=db,
        offset=compute_offset(page, page_size),
        limit=page_size,
        return_total_count=True,
    )
    
    return paginated_response(
        crud_data=products_data,
        page=page,
        items_per_page=page_size,
    )


@router.get("/products/{product_id}", response_model=SuccessResponse[ProductRead])
async def get_product(product_id: int, db: DatabaseDep) -> SuccessResponse:
    product = await crud_product.get(db=db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return SuccessResponse(message="Product retrieved successfully", data=product)
