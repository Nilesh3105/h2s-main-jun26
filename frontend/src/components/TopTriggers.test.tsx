import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { TopTriggers } from './TopTriggers'

describe('TopTriggers', () => {
  it('renders nothing when there are no triggers', () => {
    const { container } = render(<TopTriggers triggers={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('lists triggers with their counts', async () => {
    const { container } = render(
      <TopTriggers
        triggers={[
          { slug: 'anxious', label: 'Anxious or panicky', count: 3 },
          { slug: 'poor-sleep', label: 'Not sleeping enough', count: 1 },
        ]}
      />,
    )
    expect(screen.getByText('Anxious or panicky')).toBeInTheDocument()
    expect(screen.getByText('3 times')).toBeInTheDocument()
    expect(screen.getByText('1 time')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
