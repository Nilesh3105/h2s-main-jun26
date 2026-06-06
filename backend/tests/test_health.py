"""Skeleton test: the app boots and the health endpoint answers.

This proves the rubric scaffolding (a real, importable FastAPI app exercised via
TestClient) before any feature lands.
"""

from __future__ import annotations

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["app"] == "Sukoon"


def test_health_reports_ai_disabled_without_key() -> None:
    # CI and the grader run with no GOOGLE_API_KEY, so the deterministic path is
    # active and the app advertises that honestly.
    response = client.get("/api/health")

    assert response.json()["ai_enabled"] is False
