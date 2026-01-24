import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { initialShortenState, type ShortenState } from '../../../actions/shorten'
import { ShortenForm } from './ShortenForm'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useActionState: vi.fn(),
  }
})

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useFormStatus: vi.fn(() => ({ pending: false })),
  }
})

const mockUseActionState = useActionState as Mock

const mockFormAction = vi.fn()

const setupMockState = (state: ShortenState = initialShortenState) => {
  mockUseActionState.mockReturnValue([state, mockFormAction])
}

describe('ShortenForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMockState()
  })

  describe('Initial Render', () => {
    it('renders URL input field', () => {
      render(<ShortenForm />)
      expect(screen.getByLabelText(/url to shorten/i)).toBeInTheDocument()
    })

    it('renders submit button', () => {
      render(<ShortenForm />)
      expect(screen.getByRole('button', { name: /shorten url/i })).toBeInTheDocument()
    })

    it('renders custom alias toggle', () => {
      render(<ShortenForm />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
      expect(screen.getByText(/use custom alias/i)).toBeInTheDocument()
    })

    it('URL input has required attribute', () => {
      render(<ShortenForm />)
      expect(screen.getByLabelText(/url to shorten/i)).toBeRequired()
    })

    it('URL input has correct type', () => {
      render(<ShortenForm />)
      expect(screen.getByLabelText(/url to shorten/i)).toHaveAttribute('type', 'url')
    })

    it('custom alias input is hidden by default', () => {
      render(<ShortenForm />)
      const aliasInput = screen.getByPlaceholderText(/my-custom-link/i)
      expect(aliasInput).toHaveAttribute('aria-hidden', 'true')
      expect(aliasInput).toHaveAttribute('tabindex', '-1')
    })

    it('toggle is unchecked by default', () => {
      render(<ShortenForm />)
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('Custom Alias Toggle', () => {
    it('shows custom alias input when toggle is clicked', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))

      expect(screen.getByPlaceholderText(/my-custom-link/i)).toBeInTheDocument()
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    })

    it('hides custom alias input when toggle is clicked again', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      const aliasInput = screen.getByPlaceholderText(/my-custom-link/i)
      expect(aliasInput).toHaveAttribute('aria-hidden', 'false')

      await user.click(screen.getByRole('switch'))
      expect(aliasInput).toHaveAttribute('aria-hidden', 'true')
      expect(aliasInput).toHaveAttribute('tabindex', '-1')
    })

    it('clears custom alias value when toggle is disabled', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      const aliasInput = screen.getByPlaceholderText(/my-custom-link/i)
      await user.type(aliasInput, 'my-alias')
      expect(aliasInput).toHaveValue('my-alias')

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('switch'))

      expect(screen.getByPlaceholderText(/my-custom-link/i)).toHaveValue('')
    })

    it('shows hint text when custom alias is visible', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))

      expect(screen.getByText(/3-20 characters/i)).toBeInTheDocument()
    })

    it('toggle responds to Enter key', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      const toggle = screen.getByRole('switch')
      toggle.focus()
      await user.keyboard('{Enter}')

      expect(screen.getByPlaceholderText(/my-custom-link/i)).toBeInTheDocument()
    })

    it('toggle responds to Space key', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      const toggle = screen.getByRole('switch')
      toggle.focus()
      await user.keyboard(' ')

      expect(screen.getByPlaceholderText(/my-custom-link/i)).toBeInTheDocument()
    })
  })

  describe('Submit Button State', () => {
    it('submit button is enabled when custom alias toggle is off', () => {
      render(<ShortenForm />)
      expect(screen.getByRole('button', { name: /shorten url/i })).not.toBeDisabled()
    })

    it('submit button is disabled when custom alias toggle is on but alias is empty', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))

      expect(screen.getByRole('button', { name: /shorten url/i })).toBeDisabled()
    })

    it('submit button is enabled when custom alias has value', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      await user.type(screen.getByPlaceholderText(/my-custom-link/i), 'my-alias')

      expect(screen.getByRole('button', { name: /shorten url/i })).not.toBeDisabled()
    })

    it('submit button is disabled when custom alias is only whitespace', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      await user.type(screen.getByPlaceholderText(/my-custom-link/i), '   ')

      expect(screen.getByRole('button', { name: /shorten url/i })).toBeDisabled()
    })
  })

  describe('Form Input', () => {
    it('allows typing in URL input', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      const urlInput = screen.getByLabelText(/url to shorten/i)
      await user.type(urlInput, 'https://example.com')

      expect(urlInput).toHaveValue('https://example.com')
    })

    it('allows typing in custom alias input', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      const aliasInput = screen.getByPlaceholderText(/my-custom-link/i)
      await user.type(aliasInput, 'my-custom')

      expect(aliasInput).toHaveValue('my-custom')
    })

    it('custom alias input has correct constraints', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      const aliasInput = screen.getByPlaceholderText(/my-custom-link/i)

      expect(aliasInput).toHaveAttribute('minLength', '3')
      expect(aliasInput).toHaveAttribute('maxLength', '20')
    })
  })

  describe('Error Display', () => {
    it('displays error message when state has error', () => {
      setupMockState({ result: null, error: 'Something went wrong', pending: false })
      render(<ShortenForm />)

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('does not display error message when there is no error', () => {
      setupMockState({ result: null, error: null, pending: false })
      render(<ShortenForm />)

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('displays specific error for taken alias', () => {
      setupMockState({
        result: null,
        error: "Custom alias 'test' is already taken",
        pending: false,
      })
      render(<ShortenForm />)

      expect(screen.getByText(/already taken/i)).toBeInTheDocument()
    })
  })

  describe('Success Display', () => {
    const successResult = {
      short_url: 'http://localhost:8000/abc123',
      short_code: 'abc123',
      original_url: 'https://example.com',
      is_custom: false,
    }

    it('displays ResultCard when submission succeeds', () => {
      setupMockState({ result: successResult, error: null, pending: false })
      render(<ShortenForm />)

      expect(screen.getByText(successResult.short_url)).toBeInTheDocument()
    })

    it('displays both shortened and original URLs', () => {
      setupMockState({ result: successResult, error: null, pending: false })
      render(<ShortenForm />)

      expect(screen.getByText(successResult.short_url)).toBeInTheDocument()
      expect(screen.getByText(successResult.original_url)).toBeInTheDocument()
    })
  })

  describe('Input Clearing Behavior', () => {
    it('clears inputs on successful submission', async () => {
      const user = userEvent.setup()

      let currentState = initialShortenState
      mockUseActionState.mockImplementation(() => [currentState, mockFormAction])

      const { rerender } = render(<ShortenForm />)

      const urlInput = screen.getByLabelText(/url to shorten/i)
      await user.type(urlInput, 'https://example.com')
      await user.click(screen.getByRole('switch'))
      await user.type(screen.getByPlaceholderText(/my-custom-link/i), 'my-alias')

      currentState = {
        result: {
          short_url: 'http://localhost:8000/my-alias',
          short_code: 'my-alias',
          original_url: 'https://example.com',
          is_custom: true,
        },
        error: null,
        pending: false,
      }

      rerender(<ShortenForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/url to shorten/i)).toHaveValue('')
      })
    })

    it('preserves inputs on error', async () => {
      const user = userEvent.setup()

      let currentState = initialShortenState
      mockUseActionState.mockImplementation(() => [currentState, mockFormAction])

      const { rerender } = render(<ShortenForm />)

      const urlInput = screen.getByLabelText(/url to shorten/i)
      await user.type(urlInput, 'https://example.com')
      await user.click(screen.getByRole('switch'))
      await user.type(screen.getByPlaceholderText(/my-custom-link/i), 'taken-alias')

      expect(urlInput).toHaveValue('https://example.com')

      currentState = {
        result: null,
        error: "Custom alias 'taken-alias' is already taken",
        pending: false,
      }

      rerender(<ShortenForm />)

      expect(screen.getByLabelText(/url to shorten/i)).toHaveValue('https://example.com')
      expect(screen.getByPlaceholderText(/my-custom-link/i)).toHaveValue('taken-alias')
    })
  })

  describe('Accessibility', () => {
    it('toggle has correct ARIA attributes', () => {
      render(<ShortenForm />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-checked', 'false')
      expect(toggle).toHaveAttribute('tabIndex', '0')
    })

    it('toggle updates aria-checked when toggled', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      const toggle = screen.getByRole('switch')
      await user.click(toggle)

      expect(toggle).toHaveAttribute('aria-checked', 'true')
    })

    it('URL input has associated label', () => {
      render(<ShortenForm />)

      const urlInput = screen.getByLabelText(/url to shorten/i)
      expect(urlInput).toHaveAttribute('id', 'url')
    })

    it('custom alias input has associated id', async () => {
      const user = userEvent.setup()
      render(<ShortenForm />)

      await user.click(screen.getByRole('switch'))
      const aliasInput = screen.getByPlaceholderText(/my-custom-link/i)

      expect(aliasInput).toHaveAttribute('id', 'customAlias')
    })
  })
})
