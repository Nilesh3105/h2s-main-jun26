"""Tests for result-season support mode."""

from __future__ import annotations

from datetime import date, timedelta

from app.domain.season import ExamDateData, season_status

TODAY = date(2026, 6, 6)


def test_no_dates_is_inactive() -> None:
    assert season_status([], TODAY).active is False


def test_exam_within_two_weeks_is_active() -> None:
    dates = [ExamDateData(label="JEE Advanced", date=TODAY + timedelta(days=5), kind="exam")]
    status = season_status(dates, TODAY)
    assert status.active is True
    assert status.label == "Exam season"
    assert "5 days" in (status.message or "")


def test_exam_far_away_is_inactive() -> None:
    dates = [ExamDateData(label="NEET", date=TODAY + timedelta(days=60), kind="exam")]
    assert season_status(dates, TODAY).active is False


def test_exam_in_the_past_is_inactive() -> None:
    dates = [ExamDateData(label="Boards", date=TODAY - timedelta(days=1), kind="exam")]
    assert season_status(dates, TODAY).active is False


def test_result_within_a_week_is_active() -> None:
    dates = [ExamDateData(label="Board results", date=TODAY - timedelta(days=2), kind="result")]
    status = season_status(dates, TODAY)
    assert status.active is True
    assert status.label == "Results season"


def test_most_immediate_window_wins() -> None:
    dates = [
        ExamDateData(label="Far exam", date=TODAY + timedelta(days=13), kind="exam"),
        ExamDateData(label="Soon exam", date=TODAY + timedelta(days=2), kind="exam"),
    ]
    status = season_status(dates, TODAY)
    assert "Soon exam" in (status.message or "")
