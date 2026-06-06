"""Result-season support mode.

Pure logic: given the user's flagged exam/result dates and today's date, decide
whether to raise a gentle, supportive banner — and which one. Exam crises spike
~4x during result season (research/01), so the window around those dates is when
extra support matters most.
"""

from __future__ import annotations

from datetime import date, timedelta

from pydantic import BaseModel

# Supportive mode runs for two weeks before an exam and the week after a result.
EXAM_PRE_WINDOW = timedelta(days=14)
RESULT_POST_WINDOW = timedelta(days=7)


class ExamDateData(BaseModel):
    label: str
    date: date
    kind: str  # "exam" | "result"


class SeasonStatus(BaseModel):
    active: bool
    label: str | None = None
    message: str | None = None


def _candidate(entry: ExamDateData, today: date) -> tuple[int, SeasonStatus] | None:
    """Return (distance_in_days, status) if `entry` is in an active window, else None."""
    if entry.kind == "exam":
        delta = (entry.date - today).days
        if 0 <= delta <= EXAM_PRE_WINDOW.days:
            when = "today" if delta == 0 else f"in {delta} day{'s' if delta != 1 else ''}"
            return (
                delta,
                SeasonStatus(
                    active=True,
                    label="Exam season",
                    message=(
                        f"Your {entry.label} is {when}. This is a lot to carry — be extra kind "
                        "to yourself, and take the small resets when you need them."
                    ),
                ),
            )
    elif entry.kind == "result":
        since = (today - entry.date).days
        if 0 <= since <= RESULT_POST_WINDOW.days:
            return (
                since,
                SeasonStatus(
                    active=True,
                    label="Results season",
                    message=(
                        f"Results time around {entry.label} can hit hard, whatever the number. "
                        "Your worth isn't a score. Help is one tap away if you need it."
                    ),
                ),
            )
    return None


def season_status(exam_dates: list[ExamDateData], today: date) -> SeasonStatus:
    """Pick the most immediate active support window, or an inactive status."""
    candidates = [c for entry in exam_dates if (c := _candidate(entry, today)) is not None]
    if not candidates:
        return SeasonStatus(active=False)
    # Smallest distance to today = most immediate / relevant.
    _, status = min(candidates, key=lambda c: c[0])
    return status
