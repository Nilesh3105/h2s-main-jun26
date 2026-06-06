import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ResearchIndexPage } from './ResearchIndexPage'

describe('ResearchIndexPage', () => {
  it('lists the research notes as links', async () => {
    const { container } = render(
      <MemoryRouter>
        <ResearchIndexPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /research behind soft reset/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /what actually helps/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /safety, ethics & privacy/i })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
