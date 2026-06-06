import './InterventionCard.css'

import type { Recommendation } from '../lib/types'
import { INTERVENTION_STEPS } from '../content/interventions'
import { BreathingPacer } from './BreathingPacer'

export interface InterventionCardProps {
  recommendation: Recommendation
  onComplete?: () => void
}

/**
 * Presents the matched micro-intervention: a calm rationale, the technique
 * itself (interactive breathing pacer, or step hints), and a "Why this helps"
 * disclosure carrying the cited evidence — the transparency surface.
 */
export function InterventionCard({ recommendation, onComplete }: InterventionCardProps) {
  const steps = INTERVENTION_STEPS[recommendation.technique]
  const isBreathing = recommendation.technique === 'breathing'

  return (
    <section className="intervention" aria-labelledby="intervention-title">
      <p className="intervention__eyebrow">A small thing that might help</p>
      <h2 id="intervention-title">{recommendation.title}</h2>
      <p className="intervention__rationale">{recommendation.rationale}</p>

      {isBreathing ? (
        <BreathingPacer onComplete={onComplete} />
      ) : (
        <>
          <ol className="intervention__steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <button type="button" className="intervention__done" onClick={() => onComplete?.()}>
            Mark as done
          </button>
        </>
      )}

      <details className="intervention__why">
        <summary>Why this helps</summary>
        <p>{recommendation.why_it_helps}</p>
        <p className="intervention__source">{recommendation.source}</p>
      </details>
    </section>
  )
}
