import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../lib/api'
import { WeeklyReflection } from './WeeklyReflection'

vi.mock('../lib/api', () => ({
  api: { getReflection: vi.fn() },
  isServerUnavailable: () => false,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WeeklyReflection', () => {
  it('renders the reflection and labels an AI source as Personalised', async () => {
    vi.mocked(api.getReflection).mockResolvedValue({
      week_start: '2026-06-01',
      body: 'You showed up this week, and that matters.',
      source: 'ai',
    })
    const { container } = render(<WeeklyReflection />)
    expect(await screen.findByText(/you showed up this week/i)).toBeInTheDocument()
    expect(screen.getByText('Personalised')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('labels a template reflection honestly as Summary', async () => {
    vi.mocked(api.getReflection).mockResolvedValue({
      week_start: '2026-06-01',
      body: 'This week you checked in twice.',
      source: 'template',
    })
    render(<WeeklyReflection />)
    expect(await screen.findByText('Summary')).toBeInTheDocument()
  })

  it('renders nothing when the reflection cannot load', () => {
    vi.mocked(api.getReflection).mockRejectedValue(Object.assign(new Error('x'), { status: 404 }))
    const { container } = render(<WeeklyReflection />)
    expect(container).toBeEmptyDOMElement()
  })
})
