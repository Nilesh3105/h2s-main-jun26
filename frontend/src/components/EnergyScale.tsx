import { ScaleField, type ScaleOption } from './ScaleField'

export interface EnergyScaleProps {
  value: number | null
  onChange: (value: number) => void
}

const ENERGY_OPTIONS: ScaleOption[] = [
  { value: 1, label: 'Drained', emoji: '🪫' },
  { value: 2, label: 'Low', emoji: '😮‍💨' },
  { value: 3, label: 'Okay', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '⚡' },
  { value: 5, label: 'High', emoji: '🔋' },
]

export function EnergyScale({ value, onChange }: EnergyScaleProps) {
  return (
    <ScaleField
      legend="Energy level right now"
      name="energy"
      options={ENERGY_OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
}
