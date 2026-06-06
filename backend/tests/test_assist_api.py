"""API tests for the GenAI assist endpoints (keyless/template path + injected AI)."""

from __future__ import annotations

from app.ai.provider import get_ai
from app.ai.service import AiService
from app.main import app
from fastapi.testclient import TestClient
from langchain_core.language_models.fake_chat_models import FakeListChatModel


def test_reflection_template_path_without_key(client: TestClient) -> None:
    response = client.get("/api/reflection")
    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "template"
    assert body["body"]
    assert "week_start" in body


def test_reflection_uses_and_caches_ai_when_available(client: TestClient) -> None:
    app.dependency_overrides[get_ai] = lambda: AiService(
        FakeListChatModel(responses=["A warm, specific AI reflection."])
    )
    try:
        first = client.get("/api/reflection").json()
        assert first["source"] == "ai"
        assert "warm" in first["body"].lower()

        # Even if the model changes, the cached AI reflection is served for the week.
        app.dependency_overrides[get_ai] = lambda: AiService(
            FakeListChatModel(responses=["a different response"])
        )
        second = client.get("/api/reflection").json()
        assert second["body"] == first["body"]
    finally:
        app.dependency_overrides.pop(get_ai, None)


def test_reframe_endpoint_template(client: TestClient) -> None:
    response = client.post("/api/assist/reframe", json={"thought": "I'll never be good enough"})
    assert response.status_code == 200
    body = response.json()
    assert body["crisis"] is False
    assert body["reframe"]
    assert body["source"] == "template"


def test_reframe_endpoint_flags_crisis(client: TestClient) -> None:
    response = client.post("/api/assist/reframe", json={"thought": "I want to die"})
    assert response.json()["crisis"] is True


def test_reframe_rejects_empty(client: TestClient) -> None:
    assert client.post("/api/assist/reframe", json={"thought": ""}).status_code == 422


def test_prompt_endpoint(client: TestClient) -> None:
    body = client.get("/api/assist/prompt").json()
    assert body["prompt"].endswith("…")
    assert body["source"] == "template"


def test_tags_endpoint_suggests_known_slugs(client: TestClient) -> None:
    response = client.post(
        "/api/assist/tags", json={"note": "I'm so anxious about my exam and can't sleep"}
    )
    assert response.status_code == 200
    body = response.json()
    slugs = {t["slug"] for t in body["triggers"]}
    assert "anxious" in slugs
    assert body["crisis"] is False
