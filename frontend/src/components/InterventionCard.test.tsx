import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import type { Recommendation } from '../lib/types'
import { InterventionCard } from './InterventionCard'

const breathing: Recommendation = {
  technique: 'breathing',
  title: 'Take a slow breath',
  rationale: 'Because you felt anxious, a slow breath might help right now.',
  why_it_helps: 'Slow, paced breathing calms the body within a couple of minutes.',
  source: 'Paced breathing (research/02)',
  factors: ['anxious or panicky'],
}

const thoughtRecord: Recommendation = {
  technique: 'thought_record',
  title: 'Untangle the thought',
  rationale: 'Because of a low mood today, untangling the thought might help.',
  why_it_helps: 'Writing a thought down beside a fairer one loosens its grip.',
  source: 'Cognitive restructuring (research/02)',
  factors: ['a low mood today'],
}

describe('InterventionCard', () => {
  it('renders the breathing pacer for the breathing technique', async () => {
    const { container } = render(<InterventionCard recommendation={breathing} />)
    expect(screen.getByRole('heading', { name: /take a slow breath/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('shows steps and marks done for non-breathing techniques', async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <InterventionCard recommendation={thoughtRecord} onComplete={onComplete} />,
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /mark as done/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('discloses the cited "why this helps"', () => {
    render(<InterventionCard recommendation={thoughtRecord} />)
    expect(screen.getByText(/why this helps/i)).toBeInTheDocument()
    expect(screen.getByText(/research\/02/)).toBeInTheDocument()
  })
})
