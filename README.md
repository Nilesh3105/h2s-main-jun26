# Soft Reset — a calm space for exam season

> _soft reset_ (n.) — a gentle restart, nothing wiped. For your head, not your phone.

A private, research-grounded **wellness companion** for students navigating board exams,
competitive entrance tests (NEET, JEE, CUET, CAT, GATE, UPSC), and result season. Check in on
your mood in under 30 seconds, surface what's driving the stress, and get a matched, evidence-based
micro-exercise — with crisis help always one tap away.

This is a hackathon submission for the **Mental Wellness Tracker** challenge.

**Live demo:** https://softreset.vercel.app  ·  **One-line pitch:** see [`SUBMISSION.txt`](SUBMISSION.txt)

> The hosted demo is the static frontend; its data features show a calm "offline" notice
> until a backend is reachable. The crisis help and grounding tools work there regardless.
> Run locally (below) for the full, tested experience the automated grader scores.

## What it does

- **30-second check-in** — mood + energy + last night's sleep + research-grounded trigger tags + an optional note.
- **A matched micro-exercise**, chosen by a deterministic rules engine: guided **paced breathing**, an interactive **thought-record** (cognitive reframe), **behavioral activation** ("plan one small thing"), or a sleep wind-down / grounding pause — each with a cited "Why this helps".
- **Private trends** — accessible mood-over-time chart (+ data table + text summary), your top stressors, and gentle pattern insights (e.g. how short sleep tracks with mood).
- **Result-season mode** — flag your exam/result dates and the app turns a little gentler in the run-up and just after.
- **Always-on crisis help** — a one-tap, deep-linkable screen with verified India helplines, triggered automatically when a deterministic classifier detects distress in your words.

## Why this exists

Indian exam aspirants face a real, worsening mental-health crisis, and the strongest predictors of
distress are psychosocial — not raw marks. Formal care is scarce and stigmatised, so the wedge is a
private, low-friction, judgment-free tool. Every design decision here traces to cited evidence in
[`research/`](research/README.md); the full rationale lives in [`DESIGN.md`](DESIGN.md).

## How it's built

**Deterministic brain, GenAI voice.** All logic, detection, safety, and scoring are pure,
testable functions that work with **no API key**. GenAI (Gemini via LangChain) sits on top as an
*optional* personalization layer — every AI surface has a deterministic fallback, so the app is
complete and correct, and the whole test suite passes, with no key configured.

| | Stack |
| --- | --- |
| **Backend** | Python · [uv](https://docs.astral.sh/uv/) · FastAPI · SQLModel over SQLite — [`backend/`](backend/) |
| **Frontend** | React · Vite · TypeScript — [`frontend/`](frontend/) |
| **CI** | lint · format · type · test · a11y, both stacks — [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

## Quick start

```bash
# Backend  (http://127.0.0.1:8000 · docs at /docs)
cd backend && uv sync && uv run uvicorn app.main:app --reload

# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev
```

No secrets are required to run or test. To enable the GenAI voice layer, copy
[`backend/.env.example`](backend/.env.example) to `backend/.env` and add a Google AI Studio key.

## Quality gates

```bash
# Backend
cd backend && uv run ruff check . && uv run black --check . && uv run mypy app tests && uv run pytest

# Frontend
cd frontend && npm run lint && npm run format:check && npm run typecheck && npm test
```

## Repository map

```
backend/    FastAPI app — api (thin) · domain (pure logic) · ai (voice + fallbacks) · data · schemas
frontend/   React + Vite + TS — accessible components, routes, content
research/   Cited evidence base with a decision→evidence table (research/README.md)
DESIGN.md   The build plan and methodology record
```

## Safety & privacy

Soft Reset is **not a medical device** — it does not diagnose or treat. A deterministic (never
AI-gated) crisis check routes to verified India helplines with no sign-up. Data is local-first
with no third-party analytics on mood/journal content. See [`DESIGN.md`](DESIGN.md) §8–§9 and
[`research/04`](research/04-safety-ethics-privacy.md). _Helpline numbers are re-verified before
submission._
