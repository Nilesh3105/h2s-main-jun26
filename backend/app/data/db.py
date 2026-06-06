"""Database engine and session management.

SQLite by default (zero-config, reproducible). The engine is created once; models
register on `SQLModel.metadata` and tables are created via `create_db_and_tables`.
Domain models arrive in Milestone 2.
"""

from __future__ import annotations

from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from app.settings import get_settings

_settings = get_settings()

# `check_same_thread=False` is required for SQLite under a threaded server.
_connect_args = {"check_same_thread": False} if _settings.database_url.startswith("sqlite") else {}

engine = create_engine(_settings.database_url, echo=False, connect_args=_connect_args)


def create_db_and_tables() -> None:
    """Create all tables registered on the SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a scoped database session."""
    with Session(engine) as session:
        yield session
