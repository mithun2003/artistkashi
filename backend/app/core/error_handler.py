"""Exception handlers and error middleware."""

import logging
from collections.abc import Awaitable, Callable
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.responses import Response

from app.core.exceptions import AppException
from app.schemas.responses import ErrorResponseModel, MetaModel

logger = logging.getLogger(__name__)


def setup_exception_handlers(app: FastAPI) -> None:
    """Setup global exception handlers."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        """Handle custom application exceptions."""
        logger.warning(
            f"AppException: {exc.error_code} - {exc.message}",
            extra={
                "path": request.url.path,
                "method": request.method,
                "status_code": exc.status_code,
            },
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict(),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ):
        """Handle FastAPI validation errors."""
        errors = {}
        for error in exc.errors():
            loc = (
                ".".join(str(i) for i in error["loc"][1:])
                if len(error["loc"]) > 1
                else error["loc"][0]
            )
            if loc not in errors:
                errors[loc] = []
            errors[loc].append(error["msg"])

        response_content = ErrorResponseModel(
            success=False,
            message="Validation error",
            errors=errors,
            meta=MetaModel(timestamp=datetime.utcnow()),
        ).model_dump()

        # Ensure timestamp is string for JSON
        response_content["meta"]["timestamp"] = (
            response_content["meta"]["timestamp"].isoformat() + "Z"
        )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=response_content,
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle standard HTTP exceptions."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "errors": None,
                "meta": {
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "error_code": "HTTP_ERROR",
                },
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle unexpected exceptions."""
        logger.error(
            f"Unexpected error: {str(exc)}",
            extra={
                "path": request.url.path,
                "method": request.method,
                "error_type": type(exc).__name__,
            },
            exc_info=True,
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "An unexpected error occurred",
                "errors": None,
                "meta": {
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "error_code": "INTERNAL_SERVER_ERROR",
                },
            },
        )


async def log_request_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    """Middleware to log all requests."""
    logger.info(
        f"{request.method} {request.url.path}",
        extra={
            "method": request.method,
            "path": request.url.path,
            "query": str(request.url.query),
        },
    )
    response = await call_next(request)
    return response
