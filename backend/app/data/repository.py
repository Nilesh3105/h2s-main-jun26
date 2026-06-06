"""Persistence operations for check-ins and interventions.

Thin functions over a SQLModel ``Session`` — the only layer that touches the DB,
so the domain stays pure and the API stays thin. Returns ORM rows; the API maps
them to Pydantic response schemas.
"""

from __future__ import annotations

from datetime import date

from sqlmodel import Session, col, select

from app.data.models import (
    CheckIn,
    CheckInTrigger,
    ExamDate,
    InterventionEvent,
    WeeklyReflection,
)


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
        session.exec(select(CheckIn).order_by(col(CheckIn.created_at).desc()).limit(limit)).all()
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


def all_check_ins_with_triggers(session: Session) -> list[tuple[CheckIn, list[str]]]:
    """All check-ins (oldest first) paired with their trigger slugs.

    Avoids an N+1 by loading the link table once and grouping in memory.
    """
    checkins = list(session.exec(select(CheckIn).order_by(col(CheckIn.created_at))).all())
    links = session.exec(select(CheckInTrigger)).all()
    by_checkin: dict[int, list[str]] = {}
    for link in links:
        if link.check_in_id is not None:
            by_checkin.setdefault(link.check_in_id, []).append(link.trigger_slug)
    return [(c, by_checkin.get(c.id, []) if c.id is not None else []) for c in checkins]


def create_exam_date(session: Session, *, label: str, on: date, kind: str) -> ExamDate:
    """Persist an exam/result date."""
    exam_date = ExamDate(label=label, date=on, kind=kind)
    session.add(exam_date)
    session.commit()
    session.refresh(exam_date)
    return exam_date


def list_exam_dates(session: Session) -> list[ExamDate]:
    """Return all exam/result dates, soonest first."""
    return list(session.exec(select(ExamDate).order_by(col(ExamDate.date))).all())


def delete_exam_date(session: Session, *, exam_date_id: int) -> bool:
    """Delete an exam/result date; return True if a row was removed."""
    exam_date = session.get(ExamDate, exam_date_id)
    if exam_date is None:
        return False
    session.delete(exam_date)
    session.commit()
    return True


def get_reflection(session: Session, week_start: date) -> WeeklyReflection | None:
    """Return the cached reflection for a week, if any."""
    return session.exec(
        select(WeeklyReflection).where(WeeklyReflection.week_start == week_start)
    ).first()


def save_reflection(
    session: Session, *, week_start: date, body: str, source: str
) -> WeeklyReflection:
    """Persist (cache) a weekly reflection."""
    reflection = WeeklyReflection(week_start=week_start, body=body, source=source)
    session.add(reflection)
    session.commit()
    session.refresh(reflection)
    return reflection


def delete_all_user_data(session: Session) -> None:
    """Erase every stored row — the user's one-tap 'delete my data' (DPDP)."""
    for model in (CheckInTrigger, InterventionEvent, CheckIn, ExamDate, WeeklyReflection):
        for row in session.exec(select(model)).all():
            session.delete(row)
    session.commit()
