import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { TriggerPicker } from './TriggerPicker'
import type { Trigger } from '../lib/types'

const triggers: Trigger[] = [
  { slug: 'exam-stress', label: 'Upcoming exam', category: 'academic' },
  { slug: 'backlog', label: 'Falling behind', category: 'academic' },
  { slug: 'anxious', label: 'Feeling anxious', category: 'emotional' },
  { slug: 'lonely', label: 'Feeling lonely', category: 'emotional' },
]

describe('TriggerPicker', () => {
  it('renders category legends and reflects the selected slug', () => {
    render(<TriggerPicker triggers={triggers} selected={['anxious']} onToggle={() => {}} />)

    expect(screen.getByText('Studies & exams')).toBeInTheDocument()
    expect(screen.getByText('Feelings')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Feeling anxious' })).toBeChecked()
  })

  it('calls onToggle with the slug of a clicked unselected checkbox', async () => {
    const onToggle = vi.fn()
    render(<TriggerPicker triggers={triggers} selected={['anxious']} onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('checkbox', { name: 'Upcoming exam' }))

    expect(onToggle).toHaveBeenCalledWith('exam-stress')
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <TriggerPicker triggers={triggers} selected={['anxious']} onToggle={() => {}} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
