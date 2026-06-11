from fastapi import APIRouter

from app.api.dependencies import DatabaseDep
from app.core.pagination import build_paginated_response
from app.schemas.product import (
    ProductCategoryCreate,
    ProductCategoryRead,
    ProductCategoryUpdate,
)
from app.schemas.responses import PaginatedResponse, SuccessResponse
from app.services.product_service import product_category_service

router = APIRouter(tags=["Product Categories"])


@router.post("", response_model=SuccessResponse[ProductCategoryRead])
async def create_category(payload: ProductCategoryCreate, session: DatabaseDep):
    category = await product_category_service.create_category(
        session=session, payload=payload
    )

    return SuccessResponse(message="Category created successfully", data=category)


@router.get("/{category_id}", response_model=SuccessResponse[ProductCategoryRead])
async def get_category(category_id: int, session: DatabaseDep):
    category = await product_category_service.get_category(
        session=session, category_id=category_id, check=True
    )

    return SuccessResponse(message="Category retrieved successfully", data=category)


@router.get("", response_model=PaginatedResponse[ProductCategoryRead])
async def list_categories(session: DatabaseDep, page: int = 1, page_size: int = 20):
    categories = await product_category_service.list_categories(
        session=session, page=page, page_size=page_size
    )

    return build_paginated_response(
        result=categories,
        page=page,
        page_size=page_size,
        message="Categories retrieved successfully",
    )


@router.put("/{category_id}", response_model=SuccessResponse[ProductCategoryRead])
async def update_category(
    category_id: int, payload: ProductCategoryUpdate, session: DatabaseDep
):
    category = await product_category_service.update_category(
        session=session, category_id=category_id, payload=payload
    )

    return SuccessResponse(message="Category updated successfully", data=category)


@router.delete("/{category_id}", response_model=SuccessResponse[None])
async def delete_category(category_id: int, session: DatabaseDep):
    await product_category_service.delete_category(
        session=session, category_id=category_id
    )

    return SuccessResponse(message="Category deleted successfully")
