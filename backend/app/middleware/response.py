import json
from datetime import UTC, datetime

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class ResponseWrapperMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        path = request.url.path

        if path.startswith(("/docs", "/redoc", "/openapi.json")):
            return response

        content_type = response.headers.get("content-type", "")

        if "application/json" not in content_type:
            return response

        body = b""

        async for chunk in response.body_iterator:
            body += chunk

        try:
            data = json.loads(body) if body else None

            # Already wrapped response
            if (
                isinstance(data, dict)
                and "success" in data
                and "status" in data
                and "meta" in data
            ):
                data.setdefault("meta", {})

                data["meta"]["request_id"] = request.state.request_id

                new_body = json.dumps(data, default=str).encode()

                return Response(
                    content=new_body,
                    status_code=response.status_code,
                    media_type="application/json",
                )

            success = 200 <= response.status_code < 400

            message = "Operation successful"

            if path.endswith("/login"):
                message = "Login successful"

            elif path.endswith("/register"):
                message = "Registration successful"

            elif path.endswith("/logout"):
                message = "Logout successful"

            elif not success:
                if isinstance(data, dict):
                    message = (
                        data.get("message") or data.get("detail") or "Request failed"
                    )
                else:
                    message = "Request failed"

            wrapped = {
                "success": success,
                "status": response.status_code,
                "message": message,
                "data": data,
                "meta": {
                    "timestamp": datetime.now(UTC).isoformat(),
                    "request_id": request.state.request_id,
                },
            }

            new_body = json.dumps(
                wrapped,
                default=str,
            ).encode()

            return Response(
                content=new_body,
                status_code=response.status_code,
                media_type="application/json",
            )

        except Exception:
            return Response(
                content=body,
                status_code=response.status_code,
                media_type="application/json",
            )
