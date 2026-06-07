"""Exception handlers and middleware."""

import logging
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.responses import Response

from app.core.exceptions import AppException, ErrorCode
from app.schemas.responses import ErrorResponse, Meta

logger = logging.getLogger(__name__)


HTTP_ERROR_MESSAGES = {
    "LOGIN_BAD_CREDENTIALS": "Invalid email or password",
    "LOGIN_USER_NOT_VERIFIED": "User is not verified",
    "REGISTER_USER_ALREADY_EXISTS": "User already exists",
    "REGISTER_INVALID_PASSWORD": "Invalid password",
    "RESET_PASSWORD_BAD_TOKEN": "Invalid or expired password reset token",
    "VERIFY_USER_BAD_TOKEN": "Invalid or expired verification token",
}


def _format_validation_message(error: dict) -> str:
    """Convert Pydantic validation errors into user-friendly messages."""

    error_type = error["type"]
    field = str(error["loc"][-1])
    context = error.get("ctx") or {}

    if error_type == "value_error" and field == "email":
        return "Invalid email address"

    if error_type == "string_too_short":
        minimum = context.get("min_length")
        if minimum is not None:
            return (
                f"{field.replace('_', ' ').title()} "
                f"must be at least {minimum} characters"
            )

    message = error["msg"]

    if message.startswith("Value error, "):
        return message.removeprefix("Value error, ")

    return message


def _format_http_error(
    detail: object,
) -> tuple[str, str, dict[str, object] | None]:
    """Normalize HTTPException details."""

    if isinstance(detail, dict):
        raw_code = detail.get("code")
        error_code = raw_code if isinstance(raw_code, str) else "HTTP_ERROR"

        reasons = detail.get("reason")

        errors = {"password": reasons} if isinstance(reasons, list) else None

        message = HTTP_ERROR_MESSAGES.get(
            error_code,
            str(detail.get("detail", detail)),
        )

        return message, error_code, errors

    if isinstance(detail, str):
        if detail in HTTP_ERROR_MESSAGES:
            return (
                HTTP_ERROR_MESSAGES[detail],
                detail,
                None,
            )

        return detail, "HTTP_ERROR", None

    return str(detail), "HTTP_ERROR", None


def build_error_response(
    *,
    status_code: int,
    message: str,
    error_code: str,
    errors: dict[str, object] | None = None,
) -> ErrorResponse:
    """Create a consistent error response."""

    return ErrorResponse(
        success=False,
        status=status_code,
        message=message,
        error_code=error_code,
        errors=errors,
        meta=Meta(),
    )


def setup_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers."""

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request,
        exc: AppException,
    ):
        logger.warning(
            "%s - %s",
            exc.error_code,
            exc.message,
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
        request: Request,
        exc: RequestValidationError,
    ):
        validation_errors: dict[str, list[str]] = {}

        for error in exc.errors():
            field = (
                ".".join(str(i) for i in error["loc"][1:])
                if len(error["loc"]) > 1
                else str(error["loc"][0])
            )

            validation_errors.setdefault(field, []).append(
                _format_validation_message(error)
            )

        response = build_error_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message="Validation failed",
            error_code=ErrorCode.VALIDATION_ERROR,
            errors=validation_errors,
        )

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=response.model_dump(mode="json"),
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):
        message, error_code, errors = _format_http_error(exc.detail)

        response = build_error_response(
            status_code=exc.status_code,
            message=message,
            error_code=error_code,
            errors=errors,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content=response.model_dump(mode="json"),
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception,
    ):
        logger.exception(
            "Unhandled exception",
            extra={
                "path": request.url.path,
                "method": request.method,
                "error_type": type(exc).__name__,
            },
        )

        response = build_error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="An unexpected error occurred",
            error_code=ErrorCode.INTERNAL_ERROR,
        )

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=response.model_dump(mode="json"),
        )


async def log_request_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Log incoming requests."""

    logger.info(
        "%s %s",
        request.method,
        request.url.path,
        extra={
            "method": request.method,
            "path": request.url.path,
            "query": str(request.url.query),
        },
    )

    return await call_next(request)
