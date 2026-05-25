"""Logging configuration."""

import logging
import logging.config
from pathlib import Path
import os

# Determine whether file logging is possible (serverless like Vercel has read-only filesystem)
LOG_DIR = Path("logs")
_file_logging_available = True
try:
    LOG_DIR.mkdir(exist_ok=True)
    # Test write permission by opening a temp file
    test_path = LOG_DIR / ".write_test"
    with open(test_path, "w") as f:
        f.write("ok")
    test_path.unlink()
except (PermissionError, OSError):
    _file_logging_available = False

# Base handlers always present
_handlers = {
    "console": {
        "class": "logging.StreamHandler",
        "level": "DEBUG",
        "formatter": "default",
        "stream": "ext://sys.stdout",
    }
}

# Add file handlers only when writable
if _file_logging_available:
    _handlers.update(
        {
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "detailed",
                "filename": str(LOG_DIR / "app.log"),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "detailed",
                "filename": str(LOG_DIR / "errors.log"),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
            },
        }
    )

# Choose handlers for loggers depending on availability
_app_handlers = ["console"] + (["file", "error_file"] if _file_logging_available else [])
_root_handlers = ["console"] + (["file"] if _file_logging_available else [])

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s",
        },
    },
    "handlers": _handlers,
    "loggers": {
        "app": {
            "level": "DEBUG",
            "handlers": _app_handlers,
            "propagate": False,
        },
        "uvicorn": {
            "level": "INFO",
            "handlers": _root_handlers,
            "propagate": False,
        },
        "uvicorn.access": {
            "level": "INFO",
            "handlers": _root_handlers,
            "propagate": False,
        },
    },
    "root": {
        "level": "INFO",
        "handlers": _root_handlers,
    },
}


def configure_logging() -> None:
    """Configure application logging.

    If file logging isn't available (e.g., on serverless platforms), fall back to console-only logging.
    """
    # On platforms like Vercel the filesystem is read-only at /var/task; avoid failing.
    try:
        logging.config.dictConfig(LOGGING_CONFIG)
    except Exception as exc:
        # As a last resort, configure a simple console logger so the app can start
        logging.basicConfig(level=logging.INFO)
        logging.getLogger("app").warning("Falling back to basic console logging due to: %s", exc)

    logging.getLogger("app").info("Logging configured successfully")


def get_logger(name: str) -> logging.Logger:
    """Get logger instance."""
    return logging.getLogger(f"app.{name}")
