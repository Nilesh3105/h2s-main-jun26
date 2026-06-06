"""Insights API: the read-only dashboard surface.

Builds the pure-domain input from persisted rows, computes trend / triggers /
cards, and evaluates result-season mode against today's date.
"""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter

from app.api.deps import SessionDep
from app.data import repository
from app.domain.insights import (
    CheckInData,
    correlation_insights,
    mood_trend,
    summary_text,
    top_triggers,
)
from app.domain.season import ExamDateData, season_status
from app.schemas.insights import InsightsOut

router = APIRouter(tags=["insights"])


@router.get("/insights", response_model=InsightsOut)
def get_insights(session: SessionDep) -> InsightsOut:
    """Compute the trends dashboard payload from stored check-ins + exam dates."""
    rows = repository.all_check_ins_with_triggers(session)
    checkins = [
        CheckInData(
            created_at=c.created_at,
            mood=c.mood,
            energy=c.energy,
            sleep_hours=c.sleep_hours,
            trigger_slugs=slugs,
        )
        for c, slugs in rows
    ]

    exam_dates = [
        ExamDateData(label=e.label, date=e.date, kind=e.kind)
        for e in repository.list_exam_dates(session)
    ]

    trend = mood_trend(checkins)
    return InsightsOut(
        trend=trend,
        summary=summary_text(trend),
        top_triggers=top_triggers(checkins),
        cards=correlation_insights(checkins),
        season=season_status(exam_dates, date.today()),
        total_check_ins=len(checkins),
    )
