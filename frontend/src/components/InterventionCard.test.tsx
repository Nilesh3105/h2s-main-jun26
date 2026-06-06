import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import type { Recommendation } from '../lib/types'
import { InterventionCard } from './InterventionCard'

function rec(overrides: Partial<Recommendation>): Recommendation {
  return {
    technique: 'grounding',
    title: 'A small grounding pause',
    rationale: 'Whenever you want a reset, this is a gentle place to start.',
    why_it_helps: 'Naming what you sense pulls attention out of a spiral.',
    source: 'Grounding (research/02)',
    factors: [],
    ...overrides,
  }
}

describe('InterventionCard', () => {
  it('renders the breathing pacer for the breathing technique', async () => {
    const { container } = render(
      <InterventionCard
        recommendation={rec({ technique: 'breathing', title: 'Take a slow breath' })}
      />,
    )
    expect(screen.getByRole('heading', { name: /take a slow breath/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders the interactive thought-record for that technique', () => {
    render(<InterventionCard recommendation={rec({ technique: 'thought_record' })} />)
    expect(screen.getByLabelText('What happened?')).toBeInTheDocument()
  })

  it('renders behavioral activation for that technique', () => {
    render(<InterventionCard recommendation={rec({ technique: 'behavioral_activation' })} />)
    expect(screen.getByLabelText(/one small thing/i)).toBeInTheDocument()
  })

  it('shows steps and marks done for a static technique', async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <InterventionCard recommendation={rec({ technique: 'grounding' })} onComplete={onComplete} />,
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /mark as done/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('discloses the cited "why this helps"', () => {
    render(<InterventionCard recommendation={rec({ source: 'Grounding (research/02)' })} />)
    expect(screen.getByText(/why this helps/i)).toBeInTheDocument()
    expect(screen.getByText(/research\/02/)).toBeInTheDocument()
  })
})
