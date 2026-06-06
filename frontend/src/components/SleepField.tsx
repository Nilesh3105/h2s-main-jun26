import type { ChangeEvent } from 'react'

import './SleepField.css'

export interface SleepFieldProps {
  value: number
  onChange: (value: number) => void
}

/**
 * Labelled numeric field for last night's sleep duration. Accepts half-hour
 * steps; non-numeric input is coerced to 0 so the form never holds NaN.
 */
export function SleepField({ value, onChange }: SleepFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value)
    onChange(Number.isNaN(parsed) ? 0 : parsed)
  }

  return (
    <div className="sleep-field">
      <label className="sleep-field__label" htmlFor="sleep-hours">
        Hours of sleep last night
      </label>
      <input
        className="sleep-field__input"
        id="sleep-hours"
        type="number"
        min={0}
        max={16}
        step={0.5}
        value={value}
        onChange={handleChange}
        aria-describedby="sleep-hint"
      />
      <p className="sleep-field__hint" id="sleep-hint">
        Roughly is fine.
      </p>
    </div>
  )
}
