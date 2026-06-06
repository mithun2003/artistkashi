from datetime import datetime

import pytest
from fastapi import FastAPI, HTTPException
from httpx import ASGITransport, AsyncClient

from app.core.error_handler import setup_exception_handlers


@pytest.mark.asyncio
async def test_http_exception_response_serializes_timestamp():
    app = FastAPI()
    setup_exception_handlers(app)

    @app.get("/unauthorized")
    async def unauthorized():
        raise HTTPException(status_code=401, detail="Unauthorized")

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/unauthorized")

    assert response.status_code == 401
    body = response.json()
    assert body["message"] == "Unauthorized"
    assert body["meta"]["error_code"] == "HTTP_ERROR"
    datetime.fromisoformat(body["meta"]["timestamp"])
