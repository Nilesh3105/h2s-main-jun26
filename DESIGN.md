# Sukoon — Design

> A private, research-grounded wellness companion for students navigating board exams,
> competitive entrance tests (NEET, JEE, CUET, CAT, GATE, UPSC), and result season.
>
> Status: **APPROVED** · 2026-06-06 · Name *Sukoon* (सुकून, "calm").

This document is both our build plan and our methodology record. Design decisions trace to
cited evidence in [`research/`](research/README.md). It is written to serve two audiences:
the **automated code assessor** (Code Quality, Security, Efficiency, Testing, Accessibility,
Problem-Statement Alignment) and the **human reviewers** who manually review the top 10.

---

## 1. The problem and who it's for

Indian exam aspirants face a real, worsening mental-health crisis. The strongest predictors
of distress are psychosocial — performance-contingent self-worth, having no confidant, and
sleeping under six hours — *not* raw marks. Formal care is scarce and stigmatised, and crises
spike ~4x during result season. (See [`research/01`](research/01-exam-stress-india.md).)

**Primary user:** a 16-19 year old aspirant under sustained pressure who will not see a
therapist (cost, access, stigma) but *will* use a private, judgment-free, 30-second tool on
their own phone or laptop.

**The wedge:** no major app is purpose-built for this audience. Global trackers (Daylio,
Bearable) are culturally neutral; Indian apps (Wysa, Amaha, YourDOST) are general or clinical.
Exam-native triggers + result-season awareness + India-wired crisis care is an open lane.
(See [`research/03`](research/03-app-landscape.md).)

## 2. Product principles

1. **Private by default.** Data lives locally; no third-party analytics on mood/journal data.
2. **Low friction.** Core check-in is under 30 seconds, two taps minimum.
3. **Evidence over vibes.** Every support technique traces to a cited source.
4. **Calm, not gamified-into-guilt.** Forgiving goals; never punish a missed day.
5. **AI is additive and generous, never load-bearing.** We use GenAI freely as the voice and
   personalization layer — but the app is complete and correct with no API key.
6. **Safety is core, not a feature flag.** Crisis help is always one tap away, deterministic.
7. **Not a medical device.** No diagnosis, no treatment claims, ever.

## 3. Scope

**In (MVP):**
- Daily check-in: mood (1-5) + energy/sleep + research-grounded trigger tags + optional note.
- Instant matched micro-intervention (breathing pacer / thought-record / behavioral-activation).
- Trends dashboard: mood-over-time + top triggers + plain-language correlation insight.
- Result-season mode: user-flagged exam/result dates raise supportive check-ins in the window.
- Always-on crisis flow with verified India helplines.
- "Our approach" + "Why this helps" transparency surfaces.
- GenAI Weekly Reflection (with deterministic fallback).

**Out (explicitly, for scope discipline):**
- Accounts/social/community feed, clinician portal, payments.
- Native mobile app (this is a responsive **web app**).
- Verifiable parental consent / cloud sync of minors' data (DPDP minefield — local-first sidesteps it).
- Any diagnostic scoring presented as a verdict.

## 4. The core experience (one loop)

```
CHECK IN  ── mood (faces, 1-5) + sleep + trigger tags + optional 1-line note   (<30s)
   │
REFLECT   ── deterministic rules engine matches one micro-intervention:
   │          • acute anxiety  → breathing pacer (box / 4-7-8)
   │          • self-doubt     → guided thought-record (cognitive reframe)
   │          • low motivation → behavioral-activation ("plan one small thing")
   │          • low sleep      → wind-down / consistency nudge
   │
SEE       ── mood trend (chart + table), top triggers, correlation insight cards
   │
SUPPORT   ── weekly: AI (or template) reflection; always: crisis flow if distress detected
```

## 5. Feature spec mapped to the six scoring dimensions

| Dimension | How we earn it |
| --- | --- |
| **Problem alignment** | Features are a 1:1 restatement of the prompt (track mood, identify triggers, reflect, personalized support), grounded in `research/` with a decision→evidence table. Exam-native triggers + result-season mode show domain depth. |
| **Code quality** | Typed end-to-end (Python type hints + mypy; TypeScript + tsc). ruff + black + eslint + prettier. Small, pure modules. Clear layering (api / domain / data). Conventional commits, CI green. |
| **Security** | Pydantic validation on every input. Secrets only via env (`.env.example`, never committed). All user text and all LLM I/O treated as untrusted; prompt-injection-aware prompts; output length-clamped + escaped. CORS locked. Dependency pinning. No PII to third parties. |
| **Efficiency** | Deterministic hot path (no network on check-in). LLM off the critical path: async, timeout, cached, fallback. SQLite with indices. Small Vite bundle, code-split routes, no heavy chart lib if avoidable. |
| **Testing** | pytest (rules engine = pure functions, near-100% coverage; API via TestClient) + vitest/RTL for components + jest-axe for a11y assertions + `axe-core/playwright` smoke on key routes. LLM mocked via injected fake chat model → AI paths tested deterministically. |
| **Accessibility** | Native semantic HTML; mood scale = radio group in `<fieldset>`; chart + `<table>` fallback; no color-only meaning; visible focus; `prefers-reduced-motion`. Enforced in CI by `eslint-plugin-jsx-a11y` + axe. (See [`research/05`](research/05-accessibility-ux-best-practices.md).) |

## 6. The support content (what "personalized support" actually is)

Ranked by evidence strength (see [`research/02`](research/02-evidence-based-interventions.md)):

| Technique | Evidence | App form | Build priority |
| --- | --- | --- | --- |
| Paced breathing (box, 4-7-8) | Strongest (meta-analytic) | One-tap animated pacer; breath-hold optional | **First** |
| Cognitive restructuring | Strong | Guided thought-record (situation → thought → reframe) | **First** |
| Behavioral activation | Strong | "Plan one small activity" + check-off | **First** |
| Progressive muscle relaxation | Moderate-strong (students) | Guided steps | Stretch |
| Sleep consistency | Moderate | Wind-down nudge tied to exam calendar | Second |
| Mood tracking (substrate) | Neutral on symptoms | The check-in itself; *triggers* tools, isn't the treatment | Core loop |
| Gratitude / self-compassion | Weak-moderate | Optional micro-prompts | Optional |

**Designed out** (evidence says they backfire for distressed users): loss-framed streaks,
guilt notifications, leaderboards. We use forgiving, user-set goals. If we add any screening,
it is **PHQ-2 / GAD-2** (free, public-domain, no suicidality item) paired with the crisis flow —
never presented as a diagnosis.

## 7. GenAI design — deterministic brain, GenAI voice

**Principle: the deterministic layer decides and protects; GenAI personalizes and speaks.**
All logic, detection, safety, and scoring are pure functions — testable, instant, key-free.
GenAI sits on top as the *voice, personalization, and friction-reduction* layer, and we use it
generously: nearly every user-facing sentence can be AI-personalized without ever putting AI in
charge of a decision. Every GenAI surface has a deterministic fallback, so with no key the app
is still complete and correct.

**Stack:** `langchain-google-genai` → `ChatGoogleGenerativeAI`. Model id from env `GEMINI_MODEL`
(default `gemini-3.5-flash` — confirm the exact free-tier id in Google AI Studio; the app falls
back if unavailable). Key from env `GOOGLE_API_KEY`.

**GenAI enhancement surfaces (each with a deterministic fallback):**

| # | Surface | What GenAI adds | What deterministic does | Fallback |
| --- | --- | --- | --- | --- |
| 1 | **Weekly Reflection** (flagship) | Warm narrative synthesis of the week + 1-2 nudges | Computes the week's stats | Template summary |
| 2 | **Insight narration** | Phrases a correlation warmly and personally | *Detects* the correlation | Template sentence |
| 3 | **Reframe-assist** | A gentle, balanced reframe of an anxious thought | Runs the thought-record steps | Curated reframe bank |
| 4 | **Smart prompts** | Context-aware journaling sentence-starters (kills blank page) | Knows recent state | Curated prompt bank |
| 5 | **Assisted tagging** | Reads a free note, *suggests* mood + trigger tags to confirm | Manual tagging stays primary | Manual tagging |
| 6 | **Intervention framing** | Explains, in context, why this 2-min exercise may help now | *Chooses* the exercise (rules) | Static copy |
| 7 | **"Talk it out"** (stretch, guarded) | A bounded reflective mini-chat, limited turns | Crisis classifier every turn; always routes to a tool/help | Disabled; show prompts |

**Shared architecture:** one `ai/` module of small typed functions (`reflect_week`,
`narrate_insight`, `suggest_reframe`, `suggest_prompt`, `suggest_tags`, …), each with an LLM
implementation and a deterministic fallback, chosen by a single `get_ai()` factory (LLM when a
key is present and healthy; deterministic otherwise; per-call fallback on any error / 429 / timeout).

- **Progressive enhancement:** the deterministic result renders immediately; the AI version
  augments or replaces it when it returns, and is always skippable. The check-in hot path stays
  instant and never waits on the network.
- **Testability:** inject a `FakeChatModel` → every AI surface is tested deterministically with
  no network (prompt assembly, output clamping, fallback-on-error). Fallbacks unit-tested directly.
- **Security/safety:** all user text is untrusted — delimited input sections, injection-resistant
  system prompts, output length/schema clamp, React-escaped on render. The deterministic **crisis
  classifier runs before any LLM call on user text**; the LLM is forbidden method/diagnosis content
  and **never gates safety or any decision**. (See [`research/04`](research/04-safety-ethics-privacy.md).)

## 8. Safety & crisis flow (always on)

- A deterministic classifier (curated phrase/pattern list, not the LLM) scans check-in notes
  and journal text for self-harm / suicidal ideation.
- On trigger (or any time, via a persistent "Need to talk now?" affordance): show a calm,
  safe-messaging screen with **verified helplines** — **Tele-MANAS 14416**, **KIRAN
  1800-599-0019**, **iCALL 9152987821**, plus emergency **112** — reachable with **no
  sign-up and no paywall**, and offline-cached.
- Safe-messaging copy: warm, validating, never clinical, never describing methods, never
  shaming. (Samaritans / #chatsafe / WHO guidance.)
- A "**not a medical device**" disclaimer at onboarding and in the persistent help area.
- *(Re-verify every helpline number on submission day — NGO lines drift.)*

## 9. Privacy & data

- **Local-first.** Mood/journal data persists on-device by default (browser storage and/or a
  local SQLite the user owns). No third-party analytics, no trackers on sensitive screens.
- Under-18 users are "children" under the **DPDP Act 2023**; cloud sync would require
  verifiable parental consent and bans behavioral tracking of minors. We avoid the whole
  category by staying local-first for the MVP.
- Encryption at rest for any stored sensitive data; one-tap **export** and **delete**.
- Consent + purpose-limitation copy at onboarding, in plain language.

## 10. Architecture & stack

```
sukoon/
├── backend/                 # Python + uv
│   ├── app/
│   │   ├── api/             # FastAPI routers (thin)
│   │   ├── domain/          # PURE logic: rules engine, crisis classifier, insights
│   │   ├── ai/              # ReflectionGenerator interface + LLM/Template impls
│   │   ├── data/            # SQLModel models + repository
│   │   └── schemas/         # Pydantic request/response models
│   └── tests/               # pytest
├── frontend/                # React + Vite + TypeScript
│   ├── src/
│   │   ├── routes/          # check-in, dashboard, journal, approach, crisis
│   │   ├── components/      # accessible primitives (MoodScale, TrendChart, ...)
│   │   ├── lib/             # api client, hooks
│   │   └── content/         # interventions + evidence citations (data, not code)
│   └── tests/               # vitest + RTL + jest-axe
├── research/                # cited evidence base (already written)
├── .github/workflows/       # CI: lint + type + test + a11y, both stacks
└── DESIGN.md
```

- **Backend:** Python + **uv**, **FastAPI** (async, Pydantic validation, `TestClient`), data
  via **SQLModel** over **SQLite** (zero-config, reproducible in the grader's clean env).
- **Frontend:** **React + Vite + TypeScript**, Vitest + Testing Library, jest-axe.
- **Why the domain layer is pure:** the rules engine and crisis classifier are pure functions
  with no I/O — trivially testable, instant, and the source of "personalized support" that
  works without any AI. This single decision lifts Testing, Efficiency, and Security at once.

## 11. Data model (sketch)

- `CheckIn`: id, timestamp, mood (1-5), sleep_hours, energy (1-5), note (optional).
- `TriggerTag`: id, label, category (academic | social | physical | emotional).
- `CheckInTrigger`: check_in_id ↔ trigger_id (many-to-many).
- `InterventionEvent`: check_in_id, technique, completed (bool), timestamp.
- `ExamDate`: label, date, kind (exam | result) → drives result-season mode.
- `WeeklyReflection`: week_start, body, source (`ai` | `template`), generated_at (cache).

## 12. Testing strategy

- **Domain (highest coverage):** rules engine mood+trigger→intervention mapping; crisis
  classifier (positive + negative + tricky phrasings); insight/correlation computations.
- **API:** FastAPI `TestClient` happy + validation-failure paths; 422 on bad input.
- **AI:** inject `FakeChatModel`; assert prompt construction, output clamping, and that
  errors/timeouts fall back to template. No real network in tests.
- **Frontend:** RTL for the check-in flow, MoodScale keyboard operation, chart table fallback;
  **jest-axe** assertion per component; `axe-core/playwright` smoke on check-in/dashboard/journal.
- CI fails the build on lint, type, test, or a11y violations.

## 13. Accessibility plan (the high-leverage picks)

- Mood scale = **native radio group** in `<fieldset>`/`<legend>`, styled as faces, each with a
  text label ("Very low" … "Great") — never emoji/color alone.
- Trend chart = SVG (`aria-hidden`) + plain-text trend summary + a real `<table>` fallback.
- Visible focus everywhere (no bare `outline:none`); 4.5:1 text / 3:1 UI contrast; target
  size ≥24px; `prefers-reduced-motion` gates all animation.
- Forms: programmatic labels, `aria-required`, `aria-invalid` + `aria-describedby`, `role="alert"`
  for dynamic errors, focus moved to first error.

## 14. Conveying our research & methodology (without boasting)

The principle: **citations read as care; adjectives read as boasting.** We show the work where
it is also good product:

1. **"Why this helps"** one-liners + source on each intervention (trust feature).
2. **"Our approach" page**: plain-language methodology, how suggestions are chosen, privacy
   stance, "not a medical device" — linked to `research/`.
3. **`research/` folder + README** with the decision→evidence table, visible on repo open.
4. Commit messages and this doc trace decisions to evidence.

No "extensively researched" copy anywhere. Let the citations and the result-season nuance speak.

## 15. Build milestones

1. **Skeleton + CI green.** uv backend, Vite frontend, SQLite, one passing test each side, CI
   running lint+type+test+a11y. (Proves the rubric scaffolding before features.)
2. **Core loop, deterministic.** Check-in (accessible MoodScale + triggers) → rules engine →
   one intervention (breathing). Persist + read back. Full tests.
3. **Trends + insights.** Accessible chart + table + correlation cards. Result-season dates.
4. **Two more interventions** (thought-record, behavioral activation) + crisis flow + helplines.
5. **GenAI layer.** Weekly Reflection + insight narration + smart prompts + assisted tagging +
   reframe-assist + intervention framing, each with a deterministic fallback and fully mocked
   tests. (Guarded "talk it out" mini-chat is a post-MVP stretch.)
6. **Transparency surfaces + polish.** "Why this helps", "Our approach", empty/error states,
   reduced-motion, dark mode, copy pass. Final a11y + security sweep.

Order matters: a deterministic, tested, accessible app exists by milestone 4 — so even if the
AI layer is cut for time, the submission still scores across all six dimensions.

## 16. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Grader runs with no API key | AI is fallback-by-default; app + tests fully green without a key |
| Gemini free-tier rate limits (429) | Per-request fallback to template; weekly cache; never on hot path |
| Scope creep eats testing/a11y time | Milestone 4 is a complete scoring-ready app; AI + polish are after |
| Mishandling crisis content | Deterministic classifier + safe-messaging + verified helplines; LLM never gates safety |
| Stale helpline numbers / stats | "Verify before ship" flags throughout; re-check on submission day |
| Wrong model id breaks AI | Env-config + graceful fallback; confirm id in AI Studio |

## 17. Resolved decisions (2026-06-06)

- **Name:** Sukoon.
- **Storage:** backend SQLite is the source of truth — single local user, no auth for MVP, no
  third-party analytics, data stays in-app, with export + delete. ("Local-first" here means no
  accounts / no third-party sharing — not browser-only, since the AI reflection needs the data
  server-side.)
- **Language:** English-first, i18n-ready structure, with tasteful Hinglish microcopy touches.
  Full multi-language is out of MVP scope.
- **"Talk it out" chat:** out of MVP; a clearly-scoped stretch only if milestones 1-6 finish with
  time to spare.

**Next step:** milestone 1 — scaffold repo (uv + FastAPI + SQLite backend, Vite + TS frontend),
one passing test per side, CI running lint + type + test + a11y.
