import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ResearchDocPage } from './ResearchDocPage'

function renderAt(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/approach/research/${slug}`]}>
      <Routes>
        <Route path="/approach/research/:slug" element={<ResearchDocPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('# Evidence\n\nBreathing helps.'),
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ResearchDocPage', () => {
  it('fetches and renders a known research note', async () => {
    const { container } = renderAt('interventions')
    expect(await screen.findByRole('heading', { name: 'Evidence' })).toBeInTheDocument()
    expect(screen.getByText(/breathing helps/i)).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('shows a friendly message for an unknown note', () => {
    renderAt('not-a-real-doc')
    expect(screen.getByRole('heading', { name: /research note/i })).toBeInTheDocument()
  })
})
