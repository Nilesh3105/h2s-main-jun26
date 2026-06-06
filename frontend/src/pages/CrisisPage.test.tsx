import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { CrisisPage } from './CrisisPage'

describe('CrisisPage', () => {
  it('shows verified helplines as callable links', () => {
    render(<CrisisPage />)
    expect(screen.getByRole('link', { name: /14416/ })).toHaveAttribute('href', 'tel:14416')
  })

  it('uses warm, validating language', () => {
    render(<CrisisPage />)
    expect(
      screen.getByRole('heading', { name: /don’t have to carry this alone/i }),
    ).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<CrisisPage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
