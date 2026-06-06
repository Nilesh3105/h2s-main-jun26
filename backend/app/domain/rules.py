"""The rules engine: a check-in → one matched micro-intervention.

This is the "deterministic brain". It is a pure function with no I/O, so it is
instant, trivially testable, and works with no API key. GenAI (Milestone 5) only
rephrases the rationale warmly — it never changes the decision made here.

Scoring model: every selected trigger nudges its ``suggests`` technique, and the
numeric mood / energy / sleep signals add their own weight. The highest-scoring
technique wins; ties break by a fixed clinical-priority order so the result is
deterministic for any input.
"""

from __future__ import annotations

from collections.abc import Sequence

from pydantic import BaseModel

from app.domain.interventions import INTERVENTIONS, Technique
from app.domain.triggers import resolve_triggers

# Thresholds (1-5 scales; sleep in hours). Named so the intent is legible.
LOW_MOOD = 2  # mood <= 2 → notable low mood
LOW_ENERGY = 2  # energy <= 2 → notably depleted
SHORT_SLEEP = 6.0  # < 6h is a strong distress predictor (research/01)
VERY_SHORT_SLEEP = 5.0

# Weights.
TRIGGER_WEIGHT = 2.0
NUMERIC_WEIGHT = 1.0

# Deterministic tie-break: earlier = preferred when scores are equal. Acute
# self-regulation (breathing) first; gentle grounding is the catch-all last.
PRIORITY: tuple[Technique, ...] = (
    Technique.BREATHING,
    Technique.THOUGHT_RECORD,
    Technique.BEHAVIORAL_ACTIVATION,
    Technique.SLEEP_WINDDOWN,
    Technique.GROUNDING,
)


class Recommendation(BaseModel):
    """The matched intervention plus a deterministic, transparent rationale."""

    technique: Technique
    title: str
    rationale: str
    why_it_helps: str
    source: str
    factors: list[str]


def _score(
    *, mood: int, energy: int, sleep_hours: float, trigger_slugs: Sequence[str]
) -> tuple[dict[Technique, float], list[str]]:
    """Accumulate per-technique scores and a human list of contributing factors."""
    scores: dict[Technique, float] = dict.fromkeys(Technique, 0.0)
    factors: list[str] = []

    for trigger in resolve_triggers(list(trigger_slugs)):
        scores[trigger.suggests] += TRIGGER_WEIGHT
        factors.append(trigger.label.lower())

    if mood <= LOW_MOOD:
        scores[Technique.BREATHING] += NUMERIC_WEIGHT
        scores[Technique.THOUGHT_RECORD] += NUMERIC_WEIGHT * 0.5
        factors.append("a low mood today")
    if energy <= LOW_ENERGY:
        scores[Technique.BEHAVIORAL_ACTIVATION] += NUMERIC_WEIGHT
        factors.append("low energy")
    if sleep_hours < SHORT_SLEEP:
        scores[Technique.SLEEP_WINDDOWN] += NUMERIC_WEIGHT
        factors.append("short sleep")
    if sleep_hours < VERY_SHORT_SLEEP:
        scores[Technique.SLEEP_WINDDOWN] += NUMERIC_WEIGHT * 0.5

    return scores, factors


def _pick(scores: dict[Technique, float]) -> Technique:
    """Choose the top-scoring technique; fall back to grounding when all zero."""
    best = max(scores.values())
    if best <= 0.0:
        return Technique.GROUNDING
    # Among ties, the earliest in PRIORITY wins (deterministic).
    return next(t for t in PRIORITY if scores[t] == best)


def _rationale(technique: Technique, factors: list[str]) -> str:
    """Build a calm, deterministic rationale sentence (GenAI personalises later)."""
    info = INTERVENTIONS[technique]
    if not factors:
        return f"Whenever you want a reset, {info.title.lower()} is a gentle place to start."

    # De-duplicate while preserving order, then phrase as a short list.
    seen: list[str] = []
    for f in factors:
        if f not in seen:
            seen.append(f)
    if len(seen) == 1:
        cues = seen[0]
    elif len(seen) == 2:
        cues = f"{seen[0]} and {seen[1]}"
    else:
        cues = f"{', '.join(seen[:-1])}, and {seen[-1]}"
    return f"Because of {cues}, {info.title.lower()} might help right now."


def recommend(
    *, mood: int, energy: int, sleep_hours: float, trigger_slugs: Sequence[str]
) -> Recommendation:
    """Match a check-in to one micro-intervention. Pure and deterministic."""
    scores, factors = _score(
        mood=mood, energy=energy, sleep_hours=sleep_hours, trigger_slugs=trigger_slugs
    )
    technique = _pick(scores)
    info = INTERVENTIONS[technique]
    return Recommendation(
        technique=technique,
        title=info.title,
        rationale=_rationale(technique, factors),
        why_it_helps=info.why_it_helps,
        source=info.source,
        factors=factors,
    )
