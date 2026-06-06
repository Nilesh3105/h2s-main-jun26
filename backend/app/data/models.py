"""SQLModel tables — the persisted shape of a check-in and its follow-ups.

Triggers are referenced by ``slug`` (the catalog in ``domain/triggers.py`` is the
source of truth) through a link table, demonstrating relational modelling without
seed drift. Timestamps are timezone-aware UTC.
"""

from __future__ import annotations

from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    """Timezone-aware current time (injectable point for deterministic tests)."""
    return datetime.now(UTC)


class CheckInTrigger(SQLModel, table=True):
    """Link row: a check-in ↔ a catalog trigger slug (many-to-many)."""

    check_in_id: int | None = Field(default=None, foreign_key="checkin.id", primary_key=True)
    trigger_slug: str = Field(primary_key=True)


class CheckIn(SQLModel, table=True):
    """A single 30-second check-in."""

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=utcnow, index=True)
    mood: int  # 1 (very low) … 5 (great)
    energy: int  # 1 (drained) … 5 (energised)
    sleep_hours: float
    note: str | None = Field(default=None)


class InterventionEvent(SQLModel, table=True):
    """Records that an intervention was offered/completed for a check-in."""

    id: int | None = Field(default=None, primary_key=True)
    check_in_id: int = Field(foreign_key="checkin.id", index=True)
    technique: str
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utcnow)
