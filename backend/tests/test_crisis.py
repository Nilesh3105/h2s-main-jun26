"""Tests for the deterministic crisis classifier.

Positive cases must trigger; everyday exam-stress idioms must NOT (false
positives would erode trust); genuinely ambiguous distress errs toward help.
"""

from __future__ import annotations

import pytest
from app.domain.crisis import screen_text

POSITIVE = [
    "I want to die",
    "sometimes I think about killing myself",
    "I feel like ending my life",
    "thinking about suicide lately",
    "everyone would be better off without me",
    "there's no reason to live anymore",
    "I don't want to be here any more",
    "I've been hurting myself",
    "I want to take my own life",
]

# Common idioms and exam-stress hyperbole that must stay quiet.
NEGATIVE = [
    "this exam is killing me",
    "I'm dying to see my results",
    "dead tired after studying all night",
    "I could murder a plate of biryani right now",
    "the syllabus is endless",
    "I'm so stressed about JEE",
    "I bombed my mock test",
    "I feel low and unmotivated today",
    "",
    "   ",
]


@pytest.mark.parametrize("text", POSITIVE)
def test_positive_cases_detected(text: str) -> None:
    result = screen_text(text)
    assert result.detected is True
    assert result.matched


@pytest.mark.parametrize("text", NEGATIVE)
def test_negative_cases_not_detected(text: str) -> None:
    assert screen_text(text).detected is False


def test_detection_is_case_insensitive() -> None:
    assert screen_text("I WANT TO DIE").detected is True


def test_matched_phrases_are_captured_for_audit() -> None:
    result = screen_text("I keep thinking about suicide")
    assert result.detected is True
    assert any("suicid" in m for m in result.matched)
