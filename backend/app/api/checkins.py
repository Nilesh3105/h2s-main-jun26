"""Check-in API: the core loop's HTTP surface.

Thin router — it validates input (via schemas), runs the pure domain (crisis
screen + rules engine), persists via the repository, and shapes the response.
No business logic lives here.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session

from app.api.deps import SessionDep
from app.data import repository
from app.data.models import CheckIn
from app.domain.crisis import screen_text
from app.domain.rules import recommend
from app.domain.triggers import TRIGGER_CATALOG, get_trigger
from app.schemas.checkin import (
    CheckInCreate,
    CheckInOut,
    CheckInResult,
    InterventionLog,
    TriggerOut,
)

router = APIRouter(tags=["check-ins"])


def _to_out(session: Session, check_in: CheckIn) -> CheckInOut:
    """Map a persisted check-in to its response shape, resolving trigger labels."""
    assert check_in.id is not None
    slugs = repository.trigger_slugs_for(session, check_in.id)
    triggers = [
        TriggerOut(slug=t.slug, label=t.label, category=t.category)
        for slug in slugs
        if (t := get_trigger(slug)) is not None
    ]
    return CheckInOut(
        id=check_in.id,
        created_at=check_in.created_at,
        mood=check_in.mood,
        energy=check_in.energy,
        sleep_hours=check_in.sleep_hours,
        note=check_in.note,
        triggers=triggers,
    )


@router.get("/triggers", response_model=list[TriggerOut])
def list_triggers() -> list[TriggerOut]:
    """Return the full trigger catalog for building the picker."""
    return [TriggerOut(slug=t.slug, label=t.label, category=t.category) for t in TRIGGER_CATALOG]


@router.post("/checkins", response_model=CheckInResult, status_code=status.HTTP_201_CREATED)
def create_check_in(payload: CheckInCreate, session: SessionDep) -> CheckInResult:
    """Record a check-in and return the matched intervention + crisis flag."""
    # Safety first: deterministic crisis screen runs before anything else.
    screening = screen_text(payload.note or "")

    recommendation = recommend(
        mood=payload.mood,
        energy=payload.energy,
        sleep_hours=payload.sleep_hours,
        trigger_slugs=payload.trigger_slugs,
    )

    check_in = repository.create_check_in(
        session,
        mood=payload.mood,
        energy=payload.energy,
        sleep_hours=payload.sleep_hours,
        note=payload.note,
        trigger_slugs=payload.trigger_slugs,
    )

    return CheckInResult(
        check_in=_to_out(session, check_in),
        recommendation=recommendation,
        crisis=screening.detected,
    )


@router.get("/checkins", response_model=list[CheckInOut])
def list_check_ins(session: SessionDep, limit: int = 30) -> list[CheckInOut]:
    """Return recent check-ins, newest first (drives read-back + trends)."""
    limit = max(1, min(limit, 365))
    return [_to_out(session, c) for c in repository.list_check_ins(session, limit=limit)]


@router.post("/checkins/{check_in_id}/intervention", status_code=status.HTTP_201_CREATED)
def log_intervention(
    check_in_id: int,
    payload: InterventionLog,
    session: SessionDep,
) -> dict[str, str]:
    """Record that an intervention was offered/completed for a check-in."""
    check_in = session.get(CheckIn, check_in_id)
    if check_in is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="check-in not found")
    repository.log_intervention(
        session,
        check_in_id=check_in_id,
        technique=payload.technique.value,
        completed=payload.completed,
    )
    return {"status": "recorded"}
