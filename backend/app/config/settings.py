"""Cosmos Platform — Application Settings.

Centralizes all configuration using Pydantic Settings.
Values are loaded from environment variables and .env files.
"""

from functools import lru_cache

from pydantic import Field, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────
    app_name: str = "Cosmos Platform"
    app_version: str = "1.0.0"
    app_env: str = "development"
    debug: bool = True

    # ── Server ───────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000

    # ── PostgreSQL ───────────────────────────
    postgres_user: str = "cosmos"
    postgres_password: str
    postgres_db: str = "cosmos_db"
    postgres_host: str = "db"
    postgres_port: int = 5432

    # ── CORS ─────────────────────────────────
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"]
    )

    # ── Logging ──────────────────────────────
    log_level: str = "INFO"

    # ── JWT Authentication ───────────────────
    jwt_secret_key: str = "super_secret_jwt_access_key_change_me_in_prod_123456789"
    jwt_refresh_secret_key: str = "super_secret_jwt_refresh_key_change_me_in_prod_987654321"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        """Build the async-compatible PostgreSQL DSN."""
        return str(
            PostgresDsn.build(
                scheme="postgresql+asyncpg",
                username=self.postgres_user,
                password=self.postgres_password,
                host=self.postgres_host,
                port=self.postgres_port,
                path=self.postgres_db,
            )
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url_sync(self) -> str:
        """Synchronous DSN used by Alembic."""
        return str(
            PostgresDsn.build(
                scheme="postgresql+psycopg",
                username=self.postgres_user,
                password=self.postgres_password,
                host=self.postgres_host,
                port=self.postgres_port,
                path=self.postgres_db,
            )
        )

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton of the application settings."""
    return Settings()
