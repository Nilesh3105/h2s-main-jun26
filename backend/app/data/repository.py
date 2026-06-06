"""Persistence operations for check-ins and interventions.

Thin functions over a SQLModel ``Session`` — the only layer that touches the DB,
so the domain stays pure and the API stays thin. Returns ORM rows; the API maps
them to Pydantic response schemas.
"""

from __future__ import annotations

from sqlmodel import Session, select

from app.data.models import CheckIn, CheckInTrigger, InterventionEvent


def create_check_in(
    session: Session,
    *,
    mood: int,
    energy: int,
    sleep_hours: float,
    note: str | None,
    trigger_slugs: list[str],
) -> CheckIn:
    """Persist a check-in and its trigger links; return the saved row."""
    check_in = CheckIn(mood=mood, energy=energy, sleep_hours=sleep_hours, note=note)
    session.add(check_in)
    session.commit()
    session.refresh(check_in)

    assert check_in.id is not None  # set by the DB on commit
    # De-duplicate while preserving submission order.
    for slug in dict.fromkeys(trigger_slugs):
        session.add(CheckInTrigger(check_in_id=check_in.id, trigger_slug=slug))
    if trigger_slugs:
        session.commit()

    return check_in


def trigger_slugs_for(session: Session, check_in_id: int) -> list[str]:
    """Return the trigger slugs linked to a check-in."""
    rows = session.exec(
        select(CheckInTrigger.trigger_slug).where(CheckInTrigger.check_in_id == check_in_id)
    ).all()
    return list(rows)


def list_check_ins(session: Session, *, limit: int = 30) -> list[CheckIn]:
    """Return the most recent check-ins, newest first."""
    return list(
        session.exec(
            select(CheckIn).order_by(CheckIn.created_at.desc()).limit(limit)  # type: ignore[attr-defined]
        ).all()
    )


def log_intervention(
    session: Session, *, check_in_id: int, technique: str, completed: bool
) -> InterventionEvent:
    """Record that an intervention was offered/completed for a check-in."""
    event = InterventionEvent(check_in_id=check_in_id, technique=technique, completed=completed)
    session.add(event)
    session.commit()
    session.refresh(event)
    return event
