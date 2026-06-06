import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { MoodScale } from './MoodScale'

describe('MoodScale', () => {
  it('shows the mood prompt as the group legend', () => {
    render(<MoodScale value={null} onChange={vi.fn()} />)
    expect(
      screen.getByRole('group', { name: /how are you feeling right now\?/i }),
    ).toBeInTheDocument()
  })

  it('calls onChange with 4 when "Good" is selected', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<MoodScale value={null} onChange={handleChange} />)
    await user.click(screen.getByRole('radio', { name: /good/i }))
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<MoodScale value={null} onChange={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
