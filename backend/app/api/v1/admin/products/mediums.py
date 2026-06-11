from fastapi import APIRouter

from app.api.dependencies import DatabaseDep
from app.core.pagination import build_paginated_response
from app.schemas.product import (
    ProductMediumCreate,
    ProductMediumRead,
    ProductMediumUpdate,
)
from app.schemas.responses import PaginatedResponse, SuccessResponse
from app.services.product_service import product_medium_service

router = APIRouter(tags=["Product Mediums"])


@router.post("", response_model=SuccessResponse[ProductMediumRead])
async def create_medium(payload: ProductMediumCreate, session: DatabaseDep):
    medium = await product_medium_service.create_medium(
        session=session, payload=payload
    )

    return SuccessResponse(message="Medium created successfully", data=medium)


@router.get("/{medium_id}", response_model=SuccessResponse[ProductMediumRead])
async def get_medium(medium_id: int, session: DatabaseDep):
    medium = await product_medium_service.get_medium(
        session=session, medium_id=medium_id, check=True
    )

    return SuccessResponse(message="Medium retrieved successfully", data=medium)


@router.get("", response_model=PaginatedResponse[ProductMediumRead])
async def list_mediums(session: DatabaseDep, page: int = 1, page_size: int = 20):
    mediums = await product_medium_service.list_mediums(
        session=session, page=page, page_size=page_size
    )

    return build_paginated_response(
        message="Mediums retrieved successfully",
        result=mediums,
        page=page,
        page_size=page_size,
    )


@router.put("/{medium_id}", response_model=SuccessResponse[ProductMediumRead])
async def update_medium(
    medium_id: int, payload: ProductMediumUpdate, session: DatabaseDep
):
    medium = await product_medium_service.update_medium(
        session=session, medium_id=medium_id, payload=payload
    )

    return SuccessResponse(message="Medium updated successfully", data=medium)


@router.delete("/{medium_id}", response_model=SuccessResponse[None])
async def delete_medium(medium_id: int, session: DatabaseDep):
    await product_medium_service.delete_medium(session=session, medium_id=medium_id)

    return SuccessResponse(message="Medium deleted successfully")
