"""API tests for data export and delete."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_export_is_empty_initially(client: TestClient) -> None:
    body = client.get("/api/data/export").json()
    assert body["check_ins"] == []
    assert body["exam_dates"] == []
    assert "exported_at" in body


def test_export_includes_check_ins_and_dates(client: TestClient) -> None:
    client.post(
        "/api/checkins",
        json={"mood": 3, "energy": 3, "sleep_hours": 7, "trigger_slugs": ["anxious"]},
    )
    client.post("/api/exam-dates", json={"label": "JEE", "date": "2026-07-01", "kind": "exam"})

    body = client.get("/api/data/export").json()
    assert len(body["check_ins"]) == 1
    assert body["check_ins"][0]["triggers"][0]["slug"] == "anxious"
    assert len(body["exam_dates"]) == 1


def test_delete_erases_everything(client: TestClient) -> None:
    client.post("/api/checkins", json={"mood": 2, "energy": 3, "sleep_hours": 6})
    client.post("/api/exam-dates", json={"label": "NEET", "date": "2026-07-01", "kind": "exam"})

    assert client.delete("/api/data").status_code == 204

    body = client.get("/api/data/export").json()
    assert body["check_ins"] == []
    assert body["exam_dates"] == []
    assert client.get("/api/checkins").json() == []
