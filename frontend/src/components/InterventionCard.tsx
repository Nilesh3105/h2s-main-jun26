import './InterventionCard.css'

import type { ReactNode } from 'react'

import type { Recommendation } from '../lib/types'
import { INTERVENTION_STEPS } from '../content/interventions'
import { BehavioralActivation } from './BehavioralActivation'
import { BreathingPacer } from './BreathingPacer'
import { ThoughtRecord } from './ThoughtRecord'

export interface InterventionCardProps {
  recommendation: Recommendation
  onComplete?: () => void
}

/**
 * Presents the matched micro-intervention: a calm rationale, the interactive
 * technique (breathing pacer / thought-record / behavioral activation, or step
 * hints), and a "Why this helps" disclosure carrying the cited evidence.
 */
export function InterventionCard({ recommendation, onComplete }: InterventionCardProps) {
  const steps = INTERVENTION_STEPS[recommendation.technique]

  function renderTechnique(): ReactNode {
    switch (recommendation.technique) {
      case 'breathing':
        return <BreathingPacer onComplete={onComplete} />
      case 'thought_record':
        return <ThoughtRecord onComplete={onComplete} />
      case 'behavioral_activation':
        return <BehavioralActivation onComplete={onComplete} />
      default:
        return (
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
        )
    }
  }

  return (
    <section className="intervention" aria-labelledby="intervention-title">
      <p className="intervention__eyebrow">A small thing that might help</p>
      <h2 id="intervention-title">{recommendation.title}</h2>
      <p className="intervention__rationale">{recommendation.rationale}</p>

      {renderTechnique()}

      <details className="intervention__why">
        <summary>Why this helps</summary>
        <p>{recommendation.why_it_helps}</p>
        <p className="intervention__source">{recommendation.source}</p>
      </details>
    </section>
  )
}
