"""Tests for the GenAI voice layer — exercised with a fake chat model (no network).

Covers: LLM path used when a model is present, deterministic fallback when it is
absent or raises, output clamping, tag validation against the catalog, and the
crisis-before-LLM guarantee.
"""

from __future__ import annotations

from typing import cast
from unittest.mock import MagicMock

from app.ai.fallbacks import WeekStats, suggest_tags_fallback
from app.ai.service import CRISIS_REFRAME, AiService
from langchain_core.language_models import BaseChatModel
from langchain_core.language_models.fake_chat_models import FakeListChatModel


def _stats() -> WeekStats:
    return WeekStats(
        check_in_count=3,
        avg_mood=3.0,
        top_trigger_label="Anxious or panicky",
        low_sleep_days=1,
        direction="steady",
    )


def test_disabled_service_uses_template() -> None:
    ai = AiService(None)
    assert ai.enabled is False
    result = ai.reflect_week(_stats())
    assert result.source == "template"
    assert "checked in" in result.body


def test_llm_path_is_used_when_model_present() -> None:
    ai = AiService(FakeListChatModel(responses=["You showed up this week. That matters."]))
    result = ai.reflect_week(_stats())
    assert result.source == "ai"
    assert "showed up" in result.body


def test_llm_error_falls_back_to_template() -> None:
    model = MagicMock(spec=BaseChatModel)
    model.invoke.side_effect = RuntimeError("model exploded")
    ai = AiService(cast(BaseChatModel, model))
    result = ai.reflect_week(_stats())
    assert result.source == "template"


def test_output_is_clamped() -> None:
    long_text = "word " * 500
    ai = AiService(FakeListChatModel(responses=[long_text]))
    result = ai.reflect_week(_stats())
    assert len(result.body) <= 601  # 600 chars + ellipsis


def test_reframe_blocks_crisis_text_before_llm() -> None:
    # Even with a model present, crisis text must NOT reach it.
    ai = AiService(FakeListChatModel(responses=["should never be used"]))
    result = ai.suggest_reframe("I want to die")
    assert result.crisis is True
    assert result.source == "template"
    assert result.reframe == CRISIS_REFRAME


def test_suggest_tags_validates_against_catalog() -> None:
    # LLM returns a mix of valid and invalid slugs; invalid ones are dropped.
    ai = AiService(FakeListChatModel(responses=["anxious, made-up-slug, poor-sleep"]))
    result = ai.suggest_tags("can't sleep and feeling panicky")
    assert result.source == "ai"
    assert result.slugs == ["anxious", "poor-sleep"]


def test_suggest_tags_falls_back_to_keywords_without_model() -> None:
    ai = AiService(None)
    result = ai.suggest_tags("I am so anxious and I can't sleep")
    assert result.source == "template"
    assert "anxious" in result.slugs


def test_tag_fallback_is_pure_and_keyword_based() -> None:
    assert "exam-approaching" in suggest_tags_fallback("my exam is tomorrow")
    assert suggest_tags_fallback("had a lovely calm day") == []


def test_prompt_fallback_is_gentler_when_mood_low() -> None:
    ai = AiService(None)
    low = ai.suggest_prompt(1)
    assert low.source == "template"
    assert low.prompt.endswith("…")
