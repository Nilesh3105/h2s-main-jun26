import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { ThoughtRecord } from './ThoughtRecord'

describe('ThoughtRecord', () => {
  it('renders the three guided field labels', () => {
    render(<ThoughtRecord />)
    expect(screen.getByLabelText('What happened?')).toBeInTheDocument()
    expect(screen.getByLabelText("What's the worried thought?")).toBeInTheDocument()
    expect(screen.getByLabelText("What's a kinder, fairer way to see it?")).toBeInTheDocument()
  })

  it('finishes the exercise: typing a reframe enables Done, which calls onComplete and shows the closing message', async () => {
    const onComplete = vi.fn()
    render(<ThoughtRecord onComplete={onComplete} />)

    const done = screen.getByRole('button', { name: 'Done' })
    expect(done).toBeDisabled()

    await userEvent.type(
      screen.getByLabelText("What's a kinder, fairer way to see it?"),
      'I did my best and that is enough.',
    )
    expect(done).toBeEnabled()

    await userEvent.click(done)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(
      screen.getByText('Nicely done. Noticing the thought is half the work.'),
    ).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<ThoughtRecord />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
