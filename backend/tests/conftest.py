"""Shared pytest fixtures.

Each test gets an isolated in-memory SQLite database (StaticPool so the single
connection is shared across the app's sessions within a test). The ``client``
fixture overrides the ``get_session`` dependency to use it.
"""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.data.db import get_session
from app.main import app
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool


@pytest.fixture(name="session")
def session_fixture() -> Iterator[Session]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session) -> Iterator[TestClient]:
    def get_session_override() -> Iterator[Session]:
        yield session

    app.dependency_overrides[get_session] = get_session_override
    yield TestClient(app)
    app.dependency_overrides.clear()
