import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { ExamDateManager } from './ExamDateManager'

describe('ExamDateManager', () => {
  it('adds a date through the form', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExamDateManager dates={[]} onAdd={onAdd} onDelete={() => {}} />)

    await user.type(screen.getByLabelText('What is it?'), 'JEE Mains')
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-07-01' } })
    await user.click(screen.getByRole('button', { name: 'Add date' }))

    expect(onAdd).toHaveBeenCalledWith('JEE Mains', '2026-07-01', 'exam')
  })

  it('lists existing dates and removes one', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <ExamDateManager
        dates={[{ id: 7, label: 'Board results', date: '2026-05-20', kind: 'result' }]}
        onAdd={() => {}}
        onDelete={onDelete}
      />,
    )
    expect(screen.getByText(/Board results/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove Board results' }))
    expect(onDelete).toHaveBeenCalledWith(7)
    expect(await axe(container)).toHaveNoViolations()
  })
})
