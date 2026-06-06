"""Schema for the data-export payload (one-tap "download my data")."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.checkin import CheckInOut
from app.schemas.insights import ExamDateOut


class DataExport(BaseModel):
    """Everything the app holds about the user, in one portable document."""

    exported_at: datetime
    check_ins: list[CheckInOut]
    exam_dates: list[ExamDateOut]
