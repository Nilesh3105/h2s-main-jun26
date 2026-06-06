import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { SleepField } from './SleepField'

describe('SleepField', () => {
  it('renders a spinbutton with an accessible name', () => {
    render(<SleepField value={7} onChange={() => {}} />)
    expect(screen.getByRole('spinbutton', { name: 'Hours of sleep last night' })).toHaveValue(7)
  })

  it('parses input and calls onChange with a number', () => {
    const onChange = vi.fn()
    render(<SleepField value={7} onChange={onChange} />)

    const input = screen.getByRole('spinbutton', { name: 'Hours of sleep last night' })
    fireEvent.change(input, { target: { value: '5' } })

    expect(onChange).toHaveBeenCalledWith(5)
    expect(typeof onChange.mock.calls.at(-1)?.[0]).toBe('number')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<SleepField value={7} onChange={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
