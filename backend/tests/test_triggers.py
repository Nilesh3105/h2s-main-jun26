"""Catalog-integrity tests for the trigger taxonomy."""

from __future__ import annotations

from app.domain.interventions import INTERVENTIONS, Technique
from app.domain.triggers import TRIGGER_CATALOG, TriggerCategory, resolve_triggers


def test_slugs_are_unique() -> None:
    slugs = [t.slug for t in TRIGGER_CATALOG]
    assert len(slugs) == len(set(slugs))


def test_every_category_is_represented() -> None:
    categories = {t.category for t in TRIGGER_CATALOG}
    assert categories == set(TriggerCategory)


def test_every_suggested_technique_exists_in_catalog() -> None:
    for trigger in TRIGGER_CATALOG:
        assert trigger.suggests in INTERVENTIONS
        assert isinstance(trigger.suggests, Technique)


def test_resolve_preserves_catalog_order_and_ignores_unknown() -> None:
    resolved = resolve_triggers(["self-doubt", "not-a-real-slug", "anxious"])
    slugs = [t.slug for t in resolved]
    # Catalog order: "anxious" precedes "self-doubt"; unknown dropped.
    assert slugs == ["anxious", "self-doubt"]
