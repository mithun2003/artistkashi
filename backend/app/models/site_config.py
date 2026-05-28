from sqlalchemy import Column, String, JSON, Boolean
from app.models.base import Base

class SiteConfig(Base):
    """
    Stores global site configuration including home page settings,
    SEO metadata, and platform-wide constants.
    """
    __tablename__ = "site_config"
    
    key = Column(String(50), primary_key=True, index=True)
    value = Column(JSON, nullable=False)
    description = Column(String(255), nullable=True)
    is_public = Column(Boolean, default=True)
