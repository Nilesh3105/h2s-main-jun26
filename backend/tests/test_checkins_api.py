"""API tests for the check-in loop via FastAPI TestClient."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_list_triggers_returns_catalog(client: TestClient) -> None:
    response = client.get("/api/triggers")
    assert response.status_code == 200
    body = response.json()
    assert len(body) >= 12
    sample = body[0]
    assert {"slug", "label", "category"} <= sample.keys()


def test_create_checkin_happy_path(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={
            "mood": 2,
            "energy": 3,
            "sleep_hours": 6.5,
            "note": "Nervous about the exam next week.",
            "trigger_slugs": ["anxious", "exam-approaching"],
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["check_in"]["id"] >= 1
    assert len(body["check_in"]["triggers"]) == 2
    assert body["recommendation"]["technique"] == "breathing"
    assert body["recommendation"]["why_it_helps"]
    assert body["crisis"] is False


def test_create_checkin_flags_crisis_from_note(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={"mood": 1, "energy": 1, "sleep_hours": 4, "note": "I want to die"},
    )
    assert response.status_code == 201
    assert response.json()["crisis"] is True


def test_create_checkin_does_not_flag_idiom(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={"mood": 2, "energy": 2, "sleep_hours": 5, "note": "this exam is killing me"},
    )
    assert response.json()["crisis"] is False


def test_blank_note_is_normalised_to_null(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={"mood": 3, "energy": 3, "sleep_hours": 7, "note": "   "},
    )
    assert response.json()["check_in"]["note"] is None


def test_mood_out_of_range_is_rejected(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={"mood": 9, "energy": 3, "sleep_hours": 7},
    )
    assert response.status_code == 422


def test_unknown_trigger_slug_is_rejected(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={"mood": 3, "energy": 3, "sleep_hours": 7, "trigger_slugs": ["bogus"]},
    )
    assert response.status_code == 422


def test_overlong_note_is_rejected(client: TestClient) -> None:
    response = client.post(
        "/api/checkins",
        json={"mood": 3, "energy": 3, "sleep_hours": 7, "note": "x" * 1001},
    )
    assert response.status_code == 422


def test_checkins_are_read_back_newest_first(client: TestClient) -> None:
    for mood in (1, 5):
        client.post(
            "/api/checkins",
            json={"mood": mood, "energy": 3, "sleep_hours": 7},
        )
    response = client.get("/api/checkins")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 2
    # Newest first: the second insert (mood 5) leads.
    assert body[0]["mood"] == 5


def test_log_intervention_for_checkin(client: TestClient) -> None:
    created = client.post("/api/checkins", json={"mood": 2, "energy": 3, "sleep_hours": 6}).json()
    check_in_id = created["check_in"]["id"]
    response = client.post(
        f"/api/checkins/{check_in_id}/intervention",
        json={"technique": "breathing", "completed": True},
    )
    assert response.status_code == 201
    assert response.json()["status"] == "recorded"


def test_log_intervention_unknown_checkin_404(client: TestClient) -> None:
    response = client.post(
        "/api/checkins/9999/intervention",
        json={"technique": "breathing", "completed": True},
    )
    assert response.status_code == 404
