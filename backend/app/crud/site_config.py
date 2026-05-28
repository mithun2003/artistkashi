from fastcrud import FastCRUD
from app.models.site_config import SiteConfig
from app.schemas.site_config import HomePageConfig
from app.lib.constants import DEFAULT_HOME_PAGE_CONFIG
from sqlalchemy.ext.asyncio import AsyncSession

class SiteConfigCRUD(FastCRUD):
    def __init__(self):
        super().__init__(SiteConfig)

    async def get_home_page_config(self, db: AsyncSession) -> HomePageConfig:
        """Custom helper to get and parse home page config."""
        config = await self.get(db=db, key="home_page")
        if config is None:
            return DEFAULT_HOME_PAGE_CONFIG
        
        # FastCRUD .get returns a row object or dict
        value = config["value"] if isinstance(config, dict) else config.value
        return HomePageConfig.model_validate(value)

crud_site_config = SiteConfigCRUD()
