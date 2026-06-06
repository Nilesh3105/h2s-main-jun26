import { ScaleField, type ScaleOption } from './ScaleField'

export interface MoodScaleProps {
  value: number | null
  onChange: (value: number) => void
}

const MOOD_OPTIONS: ScaleOption[] = [
  { value: 1, label: 'Very low', emoji: '😔' },
  { value: 2, label: 'Low', emoji: '🙁' },
  { value: 3, label: 'Okay', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Great', emoji: '😄' },
]

export function MoodScale({ value, onChange }: MoodScaleProps) {
  return (
    <ScaleField
      legend="How are you feeling right now?"
      name="mood"
      options={MOOD_OPTIONS}
      value={value}
      onChange={onChange}
      required
    />
  )
}
