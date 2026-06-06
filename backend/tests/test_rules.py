"""Tests for the deterministic rules engine.

Covers each technique being reachable, numeric signals, trigger weighting,
the grounding default, tie-breaking, and rationale construction.
"""

from __future__ import annotations

from app.domain.interventions import Technique
from app.domain.rules import recommend


def test_neutral_checkin_defaults_to_grounding() -> None:
    rec = recommend(mood=4, energy=4, sleep_hours=8, trigger_slugs=[])
    assert rec.technique is Technique.GROUNDING
    assert rec.factors == []
    assert "gentle" in rec.rationale.lower()


def test_anxiety_trigger_recommends_breathing() -> None:
    rec = recommend(mood=3, energy=3, sleep_hours=7, trigger_slugs=["anxious"])
    assert rec.technique is Technique.BREATHING
    assert "anxious or panicky" in rec.rationale.lower()


def test_self_doubt_recommends_thought_record() -> None:
    rec = recommend(mood=3, energy=3, sleep_hours=7, trigger_slugs=["self-doubt"])
    assert rec.technique is Technique.THOUGHT_RECORD


def test_procrastination_recommends_behavioral_activation() -> None:
    rec = recommend(mood=3, energy=3, sleep_hours=7, trigger_slugs=["procrastinating"])
    assert rec.technique is Technique.BEHAVIORAL_ACTIVATION


def test_short_sleep_recommends_winddown() -> None:
    rec = recommend(mood=4, energy=4, sleep_hours=4.5, trigger_slugs=["poor-sleep"])
    assert rec.technique is Technique.SLEEP_WINDDOWN
    assert "short sleep" in rec.factors


def test_low_mood_pushes_breathing_even_without_triggers() -> None:
    rec = recommend(mood=1, energy=4, sleep_hours=8, trigger_slugs=[])
    assert rec.technique is Technique.BREATHING
    assert "a low mood today" in rec.factors


def test_low_energy_pushes_behavioral_activation() -> None:
    rec = recommend(mood=3, energy=1, sleep_hours=8, trigger_slugs=[])
    assert rec.technique is Technique.BEHAVIORAL_ACTIVATION
    assert "low energy" in rec.factors


def test_trigger_weight_outranks_a_single_numeric_signal() -> None:
    # Low energy nudges behavioral activation (+1), but an anxiety trigger (+2)
    # for breathing should win.
    rec = recommend(mood=3, energy=1, sleep_hours=8, trigger_slugs=["anxious"])
    assert rec.technique is Technique.BREATHING


def test_tie_breaks_by_priority_breathing_over_thought_record() -> None:
    # One trigger each → tie at 2.0; breathing precedes thought_record in PRIORITY.
    rec = recommend(mood=4, energy=4, sleep_hours=8, trigger_slugs=["anxious", "self-doubt"])
    assert rec.technique is Technique.BREATHING


def test_rationale_lists_multiple_factors_readably() -> None:
    rec = recommend(mood=1, energy=4, sleep_hours=8, trigger_slugs=["anxious", "overthinking"])
    assert rec.technique is Technique.BREATHING
    # Multiple cues should be joined with "and".
    assert " and " in rec.rationale


def test_every_technique_has_citation_and_why() -> None:
    for slug, expected in [
        ("anxious", Technique.BREATHING),
        ("self-doubt", Technique.THOUGHT_RECORD),
        ("procrastinating", Technique.BEHAVIORAL_ACTIVATION),
    ]:
        rec = recommend(mood=3, energy=3, sleep_hours=7, trigger_slugs=[slug])
        assert rec.technique is expected
        assert rec.why_it_helps
        assert "research/" in rec.source
