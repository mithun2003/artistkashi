"""Authentication test and documentation endpoints."""

import logging
from datetime import datetime
from fastapi import APIRouter

from app.api.dependencies import CurrentUserDep

logger = logging.getLogger(__name__)

router = APIRouter(tags=["test"])


@router.get("/test")
async def test_check(q: str | None = None):
    """Simple test endpoint that returns status, timestamp, and optional query echo."""
    return {"status": "ok", "now": datetime.utcnow().isoformat() + "Z", "q": q}


@router.get("/test/{name}")
async def test_name(name: str):
    """Return a simple greeting for a path parameter to verify routing."""
    return {"message": f"hello {name}"}


@router.get("/auth-status")
async def check_auth_status():
    """
    Check authentication system status and endpoints.
    
    Returns:
        Authentication system information and all auth endpoints
    """
    return {
        "status": "active",
        "endpoints": {
            "register": "/auth/register",
            "login": "/auth/jwt/login",
            "logout": "/auth/jwt/logout",
            "request_verify_token": "/auth/request-verify-token",
            "verify": "/auth/verify",
            "forgot_password": "/auth/forgot-password",
            "reset_password": "/auth/reset-password",
            "me": "/users/me",
            "users": "/users",
        },
        "message": "Use these endpoints to manage authentication",
    }


@router.get("/me")
async def get_current_user_info(user: CurrentUserDep):
    """
    Get current authenticated user information.
    
    Requires: Valid JWT token in Authorization header
    
    Returns:
        Current user information including id, email, profile data, and role
    """
    logger.info(f"📋 User info requested: {user.email}")
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "role": user.role,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
    }


@router.get("/create-test-user")
async def create_test_user_endpoint():
    """
    Get test user credentials for testing purposes.
    
    ⚠️ ONLY FOR TESTING - Remove this endpoint in production!
    
    Returns:
        Test user credentials and instructions
    """
    logger.warning("🧪 Test user creation endpoint called")
    return {
        "email": "test@example.com",
        "password": "TestPassword123!",
        "full_name": "Test User",
        "role": "user",
        "note": "Use these credentials to test login/signup flow",
        "instructions": [
            "1. POST /auth/register with the above credentials",
            "2. POST /auth/jwt/login with email and password",
            "3. Use the returned access_token for authenticated requests",
            "4. Include header: Authorization: Bearer {access_token}",
        ],
    }
