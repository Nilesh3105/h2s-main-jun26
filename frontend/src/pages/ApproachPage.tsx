import './ApproachPage.css'

import { Link } from 'react-router-dom'

import { DataControls } from '../components/DataControls'

/**
 * "Our approach" — a plain-language tour of how Soft Reset works and what it
 * promises. Transparency is the point: how suggestions are chosen, where the
 * research comes from, what stays private, and the limits of what this is.
 * The privacy section hosts the data export/delete controls.
 */
export function ApproachPage() {
  return (
    <div className="approach-page">
      <section className="approach-page__section" aria-labelledby="approach-choose-heading">
        <h2 id="approach-choose-heading">How Soft Reset chooses what to suggest</h2>
        <p>
          When you check in, a fixed set of rules reads your mood, energy, sleep, and what you said
          was going on, then matches it to one exercise that tends to help in that situation. The
          same input always leads to the same suggestion — there&rsquo;s no black box guessing about
          you.
        </p>
        <p>
          When an AI helper is available, its only job is to put that suggestion into warmer, more
          natural words. It never decides what you should do. If the AI is switched off or
          unreachable, everything still works exactly the same, just with plainer wording.
        </p>
      </section>

      <section className="approach-page__section" aria-labelledby="approach-research-heading">
        <h2 id="approach-research-heading">Grounded in research</h2>
        <p>
          Every exercise we suggest traces back to published, evidence-based practice rather than a
          hunch. The reasoning and citations behind each one live in the project&rsquo;s{' '}
          <code>research/</code> folder, so you (or anyone) can check where a suggestion comes from
          and why we think it helps.
        </p>
        <p>
          <Link className="approach-page__cta" to="/approach/research">
            Browse the research &rarr;
          </Link>
        </p>
      </section>

      <section className="approach-page__section" aria-labelledby="approach-privacy-heading">
        <h2 id="approach-privacy-heading">Your privacy</h2>
        <p>
          Soft Reset is built to stay yours. There are no accounts to create and no third-party
          analytics watching your mood or journal entries. Your check-ins stay with your own copy of
          the app, and you can take them with you or remove them at any time.
        </p>
        <DataControls />
      </section>

      <section className="approach-page__section" aria-labelledby="approach-medical-heading">
        <h2 id="approach-medical-heading">Not a medical device</h2>
        <p>
          Soft Reset is a wellness companion. It does not diagnose, treat, or replace care from a
          professional, and it can&rsquo;t help in an emergency. If something feels urgent, support
          is always one tap away on the <strong>Get help</strong> page.
        </p>
      </section>
    </div>
  )
}
