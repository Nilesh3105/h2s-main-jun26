"""Deterministic fallbacks for every GenAI surface.

These are pure functions and the source of truth for correctness: the app is
complete and all tests pass using only these, with no API key. The LLM, when
present, replaces these outputs with warmer phrasing — but never changes a
decision (DESIGN §7).
"""

from __future__ import annotations

from pydantic import BaseModel

from app.domain.triggers import TRIGGER_CATALOG

MOOD_WORDS = {1: "very low", 2: "low", 3: "okay", 4: "good", 5: "great"}


class WeekStats(BaseModel):
    """Deterministically-computed summary of a week of check-ins."""

    check_in_count: int
    avg_mood: float | None
    top_trigger_label: str | None
    low_sleep_days: int
    direction: str  # "up" | "down" | "steady" | "flat"


def _mood_word(mood: float) -> str:
    return MOOD_WORDS.get(round(mood), "okay")


def reflect_week_fallback(stats: WeekStats) -> str:
    """Template weekly reflection built from the week's stats."""
    if stats.check_in_count == 0:
        return (
            "No check-ins yet this week. Whenever you're ready, a 30-second check-in is a kind "
            "thing to do for yourself."
        )
    times = f"{stats.check_in_count} time{'s' if stats.check_in_count != 1 else ''}"
    parts = [f"This week you checked in {times}."]
    if stats.avg_mood is not None:
        parts.append(f"Your mood sat around {_mood_word(stats.avg_mood)} on average.")
    if stats.direction == "up":
        parts.append("It's been trending upward — that's worth acknowledging.")
    elif stats.direction == "down":
        parts.append("It dipped a little, and that's okay; weeks aren't all the same.")
    if stats.top_trigger_label:
        parts.append(f"“{stats.top_trigger_label}” came up most often.")
    if stats.low_sleep_days:
        nights = f"{stats.low_sleep_days} night{'s' if stats.low_sleep_days != 1 else ''}"
        parts.append(f"Sleep ran short on {nights} — protecting it tends to help everything else.")
    parts.append("Whatever this week held, showing up to notice it counts.")
    return " ".join(parts)


# A small curated bank — balanced, non-prescriptive reframes.
_REFRAME_BANK = (
    "Try holding this as one possible thought, not a fact. What would you say to a friend who "
    "felt this way? That kinder version is usually closer to the truth.",
    "This feeling is real, but it isn't the whole picture. One hard moment or result doesn't "
    "define your worth or decide your future.",
    "Notice the word “always” or “never” if it's there — they're rarely accurate. What's a more "
    "balanced way to say this?",
)


def reframe_fallback(thought: str) -> str:
    """Pick a deterministic reframe; varies gently with the thought's length."""
    index = len(thought.strip()) % len(_REFRAME_BANK)
    return _REFRAME_BANK[index]


_PROMPT_BANK_LOW = (
    "One small thing that didn't go terribly today was…",
    "If a friend felt exactly how I feel now, I'd tell them…",
    "Right now my body feels… and my mind feels…",
)
_PROMPT_BANK_OK = (
    "One thing I'm quietly proud of this week is…",
    "Something I'm looking forward to, even a little, is…",
    "If today had a title, it would be…",
)


def prompt_fallback(recent_mood: int | None) -> str:
    """A journaling sentence-starter, gentler when recent mood is low."""
    bank = _PROMPT_BANK_LOW if recent_mood is not None and recent_mood <= 2 else _PROMPT_BANK_OK
    index = (recent_mood or 0) % len(bank)
    return bank[index]


# Keyword → trigger-slug map for the deterministic note→tags fallback.
_TAG_KEYWORDS: dict[str, tuple[str, ...]] = {
    "exam-approaching": ("exam", "test", "paper", "boards", "jee", "neet"),
    "too-much-syllabus": ("syllabus", "portion", "so much to", "behind"),
    "bad-mock-score": ("mock", "failed", "flunked", "bad score", "low marks"),
    "cant-focus": ("can't focus", "cant focus", "distracted", "concentrate"),
    "procrastinating": ("procrastinat", "putting off", "can't start", "stuck"),
    "peer-comparison": ("everyone else", "compare", "comparison", "others are"),
    "family-pressure": ("parents", "family", "expectations", "pressure from"),
    "feeling-alone": ("alone", "lonely", "no one", "nobody"),
    "poor-sleep": ("can't sleep", "cant sleep", "no sleep", "didn't sleep", "insomnia"),
    "always-tired": ("tired", "exhausted", "drained", "no energy"),
    "anxious": ("anxious", "anxiety", "panic", "nervous", "scared", "worried"),
    "overthinking": ("overthink", "can't switch off", "racing thoughts", "spiral"),
    "self-doubt": ("not good enough", "worthless", "failure", "stupid", "useless"),
    "hopeless-results": ("hopeless", "pointless", "give up", "no future"),
}

_VALID_SLUGS = {t.slug for t in TRIGGER_CATALOG}


def suggest_tags_fallback(note: str) -> list[str]:
    """Keyword-match a free note to known trigger slugs (deterministic, in order)."""
    haystack = note.casefold()
    matched: list[str] = []
    for slug, keywords in _TAG_KEYWORDS.items():
        if slug in _VALID_SLUGS and any(kw in haystack for kw in keywords):
            matched.append(slug)
    return matched
