"""Custom exception classes for the application."""


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_code: str | None = None,
        details: dict[str, object] | None = None,
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "INTERNAL_ERROR"
        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self) -> dict[str, object]:
        from datetime import datetime

        return {
            "success": False,
            "message": self.message,
            "errors": self.details
            if isinstance(self.details, dict) and self.details
            else None,
            "meta": {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "error_code": self.error_code,
            },
        }


class ValidationException(AppException):
    """Raised when validation fails."""

    def __init__(self, message: str, details: dict[str, object] | None = None) -> None:
        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class NotFoundException(AppException):
    """Raised when a resource is not found."""

    def __init__(self, resource: str, identifier: str | int | None = None) -> None:
        message = f"{resource} not found"
        if identifier:
            message += f" (ID: {identifier})"
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND",
        )


class UnauthorizedException(AppException):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Unauthorized") -> None:
        super().__init__(
            message=message,
            status_code=401,
            error_code="UNAUTHORIZED",
        )


class ForbiddenException(AppException):
    """Raised when user lacks permissions."""

    def __init__(self, message: str = "Forbidden") -> None:
        super().__init__(
            message=message,
            status_code=403,
            error_code="FORBIDDEN",
        )


class ConflictException(AppException):
    """Raised when a resource already exists."""

    def __init__(self, message: str, details: dict[str, object] | None = None) -> None:
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT",
            details=details,
        )


class RateLimitException(AppException):
    """Raised when rate limit is exceeded."""

    def __init__(self, message: str = "Rate limit exceeded") -> None:
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
        )


class DatabaseException(AppException):
    """Raised when database operation fails."""

    def __init__(self, message: str, details: dict[str, object] | None = None) -> None:
        super().__init__(
            message=message,
            status_code=500,
            error_code="DATABASE_ERROR",
            details=details,
        )


class ServiceException(AppException):
    """Raised when external service fails."""

    def __init__(self, service: str, message: str) -> None:
        super().__init__(
            message=f"{service} service error: {message}",
            status_code=502,
            error_code="SERVICE_ERROR",
        )
