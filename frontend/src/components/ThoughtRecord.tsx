import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import { api } from '../lib/api'
import './ThoughtRecord.css'

export interface ThoughtRecordProps {
  onComplete?: () => void
}

/**
 * Guided thought-record (cognitive restructuring) exercise. The user names a
 * situation, the worried thought, and a fairer reframe. Everything stays in
 * local component state — nothing is sent anywhere or persisted.
 */
export function ThoughtRecord({ onComplete }: ThoughtRecordProps) {
  const [situation, setSituation] = useState('')
  const [thought, setThought] = useState('')
  const [reframe, setReframe] = useState('')
  const [done, setDone] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestHint, setSuggestHint] = useState('')

  const handleChange =
    (setValue: (value: string) => void) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value)
    }

  async function handleSuggest() {
    if (!thought.trim()) {
      return
    }
    setSuggesting(true)
    setSuggestHint('')
    try {
      const result = await api.suggestReframe(thought)
      setReframe(result.reframe)
    } catch {
      setSuggestHint('Couldn’t fetch a suggestion right now — your own words work best anyway.')
    } finally {
      setSuggesting(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
    onComplete?.()
  }

  const canFinish = reframe.trim().length > 0

  return (
    <form className="thought-record" onSubmit={handleSubmit}>
      <p className="thought-record__intro">
        A private space to gently untangle a worry. Nothing here is saved or shared — it stays only
        on this screen.
      </p>

      <div className="thought-record__field">
        <label className="thought-record__label" htmlFor="tr-situation">
          What happened?
        </label>
        <textarea
          className="thought-record__input"
          id="tr-situation"
          value={situation}
          onChange={handleChange(setSituation)}
        />
      </div>

      <div className="thought-record__field">
        <label className="thought-record__label" htmlFor="tr-thought">
          What&apos;s the worried thought?
        </label>
        <textarea
          className="thought-record__input"
          id="tr-thought"
          value={thought}
          onChange={handleChange(setThought)}
        />
      </div>

      <div className="thought-record__field">
        <label className="thought-record__label" htmlFor="tr-reframe">
          What&apos;s a kinder, fairer way to see it?
        </label>
        <textarea
          className="thought-record__input"
          id="tr-reframe"
          value={reframe}
          onChange={handleChange(setReframe)}
        />
        <button
          className="thought-record__suggest"
          type="button"
          onClick={handleSuggest}
          disabled={!thought.trim() || suggesting}
        >
          {suggesting ? 'Thinking…' : 'Suggest a kinder reframe'}
        </button>
        {suggestHint && (
          <p className="thought-record__hint" aria-live="polite">
            {suggestHint}
          </p>
        )}
      </div>

      <button className="thought-record__submit" type="submit" disabled={!canFinish}>
        Done
      </button>

      <p className="thought-record__closing" aria-live="polite">
        {done ? 'Nicely done. Noticing the thought is half the work.' : ''}
      </p>
    </form>
  )
}
