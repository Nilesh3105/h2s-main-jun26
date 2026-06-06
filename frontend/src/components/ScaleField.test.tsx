import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { ScaleField, type ScaleOption } from './ScaleField'

const OPTIONS: ScaleOption[] = [
  { value: 1, label: 'Very low', emoji: '😔' },
  { value: 2, label: 'Low', emoji: '🙁' },
  { value: 3, label: 'Okay', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Great', emoji: '😄' },
]

describe('ScaleField', () => {
  it('renders a labelled group with one radio per option', () => {
    render(
      <ScaleField
        legend="How are you feeling right now?"
        name="mood"
        options={OPTIONS}
        value={null}
        onChange={vi.fn()}
        required
      />,
    )
    expect(
      screen.getByRole('group', { name: /how are you feeling right now\?/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('marks the radio matching the current value as checked', () => {
    render(
      <ScaleField
        legend="How are you feeling right now?"
        name="mood"
        options={OPTIONS}
        value={3}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('radio', { name: /okay/i })).toBeChecked()
    expect(screen.getByRole('radio', { name: /great/i })).not.toBeChecked()
  })

  it('calls onChange with the selected option value when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <ScaleField
        legend="How are you feeling right now?"
        name="mood"
        options={OPTIONS}
        value={null}
        onChange={handleChange}
      />,
    )
    await user.click(screen.getByRole('radio', { name: /great/i }))
    expect(handleChange).toHaveBeenCalledWith(5)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <ScaleField
        legend="How are you feeling right now?"
        name="mood"
        options={OPTIONS}
        value={2}
        onChange={vi.fn()}
        required
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
