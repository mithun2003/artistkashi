import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from app.middleware.response import ResponseWrapperMiddleware
from app.schemas.responses import PaginatedResponse, Pagination


@pytest.mark.asyncio
async def test_paginated_response_is_not_wrapped_twice():
    app = FastAPI()
    app.add_middleware(ResponseWrapperMiddleware)

    @app.get("/users")
    async def users():
        return PaginatedResponse(
            message="Users retrieved successfully",
            data=[
                {
                    "id": "a2f26355-e0ce-439e-b909-aeb5f2f9e8d2",
                    "email": "admin@gmail.com",
                }
            ],
            pagination=Pagination(
                page=1,
                page_size=20,
                total_items=1,
                total_pages=1,
                has_next=False,
                has_prev=False,
            ),
        )

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/users")

    body = response.json()
    assert body["success"] is True
    assert body["message"] == "Users retrieved successfully"
    assert isinstance(body["data"], list)
    assert "pagination" in body
    assert "data" not in body["data"][0]
    assert body["meta"]["request_id"]
