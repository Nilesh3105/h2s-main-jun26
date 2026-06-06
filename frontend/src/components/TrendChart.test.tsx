import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import type { TrendPoint } from '../lib/types'
import { TrendChart } from './TrendChart'

const samplePoints: TrendPoint[] = [
  { date: '2026-06-01', mood: 2, count: 1 },
  { date: '2026-06-02', mood: 4, count: 1 },
  { date: '2026-06-03', mood: 3, count: 2 },
]

describe('TrendChart', () => {
  it('shows a calm empty state when there are no points', async () => {
    const { container } = render(<TrendChart points={[]} summary="ignored when empty" />)
    expect(
      screen.getByText('A day or two of check-ins and your mood trend will show up here.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders the summary and an accessible data table for the points', async () => {
    const summary = 'Your mood has been steady this week.'
    const { container } = render(<TrendChart points={samplePoints} summary={summary} />)

    expect(screen.getByText(summary)).toBeInTheDocument()

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    for (const point of samplePoints) {
      expect(screen.getByText(point.date)).toBeInTheDocument()
    }

    expect(await axe(container)).toHaveNoViolations()
  })
})
