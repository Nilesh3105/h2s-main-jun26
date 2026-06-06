"""Schemas for the insights and exam-date endpoints."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field, field_validator

from app.domain.insights import InsightCard, TrendPoint, TriggerCount
from app.domain.season import SeasonStatus

EXAM_KINDS = {"exam", "result"}
LABEL_MAX_LEN = 120


class ExamDateCreate(BaseModel):
    """Inbound exam/result date."""

    label: str = Field(min_length=1, max_length=LABEL_MAX_LEN)
    date: date
    kind: str

    @field_validator("kind")
    @classmethod
    def _known_kind(cls, kind: str) -> str:
        if kind not in EXAM_KINDS:
            raise ValueError(f"kind must be one of {sorted(EXAM_KINDS)}")
        return kind

    @field_validator("label")
    @classmethod
    def _trim_label(cls, label: str) -> str:
        return label.strip()


class ExamDateOut(BaseModel):
    """An exam/result date as returned to the client."""

    id: int
    label: str
    date: date
    kind: str


class InsightsOut(BaseModel):
    """The full insights payload powering the trends dashboard."""

    trend: list[TrendPoint]
    summary: str
    top_triggers: list[TriggerCount]
    cards: list[InsightCard]
    season: SeasonStatus
    total_check_ins: int
