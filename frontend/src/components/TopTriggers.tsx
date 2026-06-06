import './TopTriggers.css'

import type { TriggerCount } from '../lib/types'

export interface TopTriggersProps {
  triggers: TriggerCount[]
}

/**
 * The most-tagged stressors, with a decorative bar for quick scanning. The
 * count text carries the meaning (the bar is aria-hidden) — no color-only data.
 */
export function TopTriggers({ triggers }: TopTriggersProps) {
  if (triggers.length === 0) {
    return null
  }
  const max = Math.max(...triggers.map((t) => t.count))
  return (
    <section className="top-triggers" aria-labelledby="top-triggers-heading">
      <h2 id="top-triggers-heading">What&rsquo;s been weighing on you</h2>
      <ul className="top-triggers__list">
        {triggers.map((trigger) => (
          <li key={trigger.slug} className="top-triggers__item">
            <span className="top-triggers__label">{trigger.label}</span>
            <span className="top-triggers__count">
              {trigger.count} time{trigger.count === 1 ? '' : 's'}
            </span>
            <span
              className="top-triggers__bar"
              aria-hidden="true"
              style={{ inlineSize: `${(trigger.count / max) * 100}%` }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
