import type { Trigger, TriggerCategory } from '../lib/types'

import './TriggerPicker.css'

export interface TriggerPickerProps {
  triggers: Trigger[]
  selected: string[]
  onToggle: (slug: string) => void
}

const CATEGORY_ORDER: TriggerCategory[] = ['academic', 'social', 'physical', 'emotional']

const CATEGORY_LABELS: Record<TriggerCategory, string> = {
  academic: 'Studies & exams',
  social: 'People & pressure',
  physical: 'Body & sleep',
  emotional: 'Feelings',
}

/**
 * Multi-select trigger picker rendered as wrapped chips. Triggers are grouped
 * into one fieldset per category (in a fixed order); empty categories are
 * skipped. Selection is signalled by border + background, never colour alone.
 */
export function TriggerPicker({ triggers, selected, onToggle }: TriggerPickerProps) {
  return (
    <fieldset className="trigger-picker">
      <legend className="trigger-picker__legend">What&apos;s weighing on you? (optional)</legend>
      {CATEGORY_ORDER.map((category) => {
        const inCategory = triggers.filter((trigger) => trigger.category === category)
        if (inCategory.length === 0) {
          return null
        }

        return (
          <fieldset key={category} className="trigger-picker__group">
            <legend className="trigger-picker__group-legend">{CATEGORY_LABELS[category]}</legend>
            <div className="trigger-picker__chips">
              {inCategory.map((trigger) => {
                const isSelected = selected.includes(trigger.slug)
                return (
                  <label
                    key={trigger.slug}
                    className={isSelected ? 'trigger-chip trigger-chip--selected' : 'trigger-chip'}
                  >
                    <input
                      className="trigger-chip__input"
                      type="checkbox"
                      value={trigger.slug}
                      checked={isSelected}
                      onChange={() => onToggle(trigger.slug)}
                    />
                    <span className="trigger-chip__label">{trigger.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </fieldset>
  )
}
