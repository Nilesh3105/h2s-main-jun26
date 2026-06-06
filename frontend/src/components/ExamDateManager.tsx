import './ExamDateManager.css'

import type { FormEvent } from 'react'
import { useState } from 'react'

import type { ExamDate, ExamKind } from '../lib/types'

export interface ExamDateManagerProps {
  dates: ExamDate[]
  onAdd: (label: string, date: string, kind: ExamKind) => void
  onDelete: (id: number) => void
}

export function ExamDateManager({ dates, onAdd, onDelete }: ExamDateManagerProps) {
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')
  const [kind, setKind] = useState<ExamKind>('exam')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!label.trim() || !date) {
      return
    }
    onAdd(label.trim(), date, kind)
    setLabel('')
    setDate('')
    setKind('exam')
  }

  return (
    <section className="exam-dates" aria-labelledby="exam-dates-heading">
      <h2 id="exam-dates-heading">Your exam &amp; result dates</h2>
      <p className="exam-dates__hint">
        Add them and Soft Reset will be a little gentler in the run-up and just after.
      </p>

      <form className="exam-dates__form" onSubmit={handleSubmit}>
        <div className="exam-dates__field">
          <label htmlFor="exam-label">What is it?</label>
          <input
            id="exam-label"
            type="text"
            value={label}
            maxLength={120}
            placeholder="e.g. JEE Mains"
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
        <div className="exam-dates__field">
          <label htmlFor="exam-date">Date</label>
          <input
            id="exam-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="exam-dates__field">
          <label htmlFor="exam-kind">Type</label>
          <select
            id="exam-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as ExamKind)}
          >
            <option value="exam">Exam</option>
            <option value="result">Result</option>
          </select>
        </div>
        <button type="submit" className="exam-dates__add">
          Add date
        </button>
      </form>

      {dates.length > 0 && (
        <ul className="exam-dates__list">
          {dates.map((entry) => (
            <li key={entry.id} className="exam-dates__item">
              <span>
                {entry.label} — {entry.date} ({entry.kind})
              </span>
              <button
                type="button"
                className="exam-dates__remove"
                aria-label={`Remove ${entry.label}`}
                onClick={() => onDelete(entry.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
