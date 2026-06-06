"""Tests for the pure insight computations."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from app.domain.insights import (
    CheckInData,
    correlation_insights,
    mood_trend,
    summary_text,
    top_triggers,
)


def _checkin(
    *,
    days_ago: int = 0,
    mood: int = 3,
    energy: int = 3,
    sleep: float = 7.0,
    triggers: list[str] | None = None,
) -> CheckInData:
    return CheckInData(
        created_at=datetime(2026, 6, 6, 12, 0, tzinfo=UTC) - timedelta(days=days_ago),
        mood=mood,
        energy=energy,
        sleep_hours=sleep,
        trigger_slugs=triggers or [],
    )


def test_mood_trend_averages_per_day_oldest_first() -> None:
    checkins = [
        _checkin(days_ago=1, mood=2),
        _checkin(days_ago=1, mood=4),  # same day → avg 3
        _checkin(days_ago=0, mood=5),
    ]
    trend = mood_trend(checkins)
    assert len(trend) == 2
    assert trend[0].mood == 3.0
    assert trend[0].count == 2
    assert trend[-1].mood == 5.0


def test_top_triggers_counts_and_resolves_labels() -> None:
    checkins = [
        _checkin(triggers=["anxious", "poor-sleep"]),
        _checkin(triggers=["anxious"]),
    ]
    top = top_triggers(checkins)
    assert top[0].slug == "anxious"
    assert top[0].count == 2
    assert top[0].label  # resolved from the catalog


def test_top_triggers_ignores_unknown_slugs() -> None:
    top = top_triggers([_checkin(triggers=["not-real"])])
    assert top == []


def test_no_cards_below_minimum() -> None:
    assert correlation_insights([_checkin(), _checkin()]) == []


def test_sleep_card_fires_when_short_sleep_tracks_low_mood() -> None:
    checkins = [
        _checkin(days_ago=4, mood=2, sleep=4.5),
        _checkin(days_ago=3, mood=2, sleep=5.0),
        _checkin(days_ago=2, mood=5, sleep=8.0),
        _checkin(days_ago=1, mood=4, sleep=7.5),
    ]
    cards = correlation_insights(checkins)
    assert any("Sleep" in c.title for c in cards)


def test_summary_text_handles_empty_and_steady() -> None:
    assert "No check-ins yet" in summary_text([])
    trend = mood_trend([_checkin(days_ago=d, mood=3) for d in range(4)])
    assert "steady" in summary_text(trend).lower()


def test_direction_card_detects_upward_trend() -> None:
    checkins = [
        _checkin(days_ago=5, mood=2),
        _checkin(days_ago=4, mood=2),
        _checkin(days_ago=1, mood=5),
        _checkin(days_ago=0, mood=5),
    ]
    cards = correlation_insights(checkins)
    assert any(c.tone == "positive" for c in cards)
