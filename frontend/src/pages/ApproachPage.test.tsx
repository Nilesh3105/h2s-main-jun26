import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { ApproachPage } from './ApproachPage'

vi.mock('../lib/api', () => ({
  api: { exportData: vi.fn(), deleteData: vi.fn() },
  isServerUnavailable: () => false,
}))

describe('ApproachPage', () => {
  it('renders the transparency sections', () => {
    render(<ApproachPage />)
    expect(screen.getByRole('heading', { name: /how soft reset chooses/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /not a medical device/i })).toBeInTheDocument()
  })

  it('includes the data controls', () => {
    render(<ApproachPage />)
    expect(screen.getByRole('button', { name: /export my data/i })).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<ApproachPage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
