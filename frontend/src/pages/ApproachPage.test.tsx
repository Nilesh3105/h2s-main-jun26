import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ApproachPage } from './ApproachPage'

vi.mock('../lib/api', () => ({
  api: { exportData: vi.fn(), deleteData: vi.fn() },
  isServerUnavailable: () => false,
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <ApproachPage />
    </MemoryRouter>,
  )
}

describe('ApproachPage', () => {
  it('renders the transparency sections', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /how soft reset chooses/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /not a medical device/i })).toBeInTheDocument()
  })

  it('links to the browsable research', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /browse the research/i })).toHaveAttribute(
      'href',
      '/approach/research',
    )
  })

  it('includes the data controls', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /export my data/i })).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = renderPage()
    expect(await axe(container)).toHaveNoViolations()
  })
})
