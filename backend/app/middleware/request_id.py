# app/middleware/request_id.py

from uuid import uuid4

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.request_id = str(uuid4())

        response = await call_next(request)

        response.headers["X-Request-ID"] = request.state.request_id

        return response
