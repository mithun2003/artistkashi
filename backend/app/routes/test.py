from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["test"])


@router.get("/test")
async def test_check(q: str | None = None):
    """Simple test endpoint that returns status, timestamp, and optional query echo."""
    return {"status": "ok", "now": datetime.utcnow().isoformat() + "Z", "q": q}


@router.get("/test/{name}")
async def test_name(name: str):
    """Return a simple greeting for a path parameter to verify routing."""
    return {"message": f"hello {name}"}
