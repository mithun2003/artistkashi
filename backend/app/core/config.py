from typing import Set, Optional, Any
import json
from pydantic import computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "ArtistKashi"
    APP_DESCRIPTION: str = "Cinematic luxury LMS + commerce backend"
    APP_VERSION: str = "0.1.0"
    FRONTEND_URL: str = "http://localhost:3000"

    # Crypt Settings
    ACCESS_SECRET_KEY: str
    RESET_PASSWORD_SECRET_KEY: str
    VERIFICATION_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 3600

    # Database Settings
    DATABASE_URL: str
    TEST_DATABASE_URL: Optional[str] = None
    EXPIRE_ON_COMMIT: bool = False

    # Email Settings
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_SERVER: Optional[str] = None
    MAIL_PORT: Optional[int] = None
    MAIL_FROM_NAME: str = "ArtistKashi"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    TEMPLATE_DIR: str = "email_templates"

    # CORS Settings
    CORS_ORIGINS: Set[str]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> Set[str]:
        if isinstance(v, str) and not v.startswith("["):
            return {item.strip() for item in v.split(",")}
        elif isinstance(v, (list, str)):
            if isinstance(v, str):
                v = json.loads(v)
            return set(v)
        return v

    # Redis Settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    @computed_field
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # OpenAPI Settings
    OPENAPI_URL: str = "/openapi.json"
    OPENAPI_OUTPUT_FILE: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
