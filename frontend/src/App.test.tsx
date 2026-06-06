import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App shell', () => {
  it('renders the product name as the top-level heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /sukoon/i })).toBeInTheDocument()
  })

  it('shows the "not a medical device" disclaimer', () => {
    render(<App />)
    expect(screen.getByRole('note')).toHaveTextContent(/not a medical device/i)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
