# Accessibility & UX Best Practices — Student Mental-Wellness Tracker

Scope: React frontend + Python backend, used by students. Goal: meet **WCAG 2.2 Level AA**, produce concrete, implementation-ready guidance for the app's actual components (mood sliders, tag pickers, text journal, buttons, mood-trend charts), and satisfy an automated a11y scorer (axe-core / Lighthouse / pa11y / eslint-plugin-jsx-a11y).

Conformance target: **WCAG 2.2 AA** (the current W3C Recommendation; supersedes 2.1 and is what automated/legal frameworks reference in 2026). Source: <https://www.w3.org/TR/WCAG22/>.

---

## Key Takeaways

1. **Use native HTML wherever possible.** `<label>` + `<input>`, `<fieldset>`/`<legend>` for groups, `<button>` for actions, `<input type="range">` or radios for ratings. Native elements give you keyboard, focus, name/role/value, and AT support for free. "No ARIA is better than bad ARIA." (W3C APG)
2. **For the mood scale, prefer a discrete native radio group** (≤7 options) over a custom slider. A radio group is simpler, fully keyboard/AT-operable with zero scripting, and avoids the touch-AT problems custom sliders have. If a continuous slider is required, use native `<input type="range">`, not a `div` with `role="slider"`. (W3C APG, MDN)
3. **Never rely on color alone** to convey mood/state (WCAG 1.4.1). Pair every color with text, an icon/shape, or a label — critical for a mood app where green/red could otherwise be the only signal.
4. **Charts need a non-visual equivalent.** Provide a short text summary + a real `<table>` data fallback; mark the decorative SVG `aria-hidden="true"`. Alt text alone is insufficient for trend data. (Sara Soueidan / USWDS / MIT Vis)
5. **Honor `prefers-reduced-motion`** for all non-essential animation (transitions, chart draw-in, mood-confetti). Default to motion-on but gate it behind the media query. (WCAG 2.3.3, MDN)
6. **Three WCAG 2.2 AA items are easy to miss and easy to win:** 2.4.11 Focus Not Obscured (sticky header/footer must not cover the focused element), 2.5.8 Target Size (≥24×24 CSS px, with spacing exception), 2.5.7 Dragging Movements (slider/drag needs a non-drag alternative). Sources below.
7. **Wire automated checks into CI now:** `eslint-plugin-jsx-a11y` (static), `@axe-core/react` or `jest-axe` (component render), and `pa11y-ci` or Lighthouse CI (full-page). These are exactly what an automated scorer runs, so passing them locally directly raises the score.
8. **Tone matters for this domain:** calm, plain-language, non-judgmental copy and low cognitive load are part of inclusive UX and reduce stress for vulnerable users.

---

## WCAG 2.2 criteria checklist (this app)

All Level A/AA unless noted. Each row maps to a real component in the app.

### Perceivable

| SC | Name (Level) | What it means here | Implementation |
|----|--------------|--------------------|----------------|
| **1.1.1** | Non-text Content (A) | Every icon/emoji/image needs a text equivalent | Emoji mood buttons get `aria-label="Happy"`; decorative imagery `alt=""`; chart `<svg>` gets text alt + table |
| **1.3.1** | Info & Relationships (A) | Structure conveyed visually must be in the markup | Use real `<label>`, `<fieldset>`/`<legend>`, `<table>` headers (`<th scope>`), correct heading order |
| **1.4.1** | Use of Color (A) | Color is never the *only* signal | Mood/error/state always paired with text, icon, or shape — not just hue |
| **1.4.3** | Contrast (Minimum) (AA) | Text ≥ **4.5:1**; large text (≥24px or ≥18.66px bold) ≥ **3:1** | Audit all copy, mood labels, chart axis text in light *and* dark mode |
| **1.4.11** | Non-text Contrast (AA) | UI components & graphics ≥ **3:1** vs adjacent color | Input borders, focus ring, slider track/thumb, chart lines/bars/legend swatches, button edges |
| **1.4.13** | Content on Hover/Focus (AA) | Tooltips/popovers must be **dismissable, hoverable, persistent** | Chart datapoint tooltips and tag hints: dismiss with Esc, don't vanish when pointer moves onto them |

### Operable

| SC | Name (Level) | What it means here | Implementation |
|----|--------------|--------------------|----------------|
| **2.1.1** | Keyboard (A) | All functionality keyboard-operable | No `div onClick` without keyboard handler + role; sliders/pickers fully arrow-key driven |
| **2.1.2** | No Keyboard Trap (A) | Focus can always leave a component | Test journal editor, modals, emoji picker |
| **2.4.3** | Focus Order (A) | Tab order matches reading/visual order | Especially in multi-field check-in form |
| **2.4.7** | Focus Visible (AA) | Visible focus indicator on every focusable element | Never `outline:none` without a replacement; provide a clear `:focus-visible` style |
| **2.4.11** | Focus Not Obscured (Minimum) (AA) — *new in 2.2* | Focused element not *entirely* hidden by author content | Sticky header/footer/nav must not fully cover the focused field; add `scroll-margin` |
| **2.5.7** | Dragging Movements (AA) — *new in 2.2* | Drag actions need a single-pointer alternative | A drag slider must also be operable by tap/click on +/- or by clicking a position |
| **2.5.8** | Target Size (Minimum) (AA) — *new in 2.2* | Targets ≥ **24×24 CSS px** (or sufficient spacing) | Emoji/mood/tag buttons and chart hit-areas; if smaller, ensure 24px spacing exception holds |

### Understandable

| SC | Name (Level) | What it means here | Implementation |
|----|--------------|--------------------|----------------|
| **3.2.2** | On Input (A) | Changing a control doesn't cause unexpected context change | Selecting a mood doesn't auto-submit/navigate without warning |
| **3.3.1** | Error Identification (A) | Errors identified in text, programmatically | `aria-invalid="true"` + visible text error linked via `aria-describedby` |
| **3.3.2** | Labels or Instructions (A) | Inputs have labels & format hints | Every field labeled; journal char limits / required-field cues stated in text |
| **3.3.3** | Error Suggestion (AA) | Suggest how to fix the error | "Please choose a mood before saving," not just "Error" |
| **3.3.7** | Redundant Entry (A) — *new in 2.2* | Don't make users re-enter info in the same flow | Pre-fill previously entered data in multi-step check-ins |
| **3.3.8** | Accessible Authentication (Minimum) (AA) — *new in 2.2* | No cognitive-function test as the only auth step | Allow password managers/paste; don't require puzzle/CAPTCHA-only login |

### Robust

| SC | Name (Level) | What it means here | Implementation |
|----|--------------|--------------------|----------------|
| **4.1.2** | Name, Role, Value (A) | Custom controls expose correct name/role/state | Custom slider/radio expose role + value + `aria-checked`/`aria-valuenow` |

> Reduced motion (`prefers-reduced-motion`) is the technique that satisfies the intent of **2.3.3 Animation from Interactions** (AAA) and is strongly recommended even though it's AAA — automated scorers and users both expect it. (W3C C39)

Sources: WCAG 2.2 <https://www.w3.org/TR/WCAG22/>; What's New in 2.2 <https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/>.

---

## Accessible component recipes

### 1. Forms (daily check-in, tag picker, text journal)

**Labels (1.3.1, 3.3.2):** every control has a programmatic label.
```html
<label for="journal">Today's journal</label>
<textarea id="journal" aria-describedby="journal-hint"></textarea>
<p id="journal-hint">Optional. Write as much or as little as you like.</p>
```
- Use a real visible `<label for>`; if a visible label is impossible, use `aria-label`. Placeholder text is **not** a label.
- Mark required fields with the native `required` attribute (it implies `aria-required="true"`); state "required" in the label text too — don't rely on a red asterisk alone (1.4.1).

**Grouping (fieldset/legend) — for the mood scale and tag group:**
```html
<fieldset>
  <legend>How are you feeling today?</legend>
  <!-- radio inputs, see rating widget below -->
</fieldset>

<fieldset>
  <legend>What's affecting your mood? (choose any)</legend>
  <label><input type="checkbox" name="tag" value="sleep"> Sleep</label>
  <label><input type="checkbox" name="tag" value="exams"> Exams</label>
  <!-- ... -->
</fieldset>
```
`<legend>` gives the whole group an accessible name so screen readers announce "How are you feeling today?, group" before each option. This is the canonical pattern for rating scales and tag/checkbox groups.

**Error handling (3.3.1, 3.3.3):**
```html
<label for="mood-other">Describe your mood</label>
<input id="mood-other" aria-invalid="true" aria-describedby="mood-other-err" />
<p id="mood-other-err" role="alert">Please describe your mood, or pick one above.</p>
```
- Set `aria-invalid="true"` on the failing control and link the message with `aria-describedby`.
- Put errors in **text** (not color-only), describe the problem, and suggest a fix.
- For dynamic validation, render the error in an `aria-live="polite"` region (or `role="alert"` for the active error) so screen readers announce it. Move focus to (or near) the first error on submit.

Sources: WebAIM Form Validation <https://webaim.org/techniques/formvalidation/>; ARIA21 (aria-invalid) <https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21>.

### 2. Rating / mood-scale widget — **recommended: native radio group**

For a discrete mood scale (e.g., 5 faces / 1–5), the W3C APG and TPGi both recommend a **radio group** over a slider when there are roughly **7 or fewer choices** — it is simpler, fully keyboard- and screen-reader-operable, and works with mobile AT gestures with **zero JavaScript**.

**Option A — native radios (best default):**
```html
<fieldset>
  <legend>How are you feeling today?</legend>
  <label><input type="radio" name="mood" value="1"> Very low</label>
  <label><input type="radio" name="mood" value="2"> Low</label>
  <label><input type="radio" name="mood" value="3"> Okay</label>
  <label><input type="radio" name="mood" value="4"> Good</label>
  <label><input type="radio" name="mood" value="5"> Great</label>
</fieldset>
```
You can visually replace the radios with emoji/face buttons via CSS while keeping the native input for semantics and keyboard. Each option's text label ("Very low"…"Great") means mood is **not conveyed by emoji/color alone** (1.4.1, 1.1.1).

**Keyboard (native, free):** Tab moves into the group landing on the checked option (or first if none); **Arrow keys** move and select; selection follows focus. Wraps at ends.

**Option B — custom ARIA radio group** (only if you can't style native radios): container `role="radiogroup"` + `aria-labelledby` pointing at the legend; each option `role="radio"` with `aria-checked="true|false"`; manage focus with **roving tabindex** (`tabindex="0"` on the active option, `-1` on the rest); implement Tab in/out, Arrow to move+select, Space to select, with wrapping. This re-creates by hand everything native radios give you — only do it if necessary.

**If a continuous slider is genuinely needed** (e.g., 0–100 intensity): use **native `<input type="range">`** — it provides keyboard (arrows, Home/End, PageUp/Down), AT, and touch support natively. If you must build a custom one, follow the APG Slider pattern: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and **`aria-valuetext`** for a human-readable value (e.g., "Good (4 of 5)"), plus `aria-labelledby`. Note custom sliders also trigger **2.5.7 Dragging Movements** — you must offer a non-drag alternative (clickable +/- or click-to-position).

Sources: APG Radio pattern <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>; Rating Radio Group example <https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/>; APG Slider <https://www.w3.org/WAI/ARIA/apg/patterns/slider/>; MDN slider role <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/slider_role>; TPGi Evolving custom sliders <https://www.tpgi.com/evolving-custom-sliders/>.

### 3. Charts / data-viz — **mood-trend line/bar chart**

Goal: a blind/low-vision student can get the same insight as a sighted one. Layered approach (do all three):

1. **Short text summary** adjacent to the chart: "Your mood trended up over the last 7 days, from 'Low' on Mon to 'Good' on Sun." Plain text in the DOM.
2. **Real data-table fallback** with the same data, so users can explore values point-by-point:
   ```html
   <figure role="group" aria-labelledby="chart-title">
     <figcaption id="chart-title">Mood over the last 7 days</figcaption>
     <svg aria-hidden="true"> ... drawn chart ... </svg>
     <table>
       <caption class="sr-only">Daily mood, 1 (very low) to 5 (great)</caption>
       <thead><tr><th scope="col">Day</th><th scope="col">Mood (1–5)</th></tr></thead>
       <tbody>
         <tr><th scope="row">Mon</th><td>2 (Low)</td></tr>
         <!-- ... -->
       </tbody>
     </table>
   </figure>
   ```
   You can visually hide the table with an `sr-only` utility (off-screen, **not** `display:none`) and/or offer a "View as table" toggle.
3. **Mark the SVG decorative for AT** with `aria-hidden="true"` (since the table is the accessible equivalent), or give the SVG `role="img"` + `aria-label`/`aria-labelledby` if it's the only representation. Don't do both at once.

**Color (1.4.1, 1.4.11):** don't distinguish series by color alone — use different line styles/markers/labels, and ensure chart lines/bars and legend swatches meet **3:1** non-text contrast against the background. Direct-label series instead of relying on a color-only legend where possible.

**Tooltips (1.4.13):** datapoint tooltips must be dismissable (Esc), persistent (don't vanish on small pointer moves), and reachable.

Sources: Sara Soueidan, accessible charts for Khan Academy <https://www.sarasoueidan.com/blog/accessible-data-charts-for-khan-academy-2018-annual-report/>; USWDS Data visualizations <https://designsystem.digital.gov/components/data-visualizations/>; A11Y Collective accessible charts <https://www.a11y-collective.com/blog/accessible-charts/>; MIT Vis, rich SR experiences <https://vis.csail.mit.edu/pubs/rich-screen-reader-vis-experiences/>.

### 4. Emoji / reaction picker

For a small fixed set of mood emoji, the simplest accessible pattern is a **radio group** (see widget above) or a **toolbar of buttons** — each emoji is a `<button>` (or `role="radio"`) with an `aria-label` of its meaning (`aria-label="Anxious"`), never the raw emoji char alone.

For a large searchable emoji picker, use the established pattern: category **tabs** (`role="tab"` / `role="tabpanel"`, ←/→ to switch), a search `<input>` with `aria-controls`/`aria-activedescendant` over results, and **roving tabindex** so the whole grid is one tab stop with arrow-key navigation inside. Reference implementations: React Aria Emoji Picker and Nolan Lawson's writeup.

Keyboard contract for any composite picker: **Tab** enters/exits the widget; **Arrow keys** move within; **Enter/Space** select; **Esc** closes. Make focus visible at every step (2.4.7) and targets ≥24px (2.5.8).

Sources: APG Keyboard Interface <https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/>; React Aria Emoji Picker <https://react-aria.adobe.com/examples/emoji-picker>; Nolan Lawson, accessible emoji picker <https://nolanlawson.com/2020/07/01/building-an-accessible-emoji-picker/>.

---

## Color & motion

### Color & contrast
- **Don't convey mood/state by color alone** (1.4.1). Every mood gets a text label and/or distinct icon/shape; errors get text + icon, not just red; the trend chart distinguishes series by pattern/marker/label, not hue.
- **Text contrast (1.4.3):** ≥ **4.5:1** normal text, ≥ **3:1** large text (≥24px, or ≥18.66px bold).
- **Non-text contrast (1.4.11):** ≥ **3:1** for input borders, focus rings, slider tracks/thumbs, chart lines/bars, legend swatches, button boundaries.
- **Palette:** calming palettes are fine, but soft pastels frequently fail contrast — verify every pairing with a contrast checker. Don't ship a palette chosen only for mood.
- **Dark mode:** contrast must be re-verified independently in dark mode — a pairing that passes in light mode often fails in dark. Define separate dark-mode tokens and test both. Avoid pure-black/pure-white extremes (halation); use slightly off values.

Sources: 1.4.3 <https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html>; 1.4.11 <https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html>; WebAIM Contrast <https://webaim.org/articles/contrast/>; Section508 color usage <https://www.section508.gov/create/making-color-usage-accessible/>.

### Motion
- Gate all **non-essential** animation behind `prefers-reduced-motion`. Keep motion as the default, but disable/replace it when the OS preference is set (macOS: Accessibility → Display → Reduce motion; GNOME: Accessibility → Reduced animation).
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  Prefer opacity fades over large translate/zoom for state changes — they avoid vestibular discomfort while still signaling change. In React, also read the preference in JS: `window.matchMedia('(prefers-reduced-motion: reduce)')` to skip chart draw-in / confetti / parallax.
- Satisfies intent of **2.3.3 Animation from Interactions**.

Sources: C39 <https://www.w3.org/WAI/WCAG21/Techniques/css/C39>; MDN prefers-reduced-motion <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>; SCR40 (JS) <https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40>.

---

## Automated a11y testing & React pitfalls

An automated scorer almost certainly runs some subset of **axe-core, Lighthouse, pa11y, and eslint-plugin-jsx-a11y** — axe-core is the engine underneath Lighthouse, the Chrome DevTools a11y panel, and most CI plugins. Passing these locally maps directly to a higher score.

### Wire these into CI (recommended stack)
1. **`eslint-plugin-jsx-a11y`** — static JSX linting; catches issues at code-review time (cheapest layer). Enable the `recommended` (or `strict`) config.
2. **`jest-axe` / `@axe-core/react`** — run axe against rendered components in unit tests (e.g., `expect(await axe(container)).toHaveNoViolations()`). Best for component-level coverage.
3. **`@axe-core/playwright`** or **`pa11y-ci`** or **Lighthouse CI** — full-page audits against the running app in CI. pa11y/Lighthouse are page-oriented; axe-in-Playwright gives per-route control. Pick one full-page tool + the component tool.

Layer it like a pyramid: lint (static) → axe in component tests → axe/pa11y/Lighthouse on key routes (check-in page, dashboard/chart, journal). Note: automated tools catch only ~30–40% of issues — still do keyboard-only and screen-reader spot checks on the core flow.

### Common React a11y pitfalls (these fail the linters/axe)
- **`<div onClick>` / `<span onClick>`** for clickable things → use `<button>`. If you must use a div, you need `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space. `jsx-a11y/no-static-element-interactions` and `click-events-have-key-events` flag this.
- **Missing `alt`** on `<img>` → meaningful alt or `alt=""` if decorative. (`jsx-a11y/alt-text`)
- **Label not associated** → use `htmlFor` (React's `for`) matching the input `id`, or wrap the input in the `<label>`. (`jsx-a11y/label-has-associated-control`)
- **`<label>` wrapping nothing / placeholder-as-label** → placeholders are not labels.
- **Heading order skips levels** (h1 → h3) or multiple h1s → keep a logical, sequential outline. (Lighthouse/axe `heading-order`)
- **`outline: none`** with no replacement focus style → fails 2.4.7; provide `:focus-visible`.
- **Non-unique / missing `id`s** breaking `aria-describedby`/`htmlFor`, and **invalid ARIA** (role without required props, `aria-*` on the wrong element) → axe `aria-required-attr`, `aria-valid-attr`.
- **Buttons/links with no accessible name** (icon-only) → add `aria-label`. (axe `button-name`, `link-name`)
- **`autoFocus`** stealing focus / unexpected focus jumps.
- **`<a>` used as a button** (no `href`) → use `<button>`; reserve `<a>` for navigation.

Sources: eslint-plugin-jsx-a11y <https://github.com/jsx-eslint/eslint-plugin-jsx-a11y>; web.dev React a11y auditing <https://web.dev/articles/accessibility-auditing-react>; pa11y + axe guide <https://www.ramotion.com/blog/practical-accessibility-testing-with-pa11y-and-axe-core/>; axe-in-CI with Playwright <https://rishikc.com/articles/accessibility-testing-ci-integration/>.

---

## Mental-health UX tone

For a vulnerable student audience, accessible *language and emotional design* is as important as technical a11y:

- **Non-judgmental, stigma-free copy.** Avoid clinical/medical jargon and loaded words; describe states neutrally ("You logged a low mood today" not "You failed to…"). No shaming streak/penalty language.
- **Plain language & low cognitive load.** Short sentences, one primary action per screen, familiar words, generous whitespace. Don't ask long, complex forms — make logging effortless. This also serves cognitive accessibility (WCAG COGA guidance).
- **Calm, predictable, low-stimulus design.** Consistent layouts, soft palettes (still contrast-checked), gentle micro-interactions; let secondary features recede when a user is in distress.
- **Inclusive & respectful representation.** Diverse, non-stigmatizing imagery and inclusive language so all students feel seen; avoid distressing visuals.
- **Reassuring error/empty states.** Frame errors supportively ("No worries — let's try that again"), never alarming. Provide easy exits and clear privacy/confidentiality messaging given the sensitivity of mood data.
- **Optionality & control.** Make journaling, tags, and emotional questions optional; never force disclosure. Respect user pacing.

Sources: Smashing Magazine empathy-centred UX for mental health apps <https://www.smashingmagazine.com/2026/02/building-empathy-centred-ux-framework-mental-health-apps/>; UXmatters designing for mental health <https://www.uxmatters.com/mt/archives/2023/06/designing-for-mental-health-creating-user-experiences-that-support-well-being.php>; W3C Cognitive Accessibility (COGA) guidance <https://www.w3.org/WAI/cognitive/>.

---

## Sources

**Standards (W3C / WAI):**
- WCAG 2.2 (Recommendation): <https://www.w3.org/TR/WCAG22/>
- What's New in WCAG 2.2: <https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/>
- Understanding 1.4.3 Contrast (Minimum): <https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html>
- Understanding 1.4.11 Non-text Contrast: <https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html>
- Understanding 2.4.7 Focus Visible: <https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html>
- Understanding 2.4.13 Focus Appearance: <https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html>
- Understanding 2.5.8 Target Size (Minimum): <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- C39 prefers-reduced-motion technique: <https://www.w3.org/WAI/WCAG21/Techniques/css/C39>
- SCR40 prefers-reduced-motion in JS: <https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40>
- ARIA21 aria-invalid for error fields: <https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21>
- ARIA Authoring Practices Guide (APG): <https://www.w3.org/WAI/ARIA/apg/>
- APG Radio pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>
- APG Rating Radio Group example: <https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/>
- APG Slider pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/slider/>
- APG Keyboard Interface practices: <https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/>
- W3C Cognitive Accessibility (COGA): <https://www.w3.org/WAI/cognitive/>

**MDN:**
- prefers-reduced-motion: <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>
- ARIA slider role: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/slider_role>
- `<input type="range">`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range>

**Forms, charts, tooling, tone:**
- WebAIM Form Validation: <https://webaim.org/techniques/formvalidation/>
- WebAIM Contrast & Color: <https://webaim.org/articles/contrast/>
- Section508 color usage: <https://www.section508.gov/create/making-color-usage-accessible/>
- Sara Soueidan, accessible data charts: <https://www.sarasoueidan.com/blog/accessible-data-charts-for-khan-academy-2018-annual-report/>
- USWDS Data visualizations: <https://designsystem.digital.gov/components/data-visualizations/>
- A11Y Collective accessible charts: <https://www.a11y-collective.com/blog/accessible-charts/>
- MIT Vis, rich screen-reader experiences: <https://vis.csail.mit.edu/pubs/rich-screen-reader-vis-experiences/>
- eslint-plugin-jsx-a11y: <https://github.com/jsx-eslint/eslint-plugin-jsx-a11y>
- web.dev React a11y auditing: <https://web.dev/articles/accessibility-auditing-react>
- pa11y + axe-core practical guide: <https://www.ramotion.com/blog/practical-accessibility-testing-with-pa11y-and-axe-core/>
- axe-core CI with Playwright + GitHub Actions: <https://rishikc.com/articles/accessibility-testing-ci-integration/>
- React Aria Emoji Picker: <https://react-aria.adobe.com/examples/emoji-picker>
- Nolan Lawson, accessible emoji picker: <https://nolanlawson.com/2020/07/01/building-an-accessible-emoji-picker/>
- TPGi, evolving custom sliders: <https://www.tpgi.com/evolving-custom-sliders/>
- Smashing Magazine, empathy-centred UX for mental health apps: <https://www.smashingmagazine.com/2026/02/building-empathy-centred-ux-framework-mental-health-apps/>
- UXmatters, designing for mental health: <https://www.uxmatters.com/mt/archives/2023/06/designing-for-mental-health-creating-user-experiences-that-support-well-being.php>
