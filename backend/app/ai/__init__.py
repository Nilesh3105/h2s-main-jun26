"""GenAI voice layer.

Small typed functions (reflect_week, narrate_insight, suggest_reframe, ...) each
with an LLM implementation and a deterministic fallback, chosen by a single
factory. The deterministic crisis classifier always runs before any LLM call on
user text. Populated in Milestone 5.
"""
