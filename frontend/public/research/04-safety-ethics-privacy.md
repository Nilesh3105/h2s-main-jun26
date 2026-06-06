# Safety, Ethics & Privacy Guidance for a Student Mental-Health App (India)

> **WARNING — READ BEFORE SHIPPING.** This document is product/engineering research, **not legal advice and not clinical advice**. Every helpline number below must be **re-verified against its official source on the day you ship and on a recurring schedule** (numbers and hours change). Where a contact could not be confirmed against an official/government source it is flagged **"VERIFY BEFORE USE"**. Crisis-handling and clinical-scope decisions must be reviewed by a licensed mental-health professional and an Indian privacy/data-protection lawyer before release. The target users are **Indian students, many of them minors aged 16–18** — under Indian law (DPDP Act 2023) *everyone under 18 is a "child"* and triggers the strictest obligations in the statute.
>
> Access date for all sources below: **{DATE}** (replace with the actual verification date).

---

## Key Takeaways

1. **You are building a non-clinical wellness tool, not a therapist or a diagnostic device.** Position it explicitly as general-wellness support; never claim to diagnose, treat, cure, or prevent any condition. Diagnostic/treatment claims can reclassify the product as a regulated medical device and create legal/clinical liability. *(Best practice + regulatory.)*
2. **Crisis handling is the single highest-risk feature.** When a user expresses distress or suicidal ideation, the app must respond with calm, non-judgmental copy, surface verified human crisis resources immediately, and **never** offer method information, deny the feelings, gate help behind a paywall/sign-up, or pretend to be a clinician. Follow safe-messaging principles (Samaritans / #chatsafe / WHO).
3. **Under India's DPDP Act 2023, mood/journal data is sensitive personal data about (often) minors.** Three obligations directly shape architecture: (a) **consent must be free, specific, informed, and purpose-limited** with the ability to withdraw and erase; (b) **verifiable parental consent is mandatory for users under 18**, and behavioural tracking + targeted ads at children are prohibited; (c) **data minimization** — collect only what is needed. This pushes strongly toward **local-first storage, encryption at rest, and zero third-party trackers/analytics on health data.**
4. **No dark patterns for vulnerable users.** Avoid guilt-inducing streaks, loss-framed notifications, manipulative retention loops, and FOMO. Engagement must serve wellbeing, not the metrics dashboard.
5. **If an LLM is in the loop, it is an assistant, never a clinician.** Guardrails for self-harm/crisis detection, prompt-injection resistance, refusal of method/unsafe content, and hard hand-offs to human helplines are mandatory. LLMs are known to be jailbreakable into giving harmful self-harm content and to be sycophantic — design defensively.
6. **Decriminalization context (India):** Under Section 115 of the Mental Healthcare Act 2017, a person who attempts suicide is presumed to be under severe stress and is *not* to be punished — frame everything around care and help-seeking, never shame or legal threat.

---

## India crisis resources (verify before shipping)

> Re-verify each number and the hours on the day of release. Short codes (like 14416) and toll-free numbers can change or be regionally routed. Prefer surfacing the **government Tele-MANAS line first** as the primary 24/7 national option, with NGO lines as alternates.

| Service | Number(s) | Hours / Languages | Run by | Official / source URL | Status |
|---|---|---|---|---|---|
| **Tele-MANAS** (National Tele Mental Health Programme) | **14416** (short code); alt toll-free **1-800-891-4416** | 24×7; English + 20 regional languages | Ministry of Health & Family Welfare, Govt. of India | telemanas.mohfw.gov.in; PIB press releases (PRID 1866498, NoteId 153277) | **Verify** — confirmed via mohfw.gov.in search result; .gov.in site cert failed direct fetch, re-check live before ship |
| **KIRAN** Mental Health Rehabilitation Helpline | **1800-599-0019** | 24×7; 13 languages | DEPwD, Ministry of Social Justice & Empowerment, Govt. of India | pib.gov.in PRID 1652240 / 1651963 | **Verified** against PIB (Govt. of India) press release |
| **iCALL** Psychosocial Helpline | **9152987821** | Mon–Sat, 10am–8pm | TISS (School of Human Ecology), Mumbai | icallhelpline.org; tiss.ac.in | **Verified** against icallhelpline.org (TISS). Email: icall@tiss.ac.in |
| **AASRA** | **+91-9820466726** / **+91-22-27546669** | 24×7 (verify) | AASRA (NGO), Navi Mumbai | aasra.info | **VERIFY BEFORE USE** — multiple numbers circulate; confirm the current 24×7 line on aasra.info before ship |
| **Vandrevala Foundation** | **1860-2662-345** and **1800-2333-330** | 24×7, 365 days; ~11 languages; phone/text/chat | Vandrevala Foundation (NGO) | vandrevalafoundation.com | **VERIFY BEFORE USE** — NGO number; confirm current line and that it is still free/24×7 |
| **Snehi** | **+91-9582208181** (telephonic); centre: **011-65978181** | Daily ~2pm–6pm (verify) | Snehi (NGO), Delhi/NCR | snehi.org.in | **VERIFY BEFORE USE** — limited hours; confirm before listing as crisis option |

**Verification method used:** Tele-MANAS and KIRAN were cross-checked against Government of India sources (mohfw.gov.in / pib.gov.in). iCALL was confirmed against the operator's own official site (TISS). AASRA, Vandrevala, and Snehi appear across aggregators with **inconsistent numbers** and are marked VERIFY BEFORE USE — confirm each against the NGO's own current website before they go into the app.

**Also surface in-app:** national emergency **112**. For minors specifically, consider including **CHILDLINE 1098** (child helpline) where relevant. *(Verify 1098 routing/scope before listing.)*

---

## Crisis-handling UX do/don't

Grounded in Samaritans media/online-content guidance, the #chatsafe framework for communicating safely about suicide online, and WHO/safe-messaging principles. **All crisis copy and flows must be reviewed by a licensed clinician.**

### DO
- **Detect and respond gently.** On signals of distress or suicidal ideation, switch to a dedicated, calm, validating response. Acknowledge the feeling ("It sounds like you're going through something really painful, and I'm glad you reached out").
- **Surface human help immediately and prominently.** Show the verified helplines (Tele-MANAS 14416 first), tap-to-call / tap-to-text, and emergency 112 — **without forcing sign-up, payment, or extra steps**.
- **Signpost that help exists and recovery is possible.** Safe-messaging research shows that messages emphasising help-seeking and "coming through a crisis" reduce harm.
- **Offer a grounding / safety-plan style flow** (reasons for living, people to contact, coping steps) as an *optional* supplement to — never a replacement for — human help.
- **Keep it short, concrete, and warm.** Avoid clinical jargon and avoid long walls of text in a crisis moment.
- **Make resources reachable offline / without account** so a user in crisis is never blocked by connectivity, login, or paywall.
- **Encourage telling a trusted person** (friend, family, counsellor) and reaching a professional.
- **Log the minimum necessary** to deliver the response; treat crisis events as the most sensitive data of all.

### DON'T
- **Don't describe or discuss methods** of self-harm or suicide, even if asked. This is the most consistent harm vector in safe-messaging guidance.
- **Don't sensationalise, glorify, or use loaded language** ("commit suicide", "epidemic", graphic descriptions). Prefer "died by suicide" / neutral framing.
- **Don't show graphic, distressing, or imitative content**; don't link out to forums/sites that may contain harmful content.
- **Don't dismiss, minimise, argue with, or moralise** ("you have so much to live for", "it's a sin", "others have it worse"). No guilt, no shame, no fear.
- **Don't pretend to be a human, a therapist, or a doctor.** Don't diagnose. Don't give the impression the app can keep them safe by itself.
- **Don't gate crisis help** behind onboarding, subscriptions, premium tiers, ads, or data-collection prompts.
- **Don't promise confidentiality you can't keep**, and be clear (in age-appropriate language) about what happens to crisis-related data.
- **Don't rely solely on an LLM to handle a live crisis.** The terminal action should always route to verified human helplines.

---

## "Not a medical device" disclaimer guidance

**Why it matters (regulatory + legal + ethical).** A software product becomes a *regulated medical device* when it is **intended to diagnose, treat, cure, mitigate, or prevent a disease or condition** — and even *implied* claims can trigger that classification. Tools positioned purely for **general wellness** (stress management, mindfulness, mood journaling, healthy-habit support) that make **no disease/treatment claims** generally fall outside medical-device regulation. Crossing the line (e.g., "detects depression", "screens for anxiety disorder", "treats your condition") can pull the product into device regulation, expose the company to liability, and — most importantly for a youth mental-health product — set up dangerous user expectations that the app can substitute for clinical care.

> **Note (India-specific, verify):** India regulates software-as-medical-device under the Medical Devices Rules / CDSCO regime, and clinical/telemedicine activity intersects with the **Mental Healthcare Act 2017** and telemedicine guidelines. Confirm the current Indian SaMD classification and any registration requirements with Indian regulatory counsel before launch — do not rely on the US/FDA framing alone.

**Scope-of-use language to adopt (adapt with counsel):**

- *"[App] is a general wellness and self-reflection tool. It is **not a medical device** and does **not** diagnose, treat, cure, or prevent any medical or mental-health condition."*
- *"[App] does **not** provide medical advice, therapy, or professional counselling and is **not a substitute for care from a qualified professional**."*
- *"If you are in distress or thinking about harming yourself, please contact a helpline (Tele-MANAS 14416) or emergency services (112) right away."*
- *"Always seek the advice of a qualified mental-health professional with any questions about your wellbeing."*

**Placement:** surface at onboarding (acknowledged, not buried), in the persistent help/crisis area, in app-store copy, and in marketing — and **keep marketing claims consistent** with the disclaimer (marketing copy is itself a "claim" and can reclassify the product).

**Hard rules:**
- No diagnostic outputs, scores presented as clinical diagnoses, or "you have X" statements.
- No claims to "treat" or "cure"; mood-tracking should be framed as *self-awareness*, not assessment.
- No implication the app replaces a clinician, medication, or a crisis line.

---

## DPDP Act 2023 obligations

> **Legal requirement (India).** The Digital Personal Data Protection (DPDP) Act, 2023 and the **DPDP Rules, 2025 (notified 13 Nov 2025)** govern this product. Reported enforcement of the substantive obligations (consent + children's data) is **13 May 2027** — *verify the exact dates and any phased timelines with counsel*, and build to comply from day one. Mood/journal/crisis data is highly sensitive personal data about (often) minors, so the strictest reading applies.

**Core obligations that apply to a mood/journal app:**

1. **Lawful purpose + consent (primary basis).** Process personal data only for a lawful purpose with consent that is **free, specific, informed, unconditional, and unambiguous**. The consent request must come with a **plain-language notice** describing what is collected, why, and how to exercise rights (notice availability in the 22 scheduled languages is part of the framework — verify scope for your case).
2. **Purpose limitation.** Use data **only** for the stated purpose. **No secondary use / repurposing without fresh consent.** A mood journal collected to help the user reflect cannot be silently reused for ad targeting, model training, or profiling.
3. **Data minimization.** Collect **only what is necessary** for the stated purpose. Don't capture contacts, location, device identifiers, or behavioural telemetry you don't strictly need.
4. **Right to withdraw + erasure.** Users can withdraw consent; on withdrawal or once the purpose is met, **data must be erased**. Build deletion/export flows.
5. **Security safeguards.** Implement **reasonable security safeguards** to prevent breaches (encryption, access control). Maintain consent/processing logs as required.
6. **Children's data (Section 9) — the strictest part of the law, and central here:**
   - A **"child" = anyone under 18.** Most of your target users (16–18) are children under the Act.
   - **Verifiable parental/guardian consent is mandatory** before processing a child's personal data. Rule 10 (DPDP Rules 2025) requires technical/organizational measures to verify the consenting party is a real, identifiable adult and is genuinely the parent/guardian (e.g., via government-backed identity such as DigiLocker, or other approved methods).
   - **Prohibited:** behavioural tracking/monitoring of children, and **targeted advertising** directed at children.
   - **Harm-based prohibition:** processing **likely to cause a detrimental effect on a child's wellbeing is forbidden — even with parental consent.**
   - Penalties for breaches of children's-data obligations run **up to ₹200 crore**.

**Architectural implications (best practice that also de-risks DPDP compliance):**

- **Local-first storage.** Keep mood/journal/crisis data on the user's device by default; sync to a server only with explicit consent and clear need. Local-first dramatically shrinks breach surface, simplifies erasure, and reduces what you must justify under purpose-limitation/minimization.
- **Encryption at rest (and in transit).** Encrypt the local store and any backups; prefer keys derived on-device.
- **Zero third-party trackers / analytics on health data.** No ad SDKs, no behavioural analytics, no session-replay on journal/mood/crisis screens. (Behavioural tracking of minors is outright prohibited.) If you need product analytics at all, restrict to anonymous, non-health events with consent, and never on the sensitive surfaces.
- **No training on user data** without separate, explicit, informed consent — and never for minors' sensitive data.
- **Built-in export + delete**, and a clear retention policy (retain only as long as the purpose requires).

> **Distinguish:** Items 1–6 above are **legal requirements** under DPDP/Rules. "Local-first, encryption at rest, no third-party trackers" are **best practices** that strongly support compliance and reduce risk, but the law mandates the *outcomes* (minimization, security, no behavioural tracking of minors), not those specific implementations.

---

## Ethical design principles

For vulnerable users (distressed students, minors), engagement tactics that are merely "aggressive" elsewhere become genuinely harmful. Dark patterns affect young/trusting users disproportionately, and in a mental-health context the very tactics that drive daily usage can undermine wellbeing and destroy trust.

**Avoid (dark patterns / harmful engagement):**
- **Guilt-inducing or loss-framed streaks** ("You broke your 30-day streak!"). Streaks can create stress and guilt for exactly the users who need a calmer, flexible approach.
- **Manipulative / shaming notifications**, FOMO, fake urgency, or "we miss you" guilt nudges.
- **Variable-reward / infinite-scroll / addictive loops** that maximise time-in-app rather than wellbeing.
- **Roach-motel friction** on cancelling, deleting data, or turning off notifications.
- **Confirmshaming** ("No, I don't want to feel better").
- Any retention mechanic that punishes absence or makes a struggling user feel like they failed.

**Adopt (ethical, supportive design):**
- **Frame gently and flexibly.** Celebrate effort and return without punishing gaps; make streaks (if any) forgiving and skippable, and never the core loop.
- **Honest, easy controls.** One-tap notification control, easy cancel, easy export/delete (also a DPDP requirement).
- **Clear, non-manipulative consent prompts** in plain, age-appropriate language.
- **User-paced, low-pressure UX.** Let users disengage without penalty; calmer is better than stickier.
- **Tone guidelines for mental-health copy:**
  - Warm, validating, non-judgmental, human. Avoid clinical jargon and avoid toxic positivity.
  - Never blame, shame, or moralise; never imply weakness.
  - Use person-first, non-stigmatising language; avoid loaded terms around suicide/self-harm.
  - Be honest about limits ("I'm a tool to help you reflect, not a substitute for a person or professional").
  - Avoid over-promising outcomes ("this will fix your anxiety").

---

## If using an LLM

LLMs in mental-health contexts carry documented, serious risks: they can be **jailbroken into giving self-harm/suicide method information** despite safety features, they may **fail to reliably detect acute crisis states**, and they exhibit **sycophancy** (mirroring/agreeing with the user, which can reinforce harmful or delusional beliefs). Treat the model as an untrusted component behind hard guardrails.

**Guardrails / requirements:**
- **The LLM never replaces professional help.** Any sign of crisis triggers a deterministic hand-off to verified human helplines (Tele-MANAS 14416 first) and emergency 112 — this routing must **not** depend on the model's judgement alone.
- **Crisis/self-harm classifier in front of and after the model.** Use a separate detection layer (not just the generative model) to spot risky language and force the safe crisis flow.
- **Refuse method/unsafe content unconditionally.** Hard-block any generation that describes self-harm methods, lethality, "how-to", or encouragement — including under role-play / hypothetical framing (a common jailbreak).
- **Prompt-injection resistance.** Treat user text and any retrieved/journal content as **untrusted input**; never let it override the system prompt, exfiltrate other users' data, or change safety behaviour. Separate trusted instructions from untrusted content; constrain tool/data access.
- **Output filtering / safety post-processing** on every response before it reaches a (possibly minor, possibly distressed) user.
- **No diagnosis, no treatment claims** from the model — same scope limits as the rest of the app.
- **Anti-sycophancy guardrails:** the model should not validate harmful intentions or reinforce hopelessness; it should consistently steer toward help-seeking.
- **Privacy:** do not send sensitive journal/mood/crisis data to third-party LLM APIs without explicit, informed consent and a lawful basis under DPDP; **never train on minors' sensitive data**; prefer on-device or privacy-preserving inference where feasible. Strip/avoid PII in prompts.
- **Human-in-the-loop + monitoring.** Log safety-relevant events (minimally and securely), red-team the system with escalating adversarial prompts before launch, and have a clinician review the crisis behaviour.
- **Test for failure modes:** escalating-distress conversations, jailbreak attempts, multilingual crisis expressions (Indian languages), and "resume after shutdown advisory" behaviour (models often re-engage after telling a user to stop — verify yours does not abandon the safe path).

---

## Sources

**India crisis & mental-health resources**
- Tele-MANAS — Ministry of Health & Family Welfare (Govt. of India): https://telemanas.mohfw.gov.in/home and https://telemanas.mohfw.gov.in/
- Tele-MANAS launch — PIB, Govt. of India: https://www.pib.gov.in/PressReleasePage.aspx?PRID=1866498
- Tele-MANAS overview — PIB, Govt. of India: https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=153277&ModuleId=3
- MoHFW NTMHP press release: https://www.mohfw.gov.in/?q=en/pressrelease-242
- KIRAN helpline launch — PIB, Govt. of India: https://www.pib.gov.in/PressReleasePage.aspx?PRID=1652240 and https://www.pib.gov.in/PressReleasePage.aspx?PRID=1651963
- iCALL (TISS): https://icallhelpline.org/ and https://tiss.ac.in/view/6/projects/icall-telephonic-counselling-service-for-individua/contact-us-6/
- AASRA: https://www.aasra.info/ and https://www.aasra.info/contact.html
- Vandrevala Foundation: https://www.vandrevalafoundation.com/
- Snehi: https://www.snehi.org.in/
- Govt. of India consolidated helpline reference (NHM HP): https://nhm.hp.gov.in/storage/app/media/uploaded-files/Mental%20Health%20Support%20Numbers.pdf

**Crisis-handling / safe messaging**
- Samaritans media guidelines (home): https://www.samaritans.org/about-samaritans/media-guidelines/
- Samaritans — reporting self-harm and suicide content online: https://www.samaritans.org/about-samaritans/media-guidelines/guidance-for-reporting-on-self-harm-and-suicide-content-online/
- Samaritans — managing self-harm and suicide content online (PDF): https://media.samaritans.org/documents/Online_Harms_guidelines_FINAL_1.pdf
- Samaritans — 10 top tips for reporting suicide: https://www.samaritans.org/about-samaritans/media-guidelines/10-top-tips-reporting-suicide/
- #chatsafe RCT (communicating safely about suicide online): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9984994/
- Ensuring safe suicide-prevention messaging (Community-Led Suicide Prevention): https://communitysuicideprevention.org/element/communication/ensuring-safe-suicide-prevention-messaging/
- Automated digital safety-planning interventions for young adults (PMC): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11904377/

**"Not a medical device" / wellness vs. device**
- APA — Wellness or treatment? Digital mental health: https://www.apaservices.org/practice/business/technology/tech-talk/wellness-treatment-digital-mental-health
- FDA — software function for maintaining/encouraging a healthy lifestyle: https://www.fda.gov/medical-devices/digital-health-center-excellence/step-3-software-function-intended-maintaining-or-encouraging-healthy-lifestyle
- Hogan Lovells — AI wellness or regulated medical device: https://www.hoganlovells.com/en/publications/ai-wellness-or-regulated-medical-device-a-lawyers-guide-to-navigating-fda-rulesand-what-could
- Skating the line between wellness products and regulated devices (PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC9280986/

**DPDP Act 2023 / Rules 2025**
- DPDP Act 2023, Section 8 (data-fiduciary obligations): https://www.dpdpa.com/dpdpa2023/chapter-2/section8.html
- DPDP Act 2023, Section 9 (children's data): https://www.dpdpa.com/dpdpa2023/chapter-2/section9.html
- DPDP Rules 2025, Rule 10 (verifiable parental consent): https://www.dpdpa.com/dpdparules/rule10.html
- DPDP overview & compliance roadmap (Legal500): https://www.legal500.com/developments/thought-leadership/the-digital-personal-data-protection-act-2023-comprehensive-framework-latest-developments-and-compliance-roadmap-2/
- Children's privacy & parental consent under DPDP (The Quantum Hub): https://thequantumhub.com/navigating-childrens-privacy-and-parental-consent-under-the-dpdp-act-2023/
- DPDP Rules 2025 notification & timeline / children's data (MediaNama): https://www.medianama.com/2025/01/223-data-protection-rules-2025-children-data-india/
- Verifiable parental consent under DPDP Rules 2025 (Consently): https://www.consently.in/blog/verifiable-parental-consent-dpdp-rules-2025-edtech-gaming

**Ethical design / dark patterns**
- SilverCloud/Amwell — Design ethics for mental health: avoiding dark patterns: https://silvercloud.amwell.com/blog/2022/01/design-ethics-for-mental-health-how-and-why-we-avoid-dark-patterns
- Dark patterns in mindfulness apps (Cambridge / Proceedings of the Design Society): https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/mindfulness-and-the-unseen-understanding-the-impact-of-dark-patterns-in-mindfulness-applications/C238118AB4D1185F1967826A0267348A
- Dark patterns and user mental health (SAGE): https://journals.sagepub.com/doi/10.1177/21695067231199684
- Ethical UX patterns (UXPA Magazine): https://uxpamagazine.org/ethical-ux-patterns-building-trust-without-manipulation/

**LLM safety / guardrails**
- IEEE Spectrum — AI chatbot safety guardrails for mental health: https://spectrum.ieee.org/mental-health-chatbot-guardrails
- TIME — AI chatbots can be manipulated to give suicide advice (Northeastern study): https://time.com/7306661/ai-suicide-self-harm-northeastern-study-chatgpt-perplexity-safeguards-jailbreaking/
- Evaluating risk progression in mental-health chatbots using escalating prompts (medRxiv): https://www.medrxiv.org/content/10.1101/2023.09.10.23295321.full.pdf
- Prompt-engineering framework for LLM mental-health chatbots (PubMed): https://pubmed.ncbi.nlm.nih.gov/40999693/
- Impact of safety guardrails on LLMs / irritability metrics (npj Digital Medicine): https://www.nature.com/articles/s41746-025-02333-3

**Indian legal context (suicide decriminalization)**
- Section 115, Mental Healthcare Act 2017 (Indian J. Psychiatry / PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC5914247/
- Practical implications of MHCA 2017: suicide and suicide attempt (PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC6482674/
