"""Factory that wires the LLM (when configured + healthy) into the AiService.

Returns a deterministic-only service when there is no API key or the model can't
be constructed — so the app never hard-depends on GenAI.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.ai.service import AiService
from app.settings import get_settings

if TYPE_CHECKING:
    from langchain_core.language_models import BaseChatModel


def get_chat_model() -> BaseChatModel | None:
    """Build the Gemini chat model if a key is configured; else None."""
    settings = get_settings()
    if not settings.ai_enabled:
        return None
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            model=settings.gemini_model,
            google_api_key=settings.google_api_key,
            temperature=0.7,
            timeout=8,
            max_retries=0,
        )
    except Exception:
        # A bad model id, missing extra, or auth issue must never break the app.
        return None


def get_ai() -> AiService:
    """FastAPI dependency: an AiService backed by the LLM or deterministic fallbacks."""
    return AiService(get_chat_model())
