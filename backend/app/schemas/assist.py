"""Schemas for the GenAI assist + weekly-reflection endpoints."""

from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field

from app.schemas.checkin import TriggerOut

TEXT_MAX_LEN = 1000


class ReflectionOut(BaseModel):
    week_start: date
    body: str
    source: str  # "ai" | "template"


class ReframeRequest(BaseModel):
    thought: str = Field(min_length=1, max_length=TEXT_MAX_LEN)


class ReframeOut(BaseModel):
    reframe: str
    source: str
    crisis: bool


class PromptOut(BaseModel):
    prompt: str
    source: str


class TagsRequest(BaseModel):
    note: str = Field(min_length=1, max_length=TEXT_MAX_LEN)


class TagsOut(BaseModel):
    triggers: list[TriggerOut]
    source: str
    crisis: bool
