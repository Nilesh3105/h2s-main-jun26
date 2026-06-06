"""Exam/result dates API — drives the result-season support mode."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import SessionDep
from app.data import repository
from app.schemas.insights import ExamDateCreate, ExamDateOut

router = APIRouter(tags=["exam-dates"])


@router.get("/exam-dates", response_model=list[ExamDateOut])
def list_exam_dates(session: SessionDep) -> list[ExamDateOut]:
    """Return all flagged exam/result dates, soonest first."""
    return [
        ExamDateOut(id=e.id, label=e.label, date=e.date, kind=e.kind)
        for e in repository.list_exam_dates(session)
        if e.id is not None
    ]


@router.post("/exam-dates", response_model=ExamDateOut, status_code=status.HTTP_201_CREATED)
def create_exam_date(payload: ExamDateCreate, session: SessionDep) -> ExamDateOut:
    """Flag an exam or result date."""
    created = repository.create_exam_date(
        session, label=payload.label, on=payload.date, kind=payload.kind
    )
    assert created.id is not None
    return ExamDateOut(id=created.id, label=created.label, date=created.date, kind=created.kind)


@router.delete("/exam-dates/{exam_date_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam_date(exam_date_id: int, session: SessionDep) -> Response:
    """Remove a flagged date."""
    if not repository.delete_exam_date(session, exam_date_id=exam_date_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="exam date not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
