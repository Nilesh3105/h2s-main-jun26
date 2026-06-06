import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../lib/api'
import type { Insights } from '../lib/types'
import { DashboardPage } from './DashboardPage'

vi.mock('../lib/api', () => ({
  api: {
    getInsights: vi.fn(),
    listExamDates: vi.fn().mockResolvedValue([]),
    addExamDate: vi.fn(),
    deleteExamDate: vi.fn(),
    getReflection: vi.fn(),
  },
  ApiError: class ApiError extends Error {},
  isServerUnavailable: (err: unknown) =>
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    [0, 404].includes((err as { status: number }).status),
}))

const sampleInsights: Insights = {
  trend: [{ date: '2026-06-05', mood: 3, count: 1 }],
  summary: 'You’ve checked in across 1 day. Your most recent mood was okay.',
  top_triggers: [{ slug: 'anxious', label: 'Anxious or panicky', count: 1 }],
  cards: [],
  season: { active: true, label: 'Exam season', message: 'Your JEE is in 3 days.' },
  total_check_ins: 1,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(api.listExamDates).mockResolvedValue([])
  vi.mocked(api.getReflection).mockResolvedValue({
    week_start: '2026-06-01',
    body: 'A gentle weekly note.',
    source: 'template',
  })
})

describe('DashboardPage', () => {
  it('loads and renders insights', async () => {
    vi.mocked(api.getInsights).mockResolvedValue(sampleInsights)
    render(<DashboardPage />)
    expect(await screen.findByText(/checked in across 1 day/i)).toBeInTheDocument()
    expect(screen.getByText('Exam season')).toBeInTheDocument()
    expect(screen.getByText('Anxious or panicky')).toBeInTheDocument()
    expect(await screen.findByText(/gentle weekly note/i)).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    vi.mocked(api.getInsights).mockResolvedValue(sampleInsights)
    const { container } = render(<DashboardPage />)
    await screen.findByText(/checked in across 1 day/i)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('shows an error message when loading fails', async () => {
    vi.mocked(api.getInsights).mockRejectedValue(new Error('boom'))
    render(<DashboardPage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('shows a calm offline notice (not a red error) when the server is unreachable', async () => {
    vi.mocked(api.getInsights).mockRejectedValue(
      Object.assign(new Error('not found'), { status: 404 }),
    )
    render(<DashboardPage />)
    expect(await screen.findByText(/data layer is paused/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
