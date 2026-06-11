from fastapi import APIRouter

from app.api.dependencies import DatabaseDep
from app.core.pagination import build_paginated_response
from app.schemas.product import VariantTypeCreate, VariantTypeRead, VariantTypeUpdate
from app.schemas.responses import PaginatedResponse, SuccessResponse
from app.services.product_service import variant_type_service

router = APIRouter(tags=["Variant Types"])


@router.post("", response_model=SuccessResponse[VariantTypeRead])
async def create_variant_type(payload: VariantTypeCreate, session: DatabaseDep):
    variant_type = await variant_type_service.create_variant_type(
        session=session, payload=payload
    )

    return SuccessResponse(
        message="Variant type created successfully", data=variant_type
    )


@router.get("/{variant_type_id}", response_model=SuccessResponse[VariantTypeRead])
async def get_variant_type(variant_type_id: int, session: DatabaseDep):
    variant_type = await variant_type_service.get_variant_type(
        session=session, variant_type_id=variant_type_id, check=True
    )

    return SuccessResponse(
        message="Variant type retrieved successfully", data=variant_type
    )


@router.get("", response_model=PaginatedResponse[VariantTypeRead])
async def list_variant_types(session: DatabaseDep, page: int = 1, page_size: int = 20):
    variant_types = await variant_type_service.list_variant_types(
        session=session, page=page, page_size=page_size
    )

    return build_paginated_response(
        message="Variant types retrieved successfully",
        result=variant_types,
        page=page,
        page_size=page_size,
    )


@router.put("/{variant_type_id}", response_model=SuccessResponse[VariantTypeRead])
async def update_variant_type(
    variant_type_id: int, payload: VariantTypeUpdate, session: DatabaseDep
):
    variant_type = await variant_type_service.update_variant_type(
        session=session, variant_type_id=variant_type_id, payload=payload
    )

    return SuccessResponse(
        message="Variant type updated successfully", data=variant_type
    )


@router.delete("/{variant_type_id}", response_model=SuccessResponse[None])
async def delete_variant_type(variant_type_id: int, session: DatabaseDep):
    await variant_type_service.delete_variant_type(
        session=session, variant_type_id=variant_type_id
    )

    return SuccessResponse(message="Variant type deleted successfully")
