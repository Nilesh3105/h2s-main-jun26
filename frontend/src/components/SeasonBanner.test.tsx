import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { SeasonBanner } from './SeasonBanner'

describe('SeasonBanner', () => {
  it('renders nothing when the season is inactive', () => {
    const { container } = render(
      <SeasonBanner season={{ active: false, label: null, message: null }} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the supportive message when active', async () => {
    const { container } = render(
      <SeasonBanner
        season={{ active: true, label: 'Exam season', message: 'Your JEE is in 5 days.' }}
      />,
    )
    expect(screen.getByText('Exam season')).toBeInTheDocument()
    expect(screen.getByText(/5 days/)).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
