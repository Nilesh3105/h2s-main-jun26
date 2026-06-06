"""Deterministic crisis screening for self-harm / suicidal ideation.

This is a curated phrase matcher — **never an LLM** (DESIGN §8, research/04). It
runs before any GenAI call on user text. It is intentionally conservative: it
targets explicit ideation phrasings and deliberately ignores common idioms
("this exam is killing me", "dying to see results") to avoid alarming false
positives, while erring toward routing to help on genuinely ambiguous distress.

This is a screening aid, not a diagnosis. On any match the app surfaces verified
human helplines; it never blocks the user or makes clinical claims.
"""

from __future__ import annotations

import re

from pydantic import BaseModel

# Patterns target the dangerous *meaning*, not bare words like "kill"/"die" that
# dominate everyday exam-stress idioms. Word boundaries + specific verbs/objects.
_PATTERNS: tuple[re.Pattern[str], ...] = (
    re.compile(r"\bkill(?:ing)?\s+myself\b"),
    re.compile(r"\bkill\s+my\s?self\b"),
    re.compile(r"\bend(?:ing)?\s+(?:my|this)\s+life\b"),
    re.compile(r"\btake\s+my\s+(?:own\s+)?life\b"),
    re.compile(r"\b(?:want|wanting)\s+to\s+die\b"),
    re.compile(r"\b(?:want|wish)\s+(?:i\s+(?:was|were)\s+|to\s+be\s+)dead\b"),
    re.compile(r"\bbetter\s+off\s+(?:dead|without\s+me)\b"),
    re.compile(r"\bno\s+(?:reason|point)\s+(?:to|in)\s+(?:live|living|being\s+here)\b"),
    re.compile(r"\bdon'?t\s+want\s+to\s+(?:live|be\s+here|wake\s+up)\b"),
    re.compile(r"\bdon'?t\s+want\s+to\s+be\s+alive\b"),
    re.compile(r"\bsuicid(?:e|al)\b"),
    re.compile(r"\bself[-\s]?harm\b"),
    re.compile(r"\b(?:hurt|hurting|harm|harming|cut|cutting)\s+myself\b"),
    re.compile(r"\bcan'?t\s+(?:do|take)\s+(?:this|it)\s+any\s?more\b"),
)


class CrisisScreening(BaseModel):
    """Result of screening a piece of free text."""

    detected: bool
    # The matched phrase fragments — for tests/auditing only, never shown to the
    # user (showing matched self-harm phrasing back would be unsafe messaging).
    matched: list[str]


def screen_text(text: str) -> CrisisScreening:
    """Screen free text for crisis indicators. Pure and deterministic."""
    if not text or not text.strip():
        return CrisisScreening(detected=False, matched=[])

    haystack = text.casefold()
    matched = [m.group(0) for p in _PATTERNS if (m := p.search(haystack))]
    return CrisisScreening(detected=bool(matched), matched=matched)
