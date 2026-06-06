import { useState } from 'react'
import type { ChangeEvent } from 'react'

import './BehavioralActivation.css'

export interface BehavioralActivationProps {
  onComplete?: () => void
}

const EXAMPLES = [
  'Drink a glass of water',
  'Step outside for 2 minutes',
  'Tidy one corner of the desk',
]

/**
 * A tiny behavioral-activation exercise: plan ONE small, doable action and check
 * it off. Momentum over motivation — the smallest first step still counts.
 * Fully private: state lives only in this component, nothing is sent or stored.
 */
export function BehavioralActivation({ onComplete }: BehavioralActivationProps) {
  const [task, setTask] = useState('')
  const [done, setDone] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value)
  }

  const handleDone = () => {
    setDone(true)
    onComplete?.()
  }

  const canFinish = task.trim().length > 0

  return (
    <section className="behavioral-activation" aria-labelledby="ba-title">
      <h3 id="ba-title" className="behavioral-activation__title">
        One small step
      </h3>
      <p className="behavioral-activation__intro">
        Pick one tiny thing you can do in five minutes, no more. Momentum beats motivation.
      </p>

      <div className="behavioral-activation__field">
        <label className="behavioral-activation__label" htmlFor="ba-task">
          One small thing I&apos;ll do
        </label>
        <input
          className="behavioral-activation__input"
          id="ba-task"
          type="text"
          value={task}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <div className="behavioral-activation__examples">
        <p className="behavioral-activation__examples-label" id="ba-examples-label">
          Need an idea?
        </p>
        <ul className="behavioral-activation__chips" aria-labelledby="ba-examples-label">
          {EXAMPLES.map((example) => (
            <li key={example}>
              <button
                type="button"
                className="behavioral-activation__chip"
                onClick={() => setTask(example)}
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="behavioral-activation__done"
        onClick={handleDone}
        disabled={!canFinish}
      >
        Mark it done
      </button>

      <p className="behavioral-activation__confirmation" aria-live="polite">
        {done ? 'That counts. Small steps are real steps.' : ''}
      </p>
    </section>
  )
}
