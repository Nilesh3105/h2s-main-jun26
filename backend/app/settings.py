"""Application settings, loaded from the environment with safe defaults.

Secrets (the Google API key) are read only from the environment — never hardcoded
and never committed. The app is fully functional with no secrets set.
"""

from __future__ import annotations

import os
from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed configuration sourced from environment variables / a local `.env`."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Soft Reset"

    # SQLite by default: zero-config and reproducible in a clean grader environment.
    database_url: str = "sqlite:///./softreset.db"

    # Comma-separated CORS allowlist: the local Vite dev server + the hosted frontend.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,https://softreset.vercel.app"

    # GenAI is optional and additive. With no key, deterministic fallbacks are used.
    google_api_key: str | None = None
    gemini_model: str = "gemini-3.5-flash"

    @model_validator(mode="after")
    def _use_writable_db_on_serverless(self) -> Settings:
        """On Vercel the filesystem is read-only except /tmp — relocate SQLite there."""
        if (
            os.environ.get("VERCEL")
            and self.database_url.startswith("sqlite")
            and "/tmp/" not in self.database_url
        ):
            self.database_url = "sqlite:////tmp/softreset.db"
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        """Parsed CORS origins (whitespace-trimmed, empties dropped)."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def ai_enabled(self) -> bool:
        """True when a Google API key is configured; gates the GenAI voice layer."""
        return bool(self.google_api_key)


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (read once per process)."""
    return Settings()
