"""FastAPI application entrypoint.

Thin composition root: builds the app, locks CORS to a configured allowlist, and
wires routers. All real logic lives in `app.domain` (pure) and the routers in
`app.api`.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assist import router as assist_router
from app.api.checkins import router as checkins_router
from app.api.exam_dates import router as exam_dates_router
from app.api.health import router as health_router
from app.api.insights import router as insights_router
from app.data.db import create_db_and_tables
from app.settings import get_settings


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Create database tables on startup (idempotent)."""
    create_db_and_tables()
    yield


def create_app() -> FastAPI:
    """Application factory — keeps construction testable and side-effect free."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description=(
            "A private, research-grounded wellness companion for students navigating "
            "board exams, competitive entrance tests, and result season."
        ),
        version="0.1.0",
        lifespan=lifespan,
    )

    # Lock CORS to an explicit allowlist (no wildcard origins). Credentials are not
    # used — the MVP has no auth — so we keep them off to shrink the attack surface.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["*"],
    )

    app.include_router(health_router, prefix="/api")
    app.include_router(checkins_router, prefix="/api")
    app.include_router(insights_router, prefix="/api")
    app.include_router(exam_dates_router, prefix="/api")
    app.include_router(assist_router, prefix="/api")

    return app


app = create_app()
