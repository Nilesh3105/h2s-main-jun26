# Soft Reset — backend

Python + [uv](https://docs.astral.sh/uv/) · FastAPI · SQLModel over SQLite.

The backend holds the **deterministic brain**: pure-function domain logic (rules engine,
crisis classifier, insights) that works with no API key, plus an `ai/` layer that personalizes
on top when a key is present and falls back to deterministic output otherwise. See the root
[`DESIGN.md`](../DESIGN.md) for the full architecture.

## Setup

```bash
uv sync                       # create venv + install deps (incl. dev tools)
cp .env.example .env          # optional; the app runs fine with no key
```

## Run

```bash
uv run uvicorn app.main:app --reload     # http://127.0.0.1:8000  (docs at /docs)
```

## Quality gates (what CI runs)

```bash
uv run ruff check .           # lint
uv run black --check .        # format
uv run mypy app tests         # types (strict)
uv run pytest                 # tests
```

## Layout

```
app/
  api/        FastAPI routers (thin)
  domain/     PURE logic: rules engine, crisis classifier, insights (no I/O)
  ai/         GenAI surfaces, each with a deterministic fallback
  data/       SQLModel models + db engine/session
  schemas/    Pydantic request/response models
tests/        pytest
```
