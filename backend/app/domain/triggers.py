"""The trigger taxonomy — exam-native stressors the user can tag a check-in with.

Code is the source of truth for this fixed, curated catalog (version-controlled,
no seed drift). A check-in references triggers by ``slug`` via a link table.

The taxonomy deliberately spans psychosocial factors (comparison, isolation,
sleep) — not just marks — because those predict distress better than raw scores
(research/01). Each trigger carries a ``suggests`` hint the rules engine weighs.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel

from app.domain.interventions import Technique


class TriggerCategory(StrEnum):
    """High-level grouping for triggers (used to organise the picker UI)."""

    ACADEMIC = "academic"
    SOCIAL = "social"
    PHYSICAL = "physical"
    EMOTIONAL = "emotional"


class Trigger(BaseModel):
    """One taggable stressor."""

    slug: str
    label: str
    category: TriggerCategory
    # The technique this trigger leans toward; the engine combines these with
    # the numeric mood/energy/sleep signals rather than obeying any single one.
    suggests: Technique


TRIGGER_CATALOG: list[Trigger] = [
    # --- Academic ---------------------------------------------------------
    Trigger(
        slug="exam-approaching",
        label="An exam is coming up",
        category=TriggerCategory.ACADEMIC,
        suggests=Technique.BREATHING,
    ),
    Trigger(
        slug="too-much-syllabus",
        label="Too much syllabus, too little time",
        category=TriggerCategory.ACADEMIC,
        suggests=Technique.BEHAVIORAL_ACTIVATION,
    ),
    Trigger(
        slug="bad-mock-score",
        label="A test or mock went badly",
        category=TriggerCategory.ACADEMIC,
        suggests=Technique.THOUGHT_RECORD,
    ),
    Trigger(
        slug="cant-focus",
        label="Can't focus while studying",
        category=TriggerCategory.ACADEMIC,
        suggests=Technique.BEHAVIORAL_ACTIVATION,
    ),
    Trigger(
        slug="procrastinating",
        label="Stuck / putting things off",
        category=TriggerCategory.ACADEMIC,
        suggests=Technique.BEHAVIORAL_ACTIVATION,
    ),
    # --- Social -----------------------------------------------------------
    Trigger(
        slug="peer-comparison",
        label="Comparing myself to others",
        category=TriggerCategory.SOCIAL,
        suggests=Technique.THOUGHT_RECORD,
    ),
    Trigger(
        slug="family-pressure",
        label="Family expectations / pressure",
        category=TriggerCategory.SOCIAL,
        suggests=Technique.THOUGHT_RECORD,
    ),
    Trigger(
        slug="feeling-alone",
        label="Feeling alone / no one to talk to",
        category=TriggerCategory.SOCIAL,
        suggests=Technique.GROUNDING,
    ),
    # --- Physical ---------------------------------------------------------
    Trigger(
        slug="poor-sleep",
        label="Not sleeping enough",
        category=TriggerCategory.PHYSICAL,
        suggests=Technique.SLEEP_WINDDOWN,
    ),
    Trigger(
        slug="always-tired",
        label="Tired / low energy all the time",
        category=TriggerCategory.PHYSICAL,
        suggests=Technique.BEHAVIORAL_ACTIVATION,
    ),
    Trigger(
        slug="not-eating-well",
        label="Not eating well / headaches",
        category=TriggerCategory.PHYSICAL,
        suggests=Technique.GROUNDING,
    ),
    # --- Emotional --------------------------------------------------------
    Trigger(
        slug="anxious",
        label="Anxious or panicky",
        category=TriggerCategory.EMOTIONAL,
        suggests=Technique.BREATHING,
    ),
    Trigger(
        slug="overthinking",
        label="Can't switch off / overthinking",
        category=TriggerCategory.EMOTIONAL,
        suggests=Technique.BREATHING,
    ),
    Trigger(
        slug="self-doubt",
        label="Feeling not good enough",
        category=TriggerCategory.EMOTIONAL,
        suggests=Technique.THOUGHT_RECORD,
    ),
    Trigger(
        slug="hopeless-results",
        label="Hopeless about results",
        category=TriggerCategory.EMOTIONAL,
        suggests=Technique.THOUGHT_RECORD,
    ),
]

# Fast lookups derived once at import.
TRIGGERS_BY_SLUG: dict[str, Trigger] = {t.slug: t for t in TRIGGER_CATALOG}
VALID_TRIGGER_SLUGS: frozenset[str] = frozenset(TRIGGERS_BY_SLUG)


def get_trigger(slug: str) -> Trigger | None:
    """Return the catalog trigger for ``slug``, or None if unknown."""
    return TRIGGERS_BY_SLUG.get(slug)


def resolve_triggers(slugs: list[str]) -> list[Trigger]:
    """Resolve known slugs to catalog triggers, preserving catalog order.

    Unknown slugs are silently dropped here; the API layer rejects them at the
    validation boundary so they never reach this function in practice.
    """
    selected = set(slugs)
    return [t for t in TRIGGER_CATALOG if t.slug in selected]
