import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ResultCard } from './ResultCard'

const mockResult = {
  short_url: 'http://localhost:8000/abc123',
  short_code: 'abc123',
  original_url: 'https://example.com/very/long/path',
  is_custom: false,
}

describe('ResultCard', () => {
  it('displays the shortened URL', () => {
    render(<ResultCard result={mockResult} />)
    expect(screen.getByText(mockResult.short_url)).toBeInTheDocument()
  })

  it('displays the original URL', () => {
    render(<ResultCard result={mockResult} />)
    expect(screen.getByText(mockResult.original_url)).toBeInTheDocument()
  })

  it('renders copy button', () => {
    render(<ResultCard result={mockResult} />)
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('copies URL to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup()
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      clipboard: { writeText: writeTextMock },
    })

    render(<ResultCard result={mockResult} />)
    const copyButton = screen.getByRole('button', { name: /copy/i })

    await user.click(copyButton)

    expect(writeTextMock).toHaveBeenCalledWith(mockResult.short_url)

    vi.unstubAllGlobals()
  })

  it('shows success feedback after copying', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    render(<ResultCard result={mockResult} />)
    const copyButton = screen.getByRole('button', { name: /copy/i })

    await user.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument()
    })

    vi.unstubAllGlobals()
  })
})
