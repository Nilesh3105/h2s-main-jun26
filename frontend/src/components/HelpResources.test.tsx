import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { HelpResources } from './HelpResources'

describe('HelpResources', () => {
  it('renders the default heading', () => {
    render(<HelpResources />)
    expect(
      screen.getByRole('heading', { name: 'Need to talk to someone now?' }),
    ).toBeInTheDocument()
  })

  it('renders the Tele-MANAS entry with a tel link', () => {
    render(<HelpResources />)
    expect(screen.getByText('Tele-MANAS')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '14416' })).toHaveAttribute('href', 'tel:14416')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<HelpResources />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
