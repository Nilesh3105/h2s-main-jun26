import './DashboardPage.css'

import { useCallback, useEffect, useState } from 'react'

import { ExamDateManager } from '../components/ExamDateManager'
import { InsightCards } from '../components/InsightCards'
import { SeasonBanner } from '../components/SeasonBanner'
import { ServerNotice } from '../components/ServerNotice'
import { TopTriggers } from '../components/TopTriggers'
import { TrendChart } from '../components/TrendChart'
import { WeeklyReflection } from '../components/WeeklyReflection'
import { api, isServerUnavailable } from '../lib/api'
import type { ExamDate, ExamKind, Insights } from '../lib/types'

export function DashboardPage() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [dates, setDates] = useState<ExamDate[]>([])
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)
  const [loading, setLoading] = useState(true)

  function reportError(err: unknown, fallback: string) {
    if (isServerUnavailable(err)) {
      setOffline(true)
      setError(null)
      return
    }
    setError(err instanceof Error ? err.message : fallback)
  }

  // State updates happen only in the promise callbacks (after the fetch settles),
  // never synchronously inside the effect body — this is a data-load, not a
  // render cascade.
  const load = useCallback(() => {
    Promise.all([api.getInsights(), api.listExamDates()])
      .then(([ins, ex]) => {
        setInsights(ins)
        setDates(ex)
        setError(null)
        setOffline(false)
      })
      .catch((err: unknown) => reportError(err, 'Could not load your trends right now.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  async function handleAdd(label: string, date: string, kind: ExamKind) {
    try {
      await api.addExamDate(label, date, kind)
      load()
    } catch (err) {
      reportError(err, 'Could not save that date.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteExamDate(id)
      load()
    } catch (err) {
      reportError(err, 'Could not remove that date.')
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard__intro">
        <h2>Your trends</h2>
        <p>A private picture of how you&rsquo;ve been — no streaks, no pressure.</p>
      </header>

      {loading && <p>Loading your trends&hellip;</p>}

      {offline && (
        <ServerNotice>
          Your private trends live on the Soft Reset server. In this hosted preview the data layer
          is paused — run it locally and your mood history will appear here.
        </ServerNotice>
      )}

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {insights && (
        <>
          <SeasonBanner season={insights.season} />
          <WeeklyReflection />

          <section className="dashboard__trend" aria-labelledby="trend-heading">
            <h2 id="trend-heading">Your mood over time</h2>
            <TrendChart points={insights.trend} summary={insights.summary} />
          </section>

          <InsightCards cards={insights.cards} />
          <TopTriggers triggers={insights.top_triggers} />
        </>
      )}

      {!offline && <ExamDateManager dates={dates} onAdd={handleAdd} onDelete={handleDelete} />}
    </div>
  )
}
