import json
import logging
import time
from datetime import UTC, datetime
from uuid import uuid4

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import StreamingResponse

logger = logging.getLogger(__name__)


class ResponseWrapperMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()

        # Generate request id
        request.state.request_id = str(uuid4())

        response = await call_next(request)

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        response.headers["X-Process-Time"] = str(duration_ms)
        response.headers["X-Request-ID"] = request.state.request_id

        path = request.url.path

        # Skip docs
        if path.startswith(("/docs", "/redoc", "/openapi.json")):
            return response

        # Skip streaming/file responses
        if isinstance(response, StreamingResponse):
            return response

        # Only process JSON
        content_type = response.headers.get("content-type", "")
        if "application/json" not in content_type:
            return response

        body = b""

        async for chunk in response.body_iterator:
            body += chunk

        try:
            data = json.loads(body) if body else None

            request_id = request.state.request_id

            is_wrapped = (
                isinstance(data, dict) and "success" in data and "status" in data
            )

            if is_wrapped:
                meta = data.get("meta") or {}

                meta["request_id"] = request_id

                if "timestamp" not in meta:
                    meta["timestamp"] = datetime.now(UTC).isoformat()

                data["meta"] = meta

                new_body = json.dumps(data, default=str).encode()

            else:
                success = 200 <= response.status_code < 400

                message = "Operation successful" if success else "Request failed"

                if isinstance(data, dict):
                    message = data.get("message") or data.get("detail") or message

                wrapped = {
                    "success": success,
                    "status": response.status_code,
                    "message": message,
                    "data": data,
                    "meta": {
                        "timestamp": datetime.now(UTC).isoformat(),
                        "request_id": request_id,
                    },
                }

                new_body = json.dumps(wrapped, default=str).encode()

            logger.info(
                "%s %s -> %s (%.2f ms)",
                request.method,
                path,
                response.status_code,
                duration_ms,
                extra={
                    "method": request.method,
                    "path": path,
                    "status_code": response.status_code,
                    "duration_ms": duration_ms,
                    "request_id": request_id,
                },
            )

            headers = dict(response.headers)

            # Prevent:
            # RuntimeError: Response content longer than Content-Length
            headers.pop("content-length", None)

            return Response(
                content=new_body,
                status_code=response.status_code,
                media_type="application/json",
                headers=headers,
            )

        except Exception:
            logger.exception(
                "Failed to wrap response",
                extra={"path": path, "request_id": request.state.request_id},
            )

            headers = dict(response.headers)
            headers.pop("content-length", None)

            return Response(
                content=body,
                status_code=response.status_code,
                media_type="application/json",
                headers=headers,
            )
