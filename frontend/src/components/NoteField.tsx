import type { ChangeEvent } from 'react'

import './NoteField.css'

export interface NoteFieldProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

/**
 * Optional free-text note with a live character counter. The counter is the
 * field's description, so screen readers announce remaining room as it changes.
 */
export function NoteField({ value, onChange, maxLength = 1000 }: NoteFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="note-field">
      <label className="note-field__label" htmlFor="note">
        Anything on your mind? (optional)
      </label>
      <textarea
        className="note-field__input"
        id="note"
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        aria-describedby="note-counter"
        rows={4}
      />
      <span className="note-field__counter" id="note-counter" aria-live="polite">
        {value.length}/{maxLength}
      </span>
    </div>
  )
}
