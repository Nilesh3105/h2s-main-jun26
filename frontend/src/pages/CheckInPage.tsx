import './CheckInPage.css'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { api, isServerUnavailable } from '../lib/api'
import type { CheckInRecord, CheckInResult, Trigger } from '../lib/types'
import { EnergyScale } from '../components/EnergyScale'
import { HelpResources } from '../components/HelpResources'
import { InterventionCard } from '../components/InterventionCard'
import { MoodScale } from '../components/MoodScale'
import { NoteField } from '../components/NoteField'
import { ServerNotice } from '../components/ServerNotice'
import { SleepField } from '../components/SleepField'
import { TriggerPicker } from '../components/TriggerPicker'

const MOOD_LABELS = ['', 'Very low', 'Low', 'Okay', 'Good', 'Great']

function RecentList({ recent }: { recent: CheckInRecord[] }) {
  if (recent.length === 0) {
    return null
  }
  return (
    <section className="recent" aria-labelledby="recent-heading">
      <h2 id="recent-heading">Recent check-ins</h2>
      <ul className="recent__list">
        {recent.map((entry) => (
          <li key={entry.id}>
            <time dateTime={entry.created_at}>
              {new Date(entry.created_at).toLocaleDateString()}
            </time>
            <span aria-hidden="true"> · </span>
            <span>{MOOD_LABELS[entry.mood] ?? `Mood ${entry.mood}`}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * The core loop: a low-friction check-in that, on submit, returns a matched
 * micro-intervention (and the always-on crisis help if distress is detected).
 */
export function CheckInPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState(3)
  const [sleep, setSleep] = useState(7)
  const [note, setNote] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)
  const [validation, setValidation] = useState<string | null>(null)
  const [result, setResult] = useState<CheckInResult | null>(null)
  const [recent, setRecent] = useState<CheckInRecord[]>([])

  useEffect(() => {
    let active = true
    api
      .listTriggers()
      .then((data) => active && setTriggers(data))
      .catch(() => undefined)
    api
      .listCheckIns(5)
      .then((data) => active && setRecent(data))
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  function refreshRecent() {
    api
      .listCheckIns(5)
      .then(setRecent)
      .catch(() => undefined)
  }

  function toggleTrigger(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mood === null) {
      setValidation('Please pick how you’re feeling first — that’s all we need to start.')
      return
    }
    setValidation(null)
    setSubmitting(true)
    setError(null)
    setOffline(false)
    try {
      const res = await api.createCheckIn({
        mood,
        energy,
        sleep_hours: sleep,
        note: note.trim() || null,
        trigger_slugs: selected,
      })
      setResult(res)
      refreshRecent()
    } catch (err) {
      if (isServerUnavailable(err)) {
        setOffline(true)
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setResult(null)
    setMood(null)
    setEnergy(3)
    setSleep(7)
    setNote('')
    setSelected([])
  }

  function handleInterventionComplete() {
    if (!result) {
      return
    }
    api
      .logIntervention(result.check_in.id, result.recommendation.technique, true)
      .catch(() => undefined)
  }

  if (result) {
    return (
      <div className="checkin-result">
        {result.crisis && <HelpResources heading="That sounds really heavy right now" />}
        <InterventionCard
          recommendation={result.recommendation}
          onComplete={handleInterventionComplete}
        />
        <button type="button" className="checkin-result__again" onClick={reset}>
          Check in again
        </button>
        <RecentList recent={recent} />
      </div>
    )
  }

  return (
    <div className="checkin">
      <form className="checkin-form" onSubmit={handleSubmit} noValidate>
        <MoodScale value={mood} onChange={setMood} />
        <EnergyScale value={energy} onChange={setEnergy} />
        <SleepField value={sleep} onChange={setSleep} />
        {triggers.length > 0 && (
          <TriggerPicker triggers={triggers} selected={selected} onToggle={toggleTrigger} />
        )}
        <NoteField value={note} onChange={setNote} />

        {validation && (
          <p role="alert" className="form-error">
            {validation}
          </p>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        {offline && (
          <ServerNotice>
            We couldn&rsquo;t save this check-in — the Soft Reset server isn&rsquo;t reachable in
            this preview. Run it locally to save check-ins. The grounding tools and the help link
            still work.
          </ServerNotice>
        )}

        <button type="submit" className="checkin-form__submit" disabled={submitting}>
          {submitting ? 'Checking in…' : 'Check in'}
        </button>
      </form>

      <RecentList recent={recent} />
    </div>
  )
}
