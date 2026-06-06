"""Data-portability endpoints: export everything, or delete everything.

Gives the user real control over their data (DPDP Act, DESIGN §9): a one-tap
export and a one-tap erase. No auth in the single-local-user MVP.
"""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Response, status

from app.api.deps import SessionDep
from app.data import repository
from app.domain.triggers import get_trigger
from app.schemas.checkin import CheckInOut, TriggerOut
from app.schemas.data import DataExport
from app.schemas.insights import ExamDateOut

router = APIRouter(tags=["data"])


@router.get("/data/export", response_model=DataExport)
def export_data(session: SessionDep) -> DataExport:
    """Return all stored data as a single JSON document the user can keep."""
    check_ins = [
        CheckInOut(
            id=c.id,
            created_at=c.created_at,
            mood=c.mood,
            energy=c.energy,
            sleep_hours=c.sleep_hours,
            note=c.note,
            triggers=[
                TriggerOut(slug=t.slug, label=t.label, category=t.category)
                for slug in slugs
                if (t := get_trigger(slug)) is not None
            ],
        )
        for c, slugs in repository.all_check_ins_with_triggers(session)
        if c.id is not None
    ]
    exam_dates = [
        ExamDateOut(id=e.id, label=e.label, date=e.date, kind=e.kind)
        for e in repository.list_exam_dates(session)
        if e.id is not None
    ]
    return DataExport(exported_at=datetime.now(UTC), check_ins=check_ins, exam_dates=exam_dates)


@router.delete("/data", status_code=status.HTTP_204_NO_CONTENT)
def delete_data(session: SessionDep) -> Response:
    """Erase every stored row. Irreversible by design — the user's data is theirs."""
    repository.delete_all_user_data(session)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
