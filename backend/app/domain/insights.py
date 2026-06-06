"""Insight computations: mood trend, top triggers, and correlation cards.

All pure functions over plain value objects — no DB, no clock. The API builds
the input list from persisted rows and stamps "today" in. Insights only fire
once there is enough data to say something honest, and the phrasings are gentle
and non-clinical (GenAI may warm them up later; it never invents the numbers).
"""

from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime

from pydantic import BaseModel

from app.domain.triggers import get_trigger

# Don't draw inferences from a handful of points.
MIN_FOR_CARDS = 4
SHORT_SLEEP = 6.0
MEANINGFUL_MOOD_GAP = 0.5

MOOD_WORDS = {1: "very low", 2: "low", 3: "okay", 4: "good", 5: "great"}


class CheckInData(BaseModel):
    """The slice of a check-in the insight engine needs."""

    created_at: datetime
    mood: int
    energy: int
    sleep_hours: float
    trigger_slugs: list[str]


class TrendPoint(BaseModel):
    date: str  # ISO date (YYYY-MM-DD)
    mood: float
    count: int


class TriggerCount(BaseModel):
    slug: str
    label: str
    count: int


class InsightCard(BaseModel):
    title: str
    detail: str
    tone: str  # "positive" | "watch" | "neutral"


def _avg(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _mood_word(mood: float) -> str:
    return MOOD_WORDS.get(round(mood), "okay")


def mood_trend(checkins: list[CheckInData]) -> list[TrendPoint]:
    """Average mood per calendar day, oldest first."""
    by_day: dict[str, list[int]] = defaultdict(list)
    for c in checkins:
        by_day[c.created_at.date().isoformat()].append(c.mood)
    return [
        TrendPoint(date=day, mood=round(_avg([float(m) for m in moods]), 2), count=len(moods))
        for day, moods in sorted(by_day.items())
    ]


def top_triggers(checkins: list[CheckInData], *, limit: int = 5) -> list[TriggerCount]:
    """Most-tagged triggers, with their human labels, most frequent first."""
    counter: Counter[str] = Counter()
    for c in checkins:
        counter.update(c.trigger_slugs)
    result: list[TriggerCount] = []
    # Sort by count desc, then slug asc for determinism.
    for slug, count in sorted(counter.items(), key=lambda kv: (-kv[1], kv[0])):
        trigger = get_trigger(slug)
        if trigger is None:
            continue
        result.append(TriggerCount(slug=slug, label=trigger.label, count=count))
    return result[:limit]


def _sleep_card(checkins: list[CheckInData]) -> InsightCard | None:
    short = [float(c.mood) for c in checkins if c.sleep_hours < SHORT_SLEEP]
    rested = [float(c.mood) for c in checkins if c.sleep_hours >= SHORT_SLEEP]
    if len(short) < 2 or len(rested) < 2:
        return None
    gap = _avg(rested) - _avg(short)
    if gap >= MEANINGFUL_MOOD_GAP:
        return InsightCard(
            title="Sleep seems to matter for you",
            detail=(
                f"On nights you slept under 6 hours, your mood averaged {_avg(short):.1f} — "
                f"about {gap:.1f} lower than when you slept more. Protecting sleep might help."
            ),
            tone="watch",
        )
    return None


def _trigger_card(checkins: list[CheckInData]) -> InsightCard | None:
    counter: Counter[str] = Counter()
    for c in checkins:
        counter.update(set(c.trigger_slugs))
    if not counter:
        return None
    slug, count = counter.most_common(1)[0]
    if count < 2:
        return None
    with_it = [float(c.mood) for c in checkins if slug in c.trigger_slugs]
    without_it = [float(c.mood) for c in checkins if slug not in c.trigger_slugs]
    if len(with_it) < 2 or len(without_it) < 2:
        return None
    gap = _avg(without_it) - _avg(with_it)
    trigger = get_trigger(slug)
    if trigger is None or gap < MEANINGFUL_MOOD_GAP:
        return None
    return InsightCard(
        title=f"“{trigger.label}” tends to weigh on you",
        detail=(
            f"Your mood is about {gap:.1f} lower on the days you tag “{trigger.label.lower()}”. "
            "Naming it is the first step to handling it."
        ),
        tone="watch",
    )


def _direction_card(trend: list[TrendPoint]) -> InsightCard | None:
    if len(trend) < 4:
        return None
    mid = len(trend) // 2
    first = _avg([p.mood for p in trend[:mid]])
    second = _avg([p.mood for p in trend[mid:]])
    delta = second - first
    if delta >= MEANINGFUL_MOOD_GAP:
        return InsightCard(
            title="Things are looking up",
            detail="Your mood has been trending upward across your recent check-ins. Nice work.",
            tone="positive",
        )
    if delta <= -MEANINGFUL_MOOD_GAP:
        return InsightCard(
            title="A gentle heads-up",
            detail=(
                "Your mood has dipped a little lately. That's worth noticing — be kind to "
                "yourself, and the help button is always there."
            ),
            tone="watch",
        )
    return None


def correlation_insights(checkins: list[CheckInData]) -> list[InsightCard]:
    """Deterministic, guarded insight cards. Empty until there's enough data."""
    if len(checkins) < MIN_FOR_CARDS:
        return []
    trend = mood_trend(checkins)
    cards = [_sleep_card(checkins), _trigger_card(checkins), _direction_card(trend)]
    return [c for c in cards if c is not None]


def summary_text(trend: list[TrendPoint]) -> str:
    """A plain-language summary — the text alternative for the trend chart."""
    if not trend:
        return "No check-ins yet. Your mood trend will appear here once you start."
    days = len(trend)
    latest = trend[-1].mood
    base = (
        f"You've checked in across {days} day{'s' if days != 1 else ''}. "
        f"Your most recent mood was {_mood_word(latest)}."
    )
    if days >= 4:
        mid = days // 2
        delta = _avg([p.mood for p in trend[mid:]]) - _avg([p.mood for p in trend[:mid]])
        if delta >= MEANINGFUL_MOOD_GAP:
            return base + " Overall it's been trending upward."
        if delta <= -MEANINGFUL_MOOD_GAP:
            return base + " It's dipped a little recently."
        return base + " Overall it's been fairly steady."
    return base
