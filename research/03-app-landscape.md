# Mental-Wellness & Mood-Tracking App Landscape

Competitive research for a mood/wellness tracker, with a specific lens on Indian competitive-exam aspirants (NEET / JEE / UPSC / board / CAT). Covers global leaders and India/SEA-focused products. Date: 2026-06-06.

> Methodology note: Feature claims are drawn from official sites, app-store listings, and credible reviews/teardowns (cited in **Sources**). Where a claim could not be verified to an authoritative source, it is marked **(reported/unverified)**.

---

## Key Takeaways

1. **Two dominant input paradigms.** (a) Ultra-low-friction "emoji/face scale + activity tags" two-tap logging (Daylio, Finch); (b) emotion-vocabulary models that prioritize granularity over speed (How We Feel's 144-word Mood Meter). A credible product needs the fast path as default and can layer granularity optionally.

2. **"Year in Pixels" + correlation stats are the de-facto visualization standard.** Daylio popularized the pixel mosaic; Bearable popularized factor-vs-outcome correlation ("what improves/worsens my mood"). Both are now widely copied and effectively table stakes for credibility.

3. **The market is bifurcating into trackers vs. chatbots/content libraries.** Pure trackers (Daylio, Bearable, How We Feel, Moodfit) vs. chatbot/coaching/content platforms (Wysa, Woebot, Intellect, Amaha, Calm, Headspace). AI is moving fast: Woebot — the FDA-recognized CBT chatbot pioneer — shut down its consumer app on 30 June 2025, citing inability to ship LLM features under existing regulation. This is a cautionary signal for over-medicalizing.

4. **AI personalization is the new battleground but mostly shallow.** Stoic uses on-device foundation models for personalized prompts and "chapters"; Headspace shipped an AI companion ("Ebb"); most "personalization" elsewhere is still rules-based (mood-triggered content suggestions). On-device privacy framing (Stoic) is a differentiator.

5. **No major product is purpose-built for Indian exam aspirants and their specific triggers.** Global trackers are culturally neutral; India apps (Amaha, Wysa, YourDOST, Evolve, Intellect) are general-purpose or workforce/clinical. Only nascent players (MannSetu's "Mithra", Gyanis' "Aura") explicitly name JEE/NEET/UPSC pressure, family expectations, and Hinglish — and they are early-stage **(reported/unverified at scale)**. The context is acute: research cited in 2025 reports ~80% of Kota coaching students experience anxiety and ~40% show depression symptoms; NEET-linked student suicides reportedly rose from 4 (2021) to ~32 (2025), prompting a Supreme Court National Task Force in Sept 2025. This is a large, underserved, high-stakes wedge.

6. **Engagement is solved by gamification + ritual, not features.** Finch (virtual pet that grows when you self-care) and Daylio (streaks, achievements, daily reminders) show that retention comes from a daily ritual and low guilt, not from analytical depth.

---

## Table-stakes features

The minimum a credible mood/wellness tracker must ship to be taken seriously in 2026:

1. **One- to two-tap daily mood log** with a small ordinal scale rendered as emoji/faces (the Daylio standard: pick mood → pick activities → done in <30s). Speed and low guilt are the product.
2. **Activity / context tagging** via an icon grid of customizable factors (sleep, study hours, social, exercise, food, etc.) so mood can later be correlated with behavior.
3. **Optional micro-journaling** on the same entry — free text, prompts/templates, and ideally photo or voice note attachment.
4. **Trend visualization**: a calendar/"Year in Pixels" mosaic + mood-over-time line chart; weekly/monthly summaries.
5. **Correlation / insight generation**: surface "what's associated with your better/worse days" (the Bearable model), not just raw charts.
6. **Reminders + streaks/achievements** to build the daily ritual, with a no-punishment, no-guilt tone (Finch's design principle).
7. **Privacy posture**: local/encrypted data, export, and delete (Bearable, Stoic make this explicit; expected by mental-health users).

Validated clinical assessments (PHQ-9 depression / GAD-7 anxiety) — as in Moodfit — are a strong "credibility plus" tier-1.5 feature, valuable but not strictly required for a consumer tracker.

---

## Differentiation opportunities (exam aspirants)

A mood tracker built for Indian competitive-exam aspirants can own ground that no incumbent occupies:

1. **Exam-native context tags & triggers.** Instead of generic "work/social" tags, ship aspirant-specific ones: *mock test today, mock score/percentile, rank change, doubts cleared, backlog/syllabus pending, coaching class, revision, parents called about results, peer comparison, sleep before exam, screen/social-media doom-scroll*. This makes correlations actionable for the exact stressors incumbents ignore (mock results, ranking, coaching pressure).

2. **Mock-result-aware check-ins.** Trigger a check-in and tailored coping flow *around* mock/test events (before: anxiety prep; after a bad score: rumination/self-worth reframe via CBT). No global app links emotional state to a ranking/result event.

3. **Decoupling self-worth from rank.** A CBT/ACT content track specifically targeting the "I am my rank" cognitive distortion, peer-comparison spirals, and parental-expectation guilt — culturally framed, not Western-generic.

4. **Vernacular + Hinglish, voice-first.** Hindi/Hinglish (and ideally Tamil/Telugu/etc.) text and voice input lowers friction for the actual user base; MannSetu's "Mithra" gestures at this but is early. Voice check-ins suit late-night study fatigue.

5. **Study-mood correlation as a study tool, not just wellness.** "You score better on mocks the day after 7+ hrs sleep" / "your focus drops on days after a parent call." Frame insights as performance optimization — this reframes a wellness app as a *prep* tool the user already wants, sidestepping mental-health stigma.

6. **Crisis safety net wired for India.** Integrated, prominent routing to Tele-MANAS, iCALL, and KIRAN helplines + escalation when mood/risk signals spike. Given the documented suicide crisis, this is both ethical necessity and trust differentiator.

7. **Low-cost / freemium for students** + offline-friendliness for hostel/Wi-Fi-spotty Kota/Delhi environments. Most premium incumbents price for Western/urban-professional wallets.

8. **Anonymous-first.** Aspirants fear stigma and parental discovery; YourDOST's anonymity is a proven draw in India. Anonymous accounts + hideable app are differentiators for this cohort.

---

## Per-app notes

### Daylio (global — micro-journaling / mood tracker)
1. **Core mechanic:** "Pick mood, pick activities" micro-journaling; entry in two taps, <30s. Optional notes, writing templates, photos, voice memos.
2. **Mood input:** Customizable 5-point ordinal scale shown as editable emoji ("Meh or Rad"); users can add/rename moods. Activity selection via icon grid (large built-in icon DB; custom activities with colors).
3. **Trend viz:** Mood-line charts, monthly/yearly stats, and the signature **"Year in Pixels"** color mosaic (one dot/day, exportable). Markets "the most advanced stats seen in mood tracker apps."
4. **Personalization:** Rules-based; no AI. Value comes from user-driven correlation stats (e.g., mood higher on exercise days).
5. **Borrow:** The two-tap ritual, customizable scale + activities, Year in Pixels, streaks/achievements/reminders, generous free tier (4.8★ at scale).
6. **Gaps:** No content/coaching, no chatbot, no clinical assessments; culturally neutral; nothing exam- or India-specific.

### How We Feel (global, free/nonprofit — Yale / Marc Brackett)
1. **Core mechanic:** Science-based emotion check-in: identify and name nuanced emotions, then tag contributing factors and optionally journal; includes a mini-course on emotions and regulation strategy videos ("Change Your Thinking," "Move Your Body," "Be Mindful," "Reach Out").
2. **Mood input:** **Mood Meter** circumplex model — pick one of four pleasantness×energy quadrants, then drill into specific emotions from **144 words**. Prioritizes granularity/vocabulary over speed.
3. **Trend viz:** Reporting feature for emotional patterns over time.
4. **Personalization:** Rules/curriculum-based strategy library; not AI-personalized.
5. **Borrow:** The quadrant→word drill-down is an excellent *optional* granularity layer; emotion-literacy education; "friends" real-time sharing; fully free (donation-funded).
6. **Gaps:** Slower than two-tap logging; no correlations/activity-factor engine; no India/exam tailoring.

### Moodfit (global — "mental fitness" toolkit)
1. **Core mechanic:** Multi-tool toolkit: mood journal + CBT thought-record tools + mindfulness/meditation + breathwork + gratitude journal + daily goals + insights + education.
2. **Mood input:** Mood logging plus activity/factor tracking (sleep, exercise, nutrition, social, medication, custom).
3. **Trend viz:** Mood-over-time analysis; insights show how sleep/exercise/nutrition/social affect mood.
4. **Personalization:** Pre-configured daily programs combine CBT + journaling + breathwork; largely rules-based.
5. **Borrow:** **Validated PHQ-9 / GAD-7 assessments** tracked over time (clinical credibility); CBT thought-challenging exercises; breathwork; configurable daily program.
6. **Gaps:** Tool sprawl can raise friction; no chatbot; no India/exam tailoring.

### Bearable (global — symptom + mood + health tracker)
1. **Core mechanic:** Track mood, emotions, sleep, energy, symptoms, medication, and unlimited custom metrics in a few taps/day; built for chronic-illness/ADHD/mental-health self-quantifiers.
2. **Mood input:** Quick mood + emotions logging alongside symptoms and custom metrics.
3. **Trend viz:** Customizable graphs, weekly reports, **Year in Pixels** (separate mood & symptom views).
4. **Personalization / insight:** Signature **"Impacts" correlation engine** — quantifies how habits/treatments correlate with mood/symptom/energy/sleep changes; supports "Experiments." Largely statistical/rules, not generative AI.
5. **Borrow:** The correlation/"what improves vs worsens" framing; custom-metric flexibility; explicit encryption + export/delete.
6. **Gaps:** Power-user complexity; premium gates historic data beyond 30 days and correlation reports; no India/exam tailoring.

### Stoic (global — AI journaling + mood)
1. **Core mechanic:** Guided journaling in ~120s with morning-prep / evening-reflection structure, prompts, mood tracking, plus meditation, breathing, and 10 "AI Mentors."
2. **Mood input:** Mood + emotions tracking attached to journaling sessions.
3. **Trend viz:** Trends view across mood, emotions, sleep, health, writing, etc.
4. **Personalization:** Strongest AI story — **on-device foundation models** analyze recent entries to generate hyper-personal prompts and context-aware sentence starters; smart reminders tied to current mood; auto-groups entries into themed "chapters" (e.g., "Work Challenges"). Privacy-forward (on-device).
5. **Borrow:** AI-personalized prompts; sentence-starter scaffolding (lowers blank-page friction); mood-aware reminders; on-device privacy framing; thematic "chapters."
6. **Gaps:** Journaling-centric (heavier than tap logging); no chatbot/coaching; no India/exam tailoring.

### Finch (global — gamified self-care pet)
1. **Core mechanic:** A virtual pet ("birb") that grows/goes on "adventures" as you complete real-life self-care tasks; checklist of curated/self-added goals with rewards; reflection prompts, breathing, gentle social goal-sharing.
2. **Mood input:** Daily check-in with **1–5 scales** — motivation via *weather icons*, current feeling and day-satisfaction via *facial expressions*; emotion tracking and self-report quizzes (anxiety, body image). Builds a pattern profile over time.
3. **Trend viz:** Check-ins aggregate into mental-health pattern insights (reported).
4. **Personalization:** Rules/gamification-driven; curated task suggestions.
5. **Borrow:** **Gamification loop** (pet thrives when you self-care) and the **no-pressure/no-punishment** tone are the retention masterclass; multi-dimension 1–5 icon scales; quizzes embedded in check-in.
6. **Gaps:** Light on analytics/correlation; no clinical tools; no India/exam tailoring.

### Headspace (global — meditation + content + AI)
1. **Core mechanic:** Large guided-content library (1,000+ meditations, courses, skill-building, SOS sessions for acute stress).
2. **Mood input:** Mood check-ins during onboarding and **post-session mood logging**; can tag stressors like *work, school, finances*.
3. **Trend viz:** Mood logs feed personalized suggestions; self-reflection over time.
4. **Personalization:** Focus-area selection refines suggestions (rules) + **"Ebb" AI companion** for guidance.
5. **Borrow:** Post-session mood logging tying state to an intervention; SOS short sessions for acute moments; themed high-pressure-period content (a model for "exam-season" packs).
6. **Gaps:** Content-first, not a tracker; subscription priced for Western wallets; no exam/India tailoring (though "school" stressor tag exists).

### Calm (global — sleep/relaxation + content)
1. **Core mechanic:** Meditation + sleep content; celebrity-narrated **Sleep Stories**, soundscapes, guided sleep meditations.
2. **Mood input:** Mood check-in / tracking present but secondary to content **(reported; less prominent than Headspace's)**.
3. **Trend viz:** Limited; content-led rather than analytics-led.
4. **Personalization:** Onboarding goals → content recommendations (rules).
5. **Borrow:** Sleep content (directly relevant to sleep-deprived aspirants); soundscapes for focus/study; premium-content polish.
6. **Gaps:** Not a serious tracker; subscription cost; no exam/India tailoring.

### Woebot (global — CBT chatbot) — SHUTDOWN
1. **Core mechanic:** Conversational CBT "relational agent"; 24/7 scripted chat support; ~1.5M users over its life; held an FDA Breakthrough Device Designation (WB001, postpartum depression).
2. **Input:** Conversational; mood/feeling captured in dialogue.
3. **Personalization:** **Rules-based, pre-scripted** dialogues (not generative), despite a ChatGPT-like feel.
4. **Status / lesson:** Consumer app shut down **30 June 2025**; founder cited cost of FDA marketing authorization and inability to ship LLM features under current regulation; pivoted to enterprise. **Lesson: over-medicalizing into a regulated device is a strategic trap for a consumer tracker; keep wellness positioning.**
5. **Gaps:** Now unavailable to consumers; never India/exam-specific.

### Wysa (India-origin — AI mental-health chatbot)
1. **Core mechanic:** AI chatbot (the penguin) guiding users to a library of CBT/DBT/mindfulness/breathing tools; three modes — free AI chat, self-help tool library, and human emotional-wellbeing coaching.
2. **Input:** Free-text conversational; emotion expressed in chat.
3. **Personalization:** Bot routes to relevant exercises; rules + NLP (not fully generative historically).
4. **Borrow:** Anonymous, judgment-free 24/7 chat; evidence-based tool library; **WhatsApp pilot in India** (meets users where they are); strong research/clinical validation; recognized at India AI Impact Summit 2026.
5. **Gaps:** General-purpose; not exam-cohort-tailored; depth-of-tracking is secondary to chat.

### Intellect (India/SEA + global — workforce mental health)
1. **Core mechanic:** Self-guided CBT learning paths (procrastination, stress, relationships, sleep, anxiety) + behavioral-health coaching + therapy/psychiatry; serves employers (4M+ members, 100+ countries, 120+ languages).
2. **Mood input:** Mood tracker that **identifies causes and suggests personalized coping** (a learning path, a short "rescue session," or journaling).
3. **Trend viz:** Pattern surfacing tied to recommended actions (reported).
4. **Personalization:** Rules-based recommendation from mood → intervention; human coaching layer.
5. **Borrow:** **Mood → recommended micro-intervention ("rescue session")** routing; short learning paths; multilingual; coach escalation path.
6. **Gaps:** B2B/employer-centric; not student/exam-facing; consumer access often via employer.

### Evolve (India — self-care, meditation, LGBTQ+ focus)
1. **Core mechanic:** 100+ guided meditations, breathing, sleep audios, affirmations, journaling prompts; CBT/DBT/mindfulness-based; differentiator is curated LGBTQ+ content (homophobia, coming out, identity).
2. **Mood input:** Journaling + gratitude/daily prompts (mood tracking secondary; **reported**).
3. **Trend viz:** Limited/content-led.
4. **Personalization:** Cohort-tailored content (LGBTQ+) — a **proof point that niche-cohort tailoring works in India** (1.5M+ users, 4.7★).
5. **Borrow:** The thesis itself — *deeply tailoring content to a specific underserved cohort's lived stressors* — is exactly the exam-aspirant playbook.
6. **Gaps:** Not an analytics tracker; different cohort; no exam tailoring.

### YourDOST (India — online counseling / emotional wellness)
1. **Core mechanic:** Human counseling marketplace — 24/7 chat/audio/video with 1000+ experts (psychologists, psychiatrists, coaches); 300+ institutional/college clients; self-help tools and assessments.
2. **Input:** Conversational with humans; self-assessment tests.
3. **Personalization:** Human-led; plus self-awareness content and assessments.
4. **Borrow:** **Anonymous, confidential, multilingual** positioning (proven stigma-reducer in India); strong **institutional/college distribution** channel — a viable GTM for reaching aspirants via coaching institutes/colleges.
5. **Gaps:** Counseling-marketplace, not a daily self-tracking product; not exam-trigger-aware in-product.

### Amaha / formerly InnerHour (India — clinical + self-care)
1. **Core mechanic:** Condition-oriented (anxiety, depression, bipolar, ADHD, OCD, addiction); 500+ CBT/mindfulness/positive-psychology self-help tools; "Allie" chatbot; therapy + psychiatry; community groups.
2. **Mood input:** Daily mood tracker with **weekly mood chart**.
3. **Trend viz:** Weekly mood chart; condition-linked tracking.
4. **Personalization:** Allie chatbot identifies difficulty and suggests calming activities (rules/NLP); clinical pathways.
5. **Borrow:** Mood → instant calming activity via chatbot; condition-specific tool libraries; integrated clinical escalation; community.
6. **Gaps:** Clinically framed (stigma for students); general-purpose; no exam tailoring.

### Exam/student-specific tools (India, nascent)
- **MannSetu ("Mithra AI")** — explicitly **exam-stress-aware**: 24/7 AI with **voice therapy**, **Hindi/English/Hinglish**, **mood tracking during exam season**, content tailored to **JEE/NEET/UPSC/board**, cultural awareness of family/system pressure, and crisis routing (Tele-MANAS, iCALL). Closest to the target thesis; early-stage **(reported/unverified at scale)**.
- **Gyanis ("Aura")** — AI "Study OS" for K-12/JEE/NEET/UPSC bundling study plans with a wellness feature connecting students to licensed psychologists for exam stress/burnout **(reported/unverified)**.
- **TalktoAngel** — India online-counseling marketplace; publishes UPSC/NEET anxiety guidance; therapist-led, not a tracker.
- **Brightn** (global, student-focused) — AI mood tracking + journaling prompts + goal-setting linking emotional wellness to academic achievement; a model for the "wellness-as-performance" framing, though not India/exam-specific.
- **Exam Support** — guided-audio meditation app narrowly for test/exam anxiety; single-purpose, no tracking.

**Cross-cutting gap:** None of these combines (a) fast daily mood logging, (b) exam-specific triggers/tags, (c) mock-result-aware check-ins, (d) study-performance correlation, (e) vernacular voice input, and (f) India crisis routing in one low-friction consumer product. That intersection is open.

---

## UX patterns to copy

For a fast, low-friction daily check-in:

1. **Two-tap default (Daylio):** Open → pick a face → pick activity tags → saved. Everything else (notes, voice) is optional and one tap deeper. Target <30s; make logging itself the core loop.
2. **Customizable emoji/face ordinal scale (Daylio/Finch):** Default ~5 levels rendered as faces; let users rename/recolor. Faces beat numbers for emotional self-report and are language-agnostic — useful for vernacular users.
3. **Multi-dimension icon scales (Finch):** Separate quick 1–5 reads for *motivation* (weather icons), *current feeling*, and *day satisfaction* (faces). For aspirants, mirror this with *mood / energy / study-confidence*.
4. **Icon-grid context tagging (Daylio/Bearable):** A scannable, customizable icon grid for factors; pre-load exam-specific tags. Drives the correlation engine downstream.
5. **Optional emotion drill-down (How We Feel):** Offer the quadrant→specific-word path as an *optional* "go deeper" layer for users who want granularity, without slowing the default.
6. **Sentence-starter prompts (Stoic):** When journaling, pre-fill context-aware starters to kill the blank-page problem; tie prompts to the day's mood/event (e.g., post-mock).
7. **Year-in-Pixels mosaic + correlation cards (Daylio + Bearable):** The pixel grid for emotional payoff/streak motivation; plain-language "insight cards" ("better days correlate with 7+ hrs sleep") for actionability.
8. **Gamified, guilt-free ritual (Finch):** Reward consistency (pet growth / streaks / achievements) and *never* punish missed days; gentle, supportive copy — critical for an anxious, self-critical exam cohort.
9. **Event-triggered & mood-aware reminders (Stoic/Intellect):** Replace generic nudges with check-ins tied to context — before/after a mock test, late-night study, or a flagged low-mood streak that routes to a "rescue session" or helpline.
10. **Voice-first, vernacular input (MannSetu/Wysa-on-WhatsApp):** Let tired users speak in Hinglish instead of typing; consider WhatsApp as a zero-install surface.

---

## Sources

**Daylio**
- https://daylio.net/
- https://apps.apple.com/us/app/daylio-journal-daily-diary/id1194023242
- https://play.google.com/store/apps/details?id=net.daylio&hl=en_US
- https://calmevo.com/daylio-review/
- https://www.choosingtherapy.com/daylio-app-review/
- https://en.wikipedia.org/wiki/Daylio
- https://www.androidpolice.com/i-used-daylio-track-moods-for-month/

**How We Feel**
- https://marcbrackett.com/how-we-feel-app-3/
- https://apps.apple.com/us/app/how-we-feel/id1562706384
- https://play.google.com/store/apps/details?id=org.howwefeel.moodmeter&hl=en_US
- https://medicine.yale.edu/news-article/the-how-we-feel-app-helping-emotions-work-for-us-not-against-us/

**Moodfit**
- https://www.getmoodfit.com/
- https://apps.apple.com/us/app/moodfit-mental-health-tools/id1054458809
- https://play.google.com/store/apps/details?id=com.robleridge.Moodfit&hl=en_US

**Bearable**
- https://bearable.app/
- https://play.google.com/store/apps/details?id=com.bearable&hl=en_US
- https://apps.apple.com/us/app/bearable-symptom-tracker/id1482581097
- https://bearable.app/depression-tracker/

**Stoic**
- https://www.getstoic.com/
- https://www.getstoic.com/blog/stoic-foundation-model-ai-features
- https://apps.apple.com/us/app/stoic-journal-mental-health/id1312926037

**Finch**
- https://apps.apple.com/us/app/finch-self-care-pet/id1528595748
- https://www.yogajournal.com/lifestyle/finch-self-care-app/
- https://www.cltcounseling.com/all-resources/finch-habit-tracker-app-review
- https://yourstory.com/2022/06/app-review-self-care-pet-finch-gamifies-mental-wellbeing

**Headspace & Calm**
- https://www.headspace.com/app
- https://www.themindfulnessapp.com/articles/best-meditation-apps-features-comparison-2025
- https://halomentalhealth.com/b/calm-vs-headspace

**Woebot (shutdown)**
- https://www.statnews.com/2025/07/02/woebot-therapy-chatbot-shuts-down-founder-says-ai-moving-faster-than-regulators/
- https://www.mobihealthnews.com/news/woebot-health-shutting-down-its-app
- https://hlth.com/insights/news/woebot-health-is-shutting-down-its-app-2025-04-28

**Wysa (India)**
- https://www.wysa.com/
- https://play.google.com/store/apps/details?id=bot.touchkin&hl=en_IN
- https://techcrunch.com/2022/07/14/wysa-20-million-series-b-funding-expand-therapist-chatbot-wider-mental-health-services/
- https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2022.847991/full

**Intellect (India/SEA)**
- https://intellect.co/
- https://apps.apple.com/us/app/intellect-create-a-better-you/id1483308512
- https://techcrunch.com/2020/11/30/singapore-based-mental-health-app-intellect-reaches-one-million-users-closes-seed-funding/

**Evolve (India)**
- https://play.google.com/store/apps/details?id=in.evolve.android&hl=en_IN
- https://apps.apple.com/in/app/evolve-mental-health-partner/id1515433542
- https://yourstory.com/2022/07/mental-wellness-app-evolve-lgbtq-community-healthtech-startup

**YourDOST (India)**
- https://yourdost.com/
- https://yourstory.com/herstory/2021/08/woman-entrrepreneur-emotional-wellbeing-yourdost
- https://wellness.iisc.ac.in/index.php/your-dost/

**Amaha / InnerHour (India)**
- https://play.google.com/store/apps/details?id=com.theinnerhour.b2b&hl=en_IN
- https://www.amahahealth.com/about/
- https://apps.apple.com/us/app/amaha-mental-health-self-care/id1323264990

**Exam / student-specific & India context**
- https://www.mannsetu.com/blog/exam-stress-management-hindi-english
- https://www.mannsetu.com/blog/student-mental-health-india
- https://www.toolify.ai/tool/gyanis-ai
- https://www.talktoangel.com/blog/coping-with-anxiety-before-upsc-and-neet-exam
- https://www.brightn.app/post/5-ways-mood-tracking-improves-student-performance
- https://www.theweek.in/news/health/2025/09/10/the-pressure-cooker-effect-student-mental-health-under-siege-in-india-s-education-system.html
- https://www.thehansindia.com/news/national/neet-student-suicides-reach-record-high-in-2025-kota-emerges-as-major-hotspot-1079305
- https://journals.sagepub.com/doi/10.1177/09731342251359022 (Kota coaching aspirants — anxiety/depression/suicide study)
- https://www.medboundtimes.com/fitness-and-wellness/mental-health-apps-india-statistics-guide

> **Verification caveats:** Calm's in-app mood tracking, Evolve's mood-tracking depth, and Finch's pattern-insight reporting are described in reviews but not fully detailed on primary sources — marked reported/unverified above. MannSetu and Gyanis exam-specific claims come from the vendors' own materials and are unverified at scale.
