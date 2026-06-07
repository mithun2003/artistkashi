from math import ceil

from fastcrud.types import GetMultiResponseModel

from app.schemas.responses import (
    PaginatedResponse,
    Pagination,
)


def build_paginated_response[T](
    *,
    result: GetMultiResponseModel[T],
    page: int,
    page_size: int,
    message: str,
) -> PaginatedResponse[T]:

    total_items = result["total_count"]

    total_pages = max(
        1,
        ceil(total_items / page_size),
    )

    return PaginatedResponse(
        message=message,
        data=result["data"],
        pagination=Pagination(
            page=page,
            page_size=page_size,
            total_items=total_items,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        ),
    )
