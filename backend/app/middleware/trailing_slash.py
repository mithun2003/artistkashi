from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class TrailingSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.scope.get("path", "")

        if path != "/" and path.endswith("/"):
            request.scope["path"] = path.rstrip("/")

        return await call_next(request)
