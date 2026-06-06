import './WeeklyReflection.css'

import { useEffect, useState } from 'react'

import { api, isServerUnavailable } from '../lib/api'
import type { Reflection } from '../lib/types'

/**
 * The flagship GenAI surface: a warm weekly reflection. The backend computes the
 * week's stats deterministically and either an AI voice or a template phrases
 * them — the badge shows honestly which. Renders nothing if the server is
 * unreachable (the dashboard already shows the offline notice).
 */
export function WeeklyReflection() {
  const [reflection, setReflection] = useState<Reflection | null>(null)

  useEffect(() => {
    let active = true
    api
      .getReflection()
      .then((data) => {
        if (active) setReflection(data)
      })
      .catch((err: unknown) => {
        if (!isServerUnavailable(err)) {
          // Non-availability errors are non-critical for this enhancement.
        }
      })
    return () => {
      active = false
    }
  }, [])

  if (!reflection) {
    return null
  }

  const personalised = reflection.source === 'ai'
  return (
    <section className="reflection" aria-labelledby="reflection-heading">
      <div className="reflection__head">
        <h2 id="reflection-heading">This week</h2>
        <span className="reflection__badge">{personalised ? 'Personalised' : 'Summary'}</span>
      </div>
      <p className="reflection__body">{reflection.body}</p>
    </section>
  )
}
