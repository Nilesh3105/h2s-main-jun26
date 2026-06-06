"""Micro-interventions: the evidence-based techniques Soft Reset can suggest.

Pure data + value objects, no I/O. Each technique carries a short, honest
"why this helps" line and a pointer to the research file behind it — the
transparency surface that "reads as care, not boasting" (DESIGN §14).

Evidence ranking and rationale: research/02-evidence-based-interventions.md.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel


class Technique(StrEnum):
    """The intervention the rules engine can match a check-in to."""

    BREATHING = "breathing"
    THOUGHT_RECORD = "thought_record"
    BEHAVIORAL_ACTIVATION = "behavioral_activation"
    SLEEP_WINDDOWN = "sleep_winddown"
    GROUNDING = "grounding"


class InterventionInfo(BaseModel):
    """Static, citable description of a technique (the 'what' and the 'why')."""

    technique: Technique
    title: str
    summary: str
    why_it_helps: str
    source: str
    duration_min: int


# The catalog is the single source of truth for intervention copy + citations.
INTERVENTIONS: dict[Technique, InterventionInfo] = {
    Technique.BREATHING: InterventionInfo(
        technique=Technique.BREATHING,
        title="Take a slow breath",
        summary="A short paced-breathing exercise (box or 4-7-8) to settle a stress spike.",
        why_it_helps=(
            "Slow, paced breathing activates the body's calming response and eases a racing "
            "heart and mind within a couple of minutes."
        ),
        source="Paced breathing — strongest evidence (research/02)",
        duration_min=2,
    ),
    Technique.THOUGHT_RECORD: InterventionInfo(
        technique=Technique.THOUGHT_RECORD,
        title="Untangle the thought",
        summary="A guided thought-record: name the situation, the thought, then a fairer reframe.",
        why_it_helps=(
            "Writing an anxious thought down next to a more balanced one loosens its grip — "
            "the core move of cognitive restructuring."
        ),
        source="Cognitive restructuring — strong evidence (research/02)",
        duration_min=4,
    ),
    Technique.BEHAVIORAL_ACTIVATION: InterventionInfo(
        technique=Technique.BEHAVIORAL_ACTIVATION,
        title="Plan one small thing",
        summary="Pick one tiny, doable action and check it off — momentum over motivation.",
        why_it_helps=(
            "Doing one small action breaks the freeze of low motivation; action tends to come "
            "before the mood lifts, not after."
        ),
        source="Behavioral activation — strong evidence (research/02)",
        duration_min=3,
    ),
    Technique.SLEEP_WINDDOWN: InterventionInfo(
        technique=Technique.SLEEP_WINDDOWN,
        title="Set up a wind-down",
        summary="A short, consistent wind-down to protect tonight's sleep.",
        why_it_helps=(
            "Sleeping under six hours is one of the strongest predictors of exam-season "
            "distress; a steady wind-down helps protect it."
        ),
        source="Sleep consistency (research/01, research/02)",
        duration_min=3,
    ),
    Technique.GROUNDING: InterventionInfo(
        technique=Technique.GROUNDING,
        title="A small grounding pause",
        summary="A brief 5-4-3-2-1 senses pause to re-centre when things feel like a lot.",
        why_it_helps=(
            "Naming what you can see, hear, and feel gently pulls attention out of a spiral "
            "and back into the present."
        ),
        source="Grounding / present-focus (research/02)",
        duration_min=2,
    ),
}


def get_intervention(technique: Technique) -> InterventionInfo:
    """Return the static info for a technique."""
    return INTERVENTIONS[technique]
