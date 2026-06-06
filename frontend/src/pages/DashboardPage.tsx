import './DashboardPage.css'

import { useCallback, useEffect, useState } from 'react'

import { ExamDateManager } from '../components/ExamDateManager'
import { InsightCards } from '../components/InsightCards'
import { SeasonBanner } from '../components/SeasonBanner'
import { TopTriggers } from '../components/TopTriggers'
import { TrendChart } from '../components/TrendChart'
import { api } from '../lib/api'
import type { ExamDate, ExamKind, Insights } from '../lib/types'

export function DashboardPage() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [dates, setDates] = useState<ExamDate[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // State updates happen only in the promise callbacks (after the fetch settles),
  // never synchronously inside the effect body — this is a data-load, not a
  // render cascade.
  const load = useCallback(() => {
    Promise.all([api.getInsights(), api.listExamDates()])
      .then(([ins, ex]) => {
        setInsights(ins)
        setDates(ex)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not load your trends right now.')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  async function handleAdd(label: string, date: string, kind: ExamKind) {
    try {
      await api.addExamDate(label, date, kind)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that date.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteExamDate(id)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove that date.')
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard__intro">
        <h2>Your trends</h2>
        <p>A private picture of how you&rsquo;ve been — no streaks, no pressure.</p>
      </header>

      {loading && <p>Loading your trends&hellip;</p>}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {insights && (
        <>
          <SeasonBanner season={insights.season} />

          <section className="dashboard__trend" aria-labelledby="trend-heading">
            <h2 id="trend-heading">Your mood over time</h2>
            <TrendChart points={insights.trend} summary={insights.summary} />
          </section>

          <InsightCards cards={insights.cards} />
          <TopTriggers triggers={insights.top_triggers} />
        </>
      )}

      <ExamDateManager dates={dates} onAdd={handleAdd} onDelete={handleDelete} />
    </div>
  )
}
