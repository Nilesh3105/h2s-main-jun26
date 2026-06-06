import './CrisisPage.css'

import { HelpResources } from '../components/HelpResources'

/**
 * The always-on crisis screen. Reachable in one tap from anywhere, deep-linkable,
 * and works offline (static content, SPA fallback). Safe-messaging tone: warm,
 * validating, never clinical, never describing methods.
 */
export function CrisisPage() {
  return (
    <div className="crisis-page">
      <section className="crisis-page__intro" aria-labelledby="crisis-heading">
        <h2 id="crisis-heading">You don&rsquo;t have to carry this alone</h2>
        <p>
          Whatever you&rsquo;re feeling right now is allowed, and it can pass. Talking to someone
          helps — it&rsquo;s a strong, brave thing to do, not a weakness. The lines below are free,
          confidential, and need no sign-up.
        </p>
      </section>

      <HelpResources heading="People who want to help" />

      <section className="crisis-page__grounding" aria-labelledby="grounding-heading">
        <h2 id="grounding-heading">While you reach out, try this</h2>
        <p>
          Plant your feet and take one slow breath. Name five things you can see, four you can hear,
          and three you can touch. You only have to get through the next minute.
        </p>
      </section>

      <p className="crisis-page__disclaimer">
        Soft Reset is a wellness companion, not a medical device, and can&rsquo;t respond in an
        emergency. If you or someone else is in immediate danger, please call 112 now.
      </p>
    </div>
  )
}
