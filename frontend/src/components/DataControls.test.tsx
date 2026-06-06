import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { api } from '../lib/api'
import { DataControls } from './DataControls'

vi.mock('../lib/api', () => ({
  api: { exportData: vi.fn(), deleteData: vi.fn() },
  isServerUnavailable: () => false,
}))

describe('DataControls', () => {
  it('exports data when the export button is clicked', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:soft-reset')
    URL.revokeObjectURL = vi.fn()
    vi.mocked(api.exportData).mockResolvedValue({
      exported_at: '2026-06-06T00:00:00Z',
      check_ins: [],
      exam_dates: [],
    })

    render(<DataControls />)
    await userEvent.click(screen.getByRole('button', { name: /export my data/i }))

    expect(api.exportData).toHaveBeenCalledTimes(1)
  })

  it('requires two taps to confirm deletion, then deletes', async () => {
    vi.mocked(api.deleteData).mockResolvedValue(undefined)

    render(<DataControls />)
    await userEvent.click(screen.getByRole('button', { name: /delete all my data/i }))

    const confirm = screen.getByRole('button', { name: /tap again to confirm/i })
    expect(confirm).toBeInTheDocument()
    expect(api.deleteData).not.toHaveBeenCalled()

    await userEvent.click(confirm)

    expect(api.deleteData).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(/your data has been deleted/i)).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<DataControls />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
