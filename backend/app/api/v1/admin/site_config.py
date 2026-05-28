from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_db
from app.core.auth.users import current_active_user
from app.crud.site_config import crud_site_config
from app.schemas.responses import ResponseModel
from app.schemas.site_config import HomePageConfig

router = APIRouter(tags=["admin-site-config"])


def _check_admin(user: Any) -> None:
    """Check if user is admin/superuser."""
    if not getattr(user, "is_superuser", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")


@router.get("/home", response_model=ResponseModel[HomePageConfig])
async def get_home_page_settings(db=Depends(get_db)):
    # Using the inherited custom method
    config = await crud_site_config.get_home_page_config(db)
    return ResponseModel(message="Operation successful", data=config)


@router.put("/home", response_model=ResponseModel[HomePageConfig])
async def update_home_page_settings(
    config_in: HomePageConfig,
    db=Depends(get_db),
    user: Any = Depends(current_active_user),
):
    _check_admin(user)
    # Check if exists first
    config = await crud_site_config.get(db=db, key="home_page")
    if config:
        await crud_site_config.update(
            db=db,
            key="home_page",
            object={"value": config_in.model_dump()}
        )
    else:
        await crud_site_config.create(
            db=db,
            object={
                "key": "home_page",
                "value": config_in.model_dump(),
                "description": "Main landing page configuration"
            }
        )
    return ResponseModel(message="Operation successful", data=config_in)
