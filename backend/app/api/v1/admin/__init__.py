from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import CurrentUserDep
from app.core.auth.dependencies import get_current_admin

from . import courses as courses_module
from . import dashboard as dashboard_module
from . import reviews as reviews_module
from . import site_config as site_config_module
from . import users as users_module
from .products import router as products_router

router = APIRouter(
    prefix="/admin", tags=["ADMIN"], dependencies=[Depends(get_current_admin)]
)


@router.get("/stats")
async def admin_stats(user: CurrentUserDep):
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    return {"users": 42, "courses": 7, "products": 13}


router.include_router(site_config_module.router, prefix="/config")
router.include_router(users_module.router)
router.include_router(products_router)
router.include_router(courses_module.router)
router.include_router(dashboard_module.router)
router.include_router(reviews_module.router)
