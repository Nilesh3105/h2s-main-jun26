# Research foundation — Mental Wellness Tracker for exam aspirants

This folder grounds the product in real evidence: the mental-health reality of Indian
competitive-exam aspirants, interventions that are actually proven to help, the existing
app landscape, safety/privacy obligations, and accessibility standards.

> Compiled 2026-06-06. Several statistics carry `{DATE}` placeholders and "verify before
> use" flags in the source files. **Re-verify any number and every helpline before it ships
> in a submission.** Aspirant-prevalence figures come from small single-site studies; cite
> them as study-specific ranges, not national rates.

## The five references

| File | What it answers |
| --- | --- |
| [`01-exam-stress-india.md`](01-exam-stress-india.md) | How bad is it, who, and what triggers it |
| [`02-evidence-based-interventions.md`](02-evidence-based-interventions.md) | Which support techniques actually work (ranked by evidence) |
| [`03-app-landscape.md`](03-app-landscape.md) | What competitors do, table-stakes features, our open lane |
| [`04-safety-ethics-privacy.md`](04-safety-ethics-privacy.md) | Crisis handling, India helplines, DPDP Act, disclaimers |
| [`05-accessibility-ux-best-practices.md`](05-accessibility-ux-best-practices.md) | WCAG 2.2 picks, component recipes, a11y CI tooling |

## One-paragraph synthesis

Indian exam aspirants face a real, worsening mental-health crisis (13,044 student suicides
recorded in 2022; a ~4x spike during result season), and the strongest distress predictors
are psychosocial — performance-contingent self-worth, having no confidant, sleeping under
six hours — not raw marks. Formal care is scarce and stigmatised (~70-92% treatment gap),
so the wedge is a **private, low-friction, anti-stigma self-serve tool**. No major app is
purpose-built for this audience. The proven "support" content is well-established (paced
breathing, cognitive reframing, behavioral activation) and is *deterministic, step-based,
and testable* — so the app's intelligence can be a rules engine, with AI only as an optional
garnish (the Woebot consumer shutdown in 2025 warns against an AI-first, medicalised posture).
Safety (always-on crisis flow to verified helplines), privacy (local-first, no tracking of
minors per the DPDP Act), and accessibility (native semantic controls, no color-only meaning)
are not extras here — they are core, and they map directly onto the evaluation rubric.

## Design decisions grounded in this research

| Decision | Rationale | Source |
| --- | --- | --- |
| Trigger taxonomy includes social/emotional/sleep tags, not just marks | Psychosocial factors predict distress better than academics | 01 |
| Result-season "support mode" tied to user-flagged exam/result dates | ~4x crisis spike in results month | 01 |
| Deterministic rules engine for "personalized support"; AI optional | Proven techniques are step-based + testable; Woebot AI-first shutdown | 02, 03 |
| Build breathing pacer, thought-record, behavioral-activation first | Strongest + most testable evidence base | 02 |
| Forgiving goals, no loss-framed streaks / leaderboards / guilt nudges | Gamification backfires for distressed users | 02 |
| Mood log is the data substrate that *triggers* tools, not the treatment | Mood tracking is largely symptom-neutral on its own | 02 |
| Use PHQ-2 / GAD-2 (not PHQ-9) if any screening; pair with crisis flow | Avoids the PHQ-9 item-9 suicidality landmine; free/public-domain | 02, 04 |
| Always-on crisis flow → Tele-MANAS 14416, KIRAN 1800-599-0019, iCALL 9152987821 | No-signup access to verified human help is a must-have | 04 |
| Local-first storage, encryption at rest, zero third-party analytics | DPDP minors rules; sensitive data; lowers Security attack surface | 04 |
| "Not a medical device" disclaimer at onboarding + persistent help area | Avoids regulated-device reclassification; ethical honesty | 04 |
| Mood scale = native radio group in `<fieldset>`, never color-only | WCAG; APG says radio group beats slider for discrete choices | 05 |
| Trend chart = SVG + real `<table>` fallback + plain-text summary | Alt text alone fails for trend data | 05 |
| CI runs `eslint-plugin-jsx-a11y` + `jest-axe` + `axe-core/playwright` | These are what an automated a11y scorer runs | 05 |
