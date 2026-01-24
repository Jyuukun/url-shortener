import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SubmitButton } from './SubmitButton'

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useFormStatus: vi.fn(() => ({ pending: false })),
  }
})

import { useFormStatus } from 'react-dom'

const mockUseFormStatus = vi.mocked(useFormStatus)

const idleStatus = { pending: false, data: null, method: null, action: null } as ReturnType<typeof useFormStatus>
const pendingStatus = { pending: true, data: new FormData(), method: 'POST', action: '' } as ReturnType<typeof useFormStatus>

describe('SubmitButton', () => {
  it('renders with default label', () => {
    mockUseFormStatus.mockReturnValue(idleStatus)
    render(<SubmitButton />)
    expect(screen.getByRole('button')).toHaveTextContent('Submit')
  })

  it('renders with custom label', () => {
    mockUseFormStatus.mockReturnValue(idleStatus)
    render(<SubmitButton label="Shorten URL" />)
    expect(screen.getByRole('button')).toHaveTextContent('Shorten URL')
  })

  it('renders with custom pending label when pending', () => {
    mockUseFormStatus.mockReturnValue(pendingStatus)
    render(<SubmitButton label="Shorten" pendingLabel="Shortening..." />)
    expect(screen.getByRole('button')).toHaveTextContent('Shortening...')
  })

  it('is disabled when pending', () => {
    mockUseFormStatus.mockReturnValue(pendingStatus)
    render(<SubmitButton />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has submit type', () => {
    mockUseFormStatus.mockReturnValue(idleStatus)
    render(<SubmitButton />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
