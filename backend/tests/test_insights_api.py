"""API tests for the insights and exam-date endpoints."""

from __future__ import annotations

from datetime import date, timedelta

from fastapi.testclient import TestClient


def _checkin(
    client: TestClient, *, mood: int, sleep: float = 7.0, triggers: list[str] | None = None
) -> None:
    client.post(
        "/api/checkins",
        json={
            "mood": mood,
            "energy": 3,
            "sleep_hours": sleep,
            "trigger_slugs": triggers or [],
        },
    )


def test_insights_empty_state(client: TestClient) -> None:
    response = client.get("/api/insights")
    assert response.status_code == 200
    body = response.json()
    assert body["total_check_ins"] == 0
    assert body["trend"] == []
    assert body["cards"] == []
    assert body["season"]["active"] is False
    assert "No check-ins yet" in body["summary"]


def test_insights_reflect_checkins(client: TestClient) -> None:
    _checkin(client, mood=2, triggers=["anxious"])
    _checkin(client, mood=4, triggers=["anxious"])
    response = client.get("/api/insights")
    body = response.json()
    assert body["total_check_ins"] == 2
    assert len(body["trend"]) >= 1
    assert body["top_triggers"][0]["slug"] == "anxious"
    assert body["top_triggers"][0]["count"] == 2


def test_exam_date_crud_and_season(client: TestClient) -> None:
    soon = (date.today() + timedelta(days=3)).isoformat()
    created = client.post(
        "/api/exam-dates", json={"label": "JEE Mains", "date": soon, "kind": "exam"}
    )
    assert created.status_code == 201
    exam_id = created.json()["id"]

    listed = client.get("/api/exam-dates").json()
    assert len(listed) == 1

    # The active exam window should now show in insights.
    season = client.get("/api/insights").json()["season"]
    assert season["active"] is True
    assert season["label"] == "Exam season"

    deleted = client.delete(f"/api/exam-dates/{exam_id}")
    assert deleted.status_code == 204
    assert client.get("/api/exam-dates").json() == []


def test_exam_date_rejects_unknown_kind(client: TestClient) -> None:
    response = client.post(
        "/api/exam-dates", json={"label": "X", "date": "2026-07-01", "kind": "birthday"}
    )
    assert response.status_code == 422


def test_delete_unknown_exam_date_404(client: TestClient) -> None:
    assert client.delete("/api/exam-dates/9999").status_code == 404
