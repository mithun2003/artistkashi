import json
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ResponseWrapperMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Proceed with the request
        response = await call_next(request)
        
        # We only wrap successful JSON responses that aren't already wrapped
        # Skip for documentation and non-JSON content
        if (
            200 <= response.status_code < 300 
            and response.headers.get("content-type") == "application/json"
            and not request.url.path.startswith(("/docs", "/redoc", "/openapi.json"))
        ):
            # Read the response body
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            
            try:
                data = json.loads(body)
                
                # Check if it's already in the standard format (avoid double wrapping)
                if isinstance(data, dict) and "success" in data and "data" in data and "meta" in data:
                    new_body = body
                else:
                    # Determine message based on path
                    message = "Operation successful"
                    if request.url.path.endswith("/login"):
                        message = "Login successful"
                    elif request.url.path.endswith("/register"):
                        message = "Registration successful"
                    
                    wrapped_data = {
                        "success": True,
                        "message": message,
                        "data": data,
                        "meta": {
                            "timestamp": datetime.utcnow().isoformat() + "Z"
                        }
                    }
                    
                    new_body = json.dumps(wrapped_data).encode("utf-8")
                
                # Return a new response with the wrapped body
                # We need to update Content-Length header as well
                headers = dict(response.headers)
                headers["content-length"] = str(len(new_body))
                
                return Response(
                    content=new_body,
                    status_code=response.status_code,
                    headers=headers,
                    media_type="application/json"
                )
            except Exception as e:
                logger.error(f"Error wrapping response: {e}")
                # If anything fails, return original response with the body we read
                return Response(
                    content=body,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    media_type=response.media_type
                )
        
        return response
