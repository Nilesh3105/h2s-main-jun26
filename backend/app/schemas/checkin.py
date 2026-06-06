"""Request/response schemas for the check-in API.

All inbound bounds (mood/energy ranges, sleep hours, note length, trigger count)
are enforced here at the validation boundary, so malformed input is rejected with
a 422 before it reaches the domain or the database.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.domain.interventions import Technique
from app.domain.rules import Recommendation
from app.domain.triggers import VALID_TRIGGER_SLUGS, TriggerCategory

# Cap free-text length to bound storage and any downstream LLM payload.
NOTE_MAX_LEN = 1000
MAX_TRIGGERS = 12


class TriggerOut(BaseModel):
    """A trigger as exposed to the client."""

    slug: str
    label: str
    category: TriggerCategory


class CheckInCreate(BaseModel):
    """Inbound check-in payload."""

    mood: int = Field(ge=1, le=5)
    energy: int = Field(ge=1, le=5)
    sleep_hours: float = Field(ge=0, le=16)
    note: str | None = Field(default=None, max_length=NOTE_MAX_LEN)
    trigger_slugs: list[str] = Field(default_factory=list, max_length=MAX_TRIGGERS)

    @field_validator("trigger_slugs")
    @classmethod
    def _known_slugs(cls, slugs: list[str]) -> list[str]:
        unknown = [s for s in slugs if s not in VALID_TRIGGER_SLUGS]
        if unknown:
            raise ValueError(f"unknown trigger slug(s): {', '.join(sorted(unknown))}")
        return slugs

    @field_validator("note")
    @classmethod
    def _blank_note_is_none(cls, note: str | None) -> str | None:
        if note is None:
            return None
        stripped = note.strip()
        return stripped or None


class CheckInOut(BaseModel):
    """A persisted check-in as returned to the client."""

    id: int
    created_at: datetime
    mood: int
    energy: int
    sleep_hours: float
    note: str | None
    triggers: list[TriggerOut]


class CheckInResult(BaseModel):
    """The full response to creating a check-in: the saved row + what to do next."""

    check_in: CheckInOut
    recommendation: Recommendation
    # Deterministic crisis screening result. True → the client shows the always-on
    # help screen. The matched phrases are never sent to the client.
    crisis: bool


class InterventionLog(BaseModel):
    """Inbound payload to record an intervention being offered/completed."""

    technique: Technique
    completed: bool = False
