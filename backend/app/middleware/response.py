import json
import logging
from datetime import datetime

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class ResponseWrapperMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Proceed with the request
        response = await call_next(request)

        # Only wrap JSON responses (skip docs/openapi)
        content_type = response.headers.get("content-type", "")
        is_json = content_type and "application/json" in content_type
        is_no_content = response.status_code == 204
        is_docs = request.url.path.startswith(("/docs", "/redoc", "/openapi.json"))

        if (is_json or is_no_content) and not is_docs:
            # Read the response body
            body = b""
            if not is_no_content:
                async for chunk in response.body_iterator:
                    body += chunk

            try:
                data = json.loads(body) if body else None

                # Avoid double wrapping: expect wrapper to contain
                # 'success', 'status', 'data', 'meta'
                if (
                    isinstance(data, dict)
                    and "success" in data
                    and "status" in data
                    and "data" in data
                    and "meta" in data
                ):
                    new_body = body
                    status_code = response.status_code
                else:
                    # Determine message
                    message = None
                    if isinstance(data, dict):
                        message = data.get("message")

                    if not message:
                        if 200 <= response.status_code < 300:
                            message = "Operation successful"
                            if request.url.path.endswith("/login"):
                                message = "Login successful"
                            elif request.url.path.endswith("/register"):
                                message = "Registration successful"
                            elif request.url.path.endswith("/logout"):
                                message = "Logged out successfully"
                        else:
                            if isinstance(data, dict):
                                message = (
                                    data.get("message")
                                    or data.get("detail")
                                    or str(data)
                                )
                            else:
                                message = "Request failed"

                    # For 204 responses, we want to return 200 with the wrapper
                    status_code = 200 if is_no_content else response.status_code
                    success = 200 <= status_code < 400

                    wrapped_data = {
                        "success": success,
                        "status": status_code,
                        "message": message,
                        "data": data,
                        "meta": {
                            "timestamp": datetime.now().isoformat() + "Z",
                            "error_code": data.get("meta", {}).get("error_code")
                            if isinstance(data, dict)
                            else None,
                        },
                    }

                    # If it was an error already formatted by error handler,
                    # it might have 'errors' instead of 'data' or both
                    if not success and isinstance(data, dict) and "errors" in data:
                        wrapped_data["errors"] = data["errors"]
                        # If data was just the errors, we might want to set data to None
                        if len(data) == 1 or (len(data) == 2 and "message" in data):
                            wrapped_data["data"] = None

                    new_body = json.dumps(wrapped_data).encode("utf-8")

                # Return a new response with the wrapped body
                headers = dict(response.headers)
                headers["content-length"] = str(len(new_body))
                headers["content-type"] = "application/json"

                return Response(
                    content=new_body,
                    status_code=status_code,
                    headers=headers,
                    media_type="application/json",
                )
            except Exception as e:
                logger.error(f"Error wrapping response: {e}")
                # If anything fails, return original response with the body we read
                return Response(
                    content=body,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    media_type=response.media_type,
                )

        return response
