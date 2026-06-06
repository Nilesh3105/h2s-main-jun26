import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../lib/api'
import type { CheckInResult } from '../lib/types'
import { CheckInPage } from './CheckInPage'

vi.mock('../lib/api', () => ({
  api: {
    listTriggers: vi.fn().mockResolvedValue([]),
    listCheckIns: vi.fn().mockResolvedValue([]),
    createCheckIn: vi.fn(),
    logIntervention: vi.fn().mockResolvedValue({ status: 'recorded' }),
  },
  ApiError: class ApiError extends Error {},
  isServerUnavailable: () => false,
}))

function sampleResult(crisis = false): CheckInResult {
  return {
    check_in: {
      id: 1,
      created_at: '2026-06-06T10:00:00Z',
      mood: 3,
      energy: 3,
      sleep_hours: 6,
      note: null,
      triggers: [],
    },
    recommendation: {
      technique: 'thought_record',
      title: 'Untangle the thought',
      rationale: 'Because of a low mood today, untangling the thought might help.',
      why_it_helps: 'Writing a thought down beside a fairer one loosens its grip.',
      source: 'research/02',
      factors: ['a low mood today'],
    },
    crisis,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CheckInPage', () => {
  it('requires a mood before submitting', async () => {
    const user = userEvent.setup()
    render(<CheckInPage />)
    await user.click(screen.getByRole('button', { name: /^check in$/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/pick how/i)
    expect(api.createCheckIn).not.toHaveBeenCalled()
  })

  it('submits and shows the matched intervention', async () => {
    vi.mocked(api.createCheckIn).mockResolvedValue(sampleResult(false))
    const user = userEvent.setup()
    render(<CheckInPage />)
    await user.click(screen.getByRole('radio', { name: 'Great' }))
    await user.click(screen.getByRole('button', { name: /^check in$/i }))
    expect(await screen.findByText(/untangle the thought/i)).toBeInTheDocument()
    expect(api.createCheckIn).toHaveBeenCalledTimes(1)
  })

  it('surfaces crisis helplines when distress is flagged', async () => {
    vi.mocked(api.createCheckIn).mockResolvedValue(sampleResult(true))
    const user = userEvent.setup()
    render(<CheckInPage />)
    await user.click(screen.getByRole('radio', { name: 'Great' }))
    await user.click(screen.getByRole('button', { name: /^check in$/i }))
    expect(await screen.findByRole('link', { name: /14416/ })).toBeInTheDocument()
  })

  it('has no accessibility violations in the form', async () => {
    const { container } = render(<CheckInPage />)
    await screen.findByRole('button', { name: /^check in$/i })
    expect(await axe(container)).toHaveNoViolations()
  })
})
