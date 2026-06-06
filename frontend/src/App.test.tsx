import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import App from './App'

// App mounts CheckInPage, which loads data on mount — stub the API so tests
// run without a network and resolve to empty state.
vi.mock('./lib/api', () => ({
  api: {
    listTriggers: vi.fn().mockResolvedValue([]),
    listCheckIns: vi.fn().mockResolvedValue([]),
    createCheckIn: vi.fn(),
    logIntervention: vi.fn(),
  },
  ApiError: class ApiError extends Error {},
}))

describe('App shell', () => {
  it('renders the product name as the top-level heading', async () => {
    render(<App />)
    expect(
      await screen.findByRole('heading', { level: 1, name: /soft reset/i }),
    ).toBeInTheDocument()
  })

  it('shows the "not a medical device" disclaimer', () => {
    render(<App />)
    expect(screen.getByRole('note')).toHaveTextContent(/not a medical device/i)
  })

  it('reveals crisis helplines when the help button is pressed', async () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: /need to talk now/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    toggle.click()
    expect(await screen.findByRole('link', { name: /14416/ })).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<App />)
    // Flush the initial async data loads (resolve to []).
    await screen.findByRole('heading', { level: 1, name: /soft reset/i })
    expect(await axe(container)).toHaveNoViolations()
  })
})
