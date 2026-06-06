"""Liveness endpoint.

Also surfaces whether the GenAI voice layer is active so the frontend can show
the deterministic-vs-personalized state honestly. Never leaks the key itself.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app.settings import get_settings

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    """Shape of the `/api/health` payload."""

    status: str
    app: str
    ai_enabled: bool


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Report liveness and whether GenAI personalization is currently enabled."""
    settings = get_settings()
    return HealthResponse(
        status="ok",
        app=settings.app_name,
        ai_enabled=settings.ai_enabled,
    )
