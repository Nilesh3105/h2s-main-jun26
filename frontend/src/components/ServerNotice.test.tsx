import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { ServerNotice } from './ServerNotice'

describe('ServerNotice', () => {
  it('renders a calm default message and is accessible', async () => {
    const { container } = render(<ServerNotice />)
    expect(screen.getByText(/offline/i)).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders custom content when provided', () => {
    render(<ServerNotice>Trends are paused in this preview.</ServerNotice>)
    expect(screen.getByText(/trends are paused/i)).toBeInTheDocument()
  })
})
