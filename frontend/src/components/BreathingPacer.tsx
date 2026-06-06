import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from '../lib/hooks'

import './BreathingPacer.css'

export interface BreathingPacerProps {
  onComplete?: () => void
}

interface Phase {
  label: string
  seconds: number
}

const PHASES: Phase[] = [
  { label: 'Breathe in', seconds: 4 },
  { label: 'Hold', seconds: 4 },
  { label: 'Breathe out', seconds: 4 },
  { label: 'Hold', seconds: 4 },
]

/**
 * Guided box-breathing pacer (4-4-4-4). The animated circle is decorative and
 * aria-hidden; the current phase is announced through an aria-live region so
 * the experience works for screen readers and motion-sensitive users alike.
 */
export function BreathingPacer({ onComplete }: BreathingPacerProps) {
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycles, setCycles] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!running) {
      return
    }
    const timer = setTimeout(() => {
      setPhaseIndex((current) => {
        const next = (current + 1) % PHASES.length
        if (next === 0) {
          setCycles((rounds) => rounds + 1)
        }
        return next
      })
    }, PHASES[phaseIndex].seconds * 1000)

    return () => clearTimeout(timer)
  }, [running, phaseIndex])

  const currentPhase = PHASES[phaseIndex]
  const isInhale = currentPhase.label === 'Breathe in'
  const isExhale = currentPhase.label === 'Breathe out'

  let circleClassName = 'breath-circle'
  if (running && !reducedMotion) {
    if (isInhale) {
      circleClassName = 'breath-circle is-inhale'
    } else if (isExhale) {
      circleClassName = 'breath-circle is-exhale'
    } else {
      circleClassName = 'breath-circle is-hold'
    }
  }

  function toggleRunning() {
    setRunning((current) => {
      const next = !current
      if (next) {
        setPhaseIndex(0)
      }
      return next
    })
  }

  return (
    <section className="breath" aria-label="Guided breathing">
      <p className="breath-instruction">
        Follow the circle for a few slow rounds of box breathing: in, hold, out, hold — four seconds
        each.
      </p>

      <div className={circleClassName} aria-hidden="true" />

      <p className="breath-phase" aria-live="polite">
        {running ? currentPhase.label : 'Ready when you are'}
      </p>

      <p className="breath-rounds">Rounds: {cycles}</p>

      <div className="breath-controls">
        <button type="button" className="breath-button" onClick={toggleRunning}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          className="breath-button breath-button--ghost"
          onClick={() => onComplete?.()}
        >
          I&apos;m done
        </button>
      </div>
    </section>
  )
}
