"""GenAI assist endpoints: weekly reflection, reframe, prompt, and tag suggestion.

The deterministic layer computes the facts (week stats, valid tags); the AiService
only phrases or suggests, always with a fallback. None of these are on the
check-in hot path. Crisis text is screened before any reframe reaches the LLM.
"""

from __future__ import annotations

from datetime import date, timedelta

from fastapi import APIRouter

from app.ai.fallbacks import WeekStats
from app.api.deps import AiDep, SessionDep
from app.data import repository
from app.domain.crisis import screen_text
from app.domain.insights import CheckInData, mood_trend, top_triggers
from app.domain.triggers import get_trigger
from app.schemas.assist import (
    PromptOut,
    ReflectionOut,
    ReframeOut,
    ReframeRequest,
    TagsOut,
    TagsRequest,
)
from app.schemas.checkin import TriggerOut

router = APIRouter(tags=["assist"])

SHORT_SLEEP = 6.0
MEANINGFUL_GAP = 0.5


def _monday(day: date) -> date:
    return day - timedelta(days=day.weekday())


def _week_stats(checkins: list[CheckInData]) -> WeekStats:
    """Deterministic summary of a week of check-ins for the reflection."""
    if not checkins:
        return WeekStats(
            check_in_count=0,
            avg_mood=None,
            top_trigger_label=None,
            low_sleep_days=0,
            direction="flat",
        )
    moods = [float(c.mood) for c in checkins]
    avg = round(sum(moods) / len(moods), 1)
    tops = top_triggers(checkins, limit=1)
    low_sleep = sum(1 for c in checkins if c.sleep_hours < SHORT_SLEEP)

    trend = mood_trend(checkins)
    direction = "flat"
    if len(trend) >= 4:
        mid = len(trend) // 2
        first = sum(p.mood for p in trend[:mid]) / mid
        second = sum(p.mood for p in trend[mid:]) / (len(trend) - mid)
        delta = second - first
        direction = (
            "up" if delta >= MEANINGFUL_GAP else "down" if delta <= -MEANINGFUL_GAP else "steady"
        )

    return WeekStats(
        check_in_count=len(checkins),
        avg_mood=avg,
        top_trigger_label=tops[0].label if tops else None,
        low_sleep_days=low_sleep,
        direction=direction,
    )


@router.get("/reflection", response_model=ReflectionOut)
def get_reflection(session: SessionDep, ai: AiDep) -> ReflectionOut:
    """Return this week's reflection (AI when available, else template; AI cached)."""
    week_start = _monday(date.today())

    cached = repository.get_reflection(session, week_start)
    if cached is not None:
        return ReflectionOut(week_start=week_start, body=cached.body, source=cached.source)

    rows = repository.all_check_ins_with_triggers(session)
    week_checkins = [
        CheckInData(
            created_at=c.created_at,
            mood=c.mood,
            energy=c.energy,
            sleep_hours=c.sleep_hours,
            trigger_slugs=slugs,
        )
        for c, slugs in rows
        if c.created_at.date() >= week_start
    ]

    result = ai.reflect_week(_week_stats(week_checkins))
    # Cache only the (expensive) AI result; templates are cheap to recompute and
    # stay fresh, so adding a key later starts producing AI reflections.
    if result.source == "ai":
        repository.save_reflection(
            session, week_start=week_start, body=result.body, source=result.source
        )
    return ReflectionOut(week_start=week_start, body=result.body, source=result.source)


@router.post("/assist/reframe", response_model=ReframeOut)
def suggest_reframe(payload: ReframeRequest, ai: AiDep) -> ReframeOut:
    """Suggest a gentle reframe for an anxious thought (crisis-screened first)."""
    result = ai.suggest_reframe(payload.thought)
    return ReframeOut(reframe=result.reframe, source=result.source, crisis=result.crisis)


@router.get("/assist/prompt", response_model=PromptOut)
def suggest_prompt(session: SessionDep, ai: AiDep) -> PromptOut:
    """A context-aware journaling sentence-starter."""
    recent = repository.list_check_ins(session, limit=1)
    recent_mood = recent[0].mood if recent else None
    result = ai.suggest_prompt(recent_mood)
    return PromptOut(prompt=result.prompt, source=result.source)


@router.post("/assist/tags", response_model=TagsOut)
def suggest_tags(payload: TagsRequest, ai: AiDep) -> TagsOut:
    """Suggest trigger tags from a free note for the user to confirm."""
    crisis = screen_text(payload.note).detected
    result = ai.suggest_tags(payload.note)
    triggers = [
        TriggerOut(slug=t.slug, label=t.label, category=t.category)
        for slug in result.slugs
        if (t := get_trigger(slug)) is not None
    ]
    return TagsOut(triggers=triggers, source=result.source, crisis=crisis)
