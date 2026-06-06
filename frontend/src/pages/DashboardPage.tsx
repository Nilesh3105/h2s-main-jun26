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

  // `loading` starts true; we deliberately don't flip it synchronously here so
  // the mount effect never calls setState synchronously (state updates happen
  // after the awaited fetch resolves).
  const load = useCallback(async () => {
    try {
      const [ins, ex] = await Promise.all([api.getInsights(), api.listExamDates()])
      setInsights(ins)
      setDates(ex)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your trends right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch trends once on mount. State only updates after the awaited fetch
    // resolves; this is the intended data-loading effect, not a render-cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function handleAdd(label: string, date: string, kind: ExamKind) {
    try {
      await api.addExamDate(label, date, kind)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that date.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteExamDate(id)
      await load()
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
        <p role="alert" className="dashboard__error">
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
