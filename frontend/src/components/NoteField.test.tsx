import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { NoteField } from './NoteField'

describe('NoteField', () => {
  it('renders a textbox with an accessible name and an initial counter', () => {
    render(<NoteField value="" onChange={() => {}} />)
    expect(
      screen.getByRole('textbox', { name: 'Anything on your mind? (optional)' }),
    ).toBeInTheDocument()
    expect(screen.getByText('0/1000')).toBeInTheDocument()
  })

  it('calls onChange with a string per keystroke', async () => {
    const onChange = vi.fn()
    render(<NoteField value="" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Anything on your mind? (optional)' })
    await userEvent.type(input, 'hello')

    expect(onChange).toHaveBeenCalled()
    expect(typeof onChange.mock.calls.at(-1)?.[0]).toBe('string')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<NoteField value="" onChange={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
