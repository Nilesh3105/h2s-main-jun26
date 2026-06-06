import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { BreathingPacer } from './BreathingPacer'

describe('BreathingPacer', () => {
  it('renders a Start button and the ready message with no a11y violations', async () => {
    const { container } = render(<BreathingPacer />)

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByText('Ready when you are')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('shows Pause and the first phase synchronously when Start is clicked', async () => {
    const user = userEvent.setup()
    render(<BreathingPacer />)

    await user.click(screen.getByRole('button', { name: 'Start' }))

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    expect(screen.getByText('Breathe in')).toBeInTheDocument()
  })

  it('calls onComplete when "I\'m done" is clicked', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<BreathingPacer onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: "I'm done" }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
