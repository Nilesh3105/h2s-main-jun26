import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { BehavioralActivation } from './BehavioralActivation'

describe('BehavioralActivation', () => {
  it('renders the task field with the button disabled and no a11y violations', async () => {
    const { container } = render(<BehavioralActivation />)

    expect(screen.getByLabelText("One small thing I'll do")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark it done' })).toBeDisabled()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('enables the button on input, then confirms and calls onComplete when clicked', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<BehavioralActivation onComplete={onComplete} />)

    const button = screen.getByRole('button', { name: 'Mark it done' })
    await user.type(screen.getByLabelText("One small thing I'll do"), 'Drink water')

    expect(button).toBeEnabled()

    await user.click(button)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText('That counts. Small steps are real steps.')).toBeInTheDocument()
  })
})
