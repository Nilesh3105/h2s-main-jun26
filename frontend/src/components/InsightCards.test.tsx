import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { InsightCards } from './InsightCards'

describe('InsightCards', () => {
  it('shows gentle guidance when there are no cards', async () => {
    const { container } = render(<InsightCards cards={[]} />)
    expect(screen.getByText(/patterns will show up here/i)).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders a card with a text tone label (not color alone)', async () => {
    const { container } = render(
      <InsightCards
        cards={[
          { title: 'Things are looking up', detail: 'Your mood trended up.', tone: 'positive' },
        ]}
      />,
    )
    expect(screen.getByText('Good news')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /looking up/i })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
