import './ScaleField.css'

export interface ScaleOption {
  value: number
  label: string
  emoji: string
}

export interface ScaleFieldProps {
  legend: string
  name: string
  options: ScaleOption[]
  value: number | null
  onChange: (value: number) => void
  required?: boolean
}

/**
 * Reusable 1–5 radio-group field rendered as a row of tappable cards.
 * Each option's accessible name is its visible text label; the emoji is
 * decorative. The selected option is distinguished by more than colour.
 */
export function ScaleField({ legend, name, options, value, onChange, required }: ScaleFieldProps) {
  return (
    <fieldset className="scale-field">
      <legend className="scale-field__legend">
        {legend}
        {required ? <span aria-hidden="true"> *</span> : null}
      </legend>
      <div className="scale-field__options">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <label
              key={option.value}
              className={selected ? 'scale-option scale-option--selected' : 'scale-option'}
            >
              <input
                className="scale-option__input"
                type="radio"
                name={name}
                value={String(option.value)}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <span className="scale-option__emoji" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="scale-option__label">{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
