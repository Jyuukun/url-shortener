import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { shortenUrl } from './api'

const mockFetch = vi.fn()

describe('shortenUrl', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('Successful responses', () => {
    it('returns success with data for valid URL', async () => {
      const mockResponse = {
        short_url: 'http://localhost:8000/abc123',
        short_code: 'abc123',
        original_url: 'https://example.com',
        is_custom: false,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await shortenUrl({ url: 'https://example.com' })

      expect(result).toEqual({ success: true, data: mockResponse })
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com' }),
      })
    })

    it('returns success with custom alias', async () => {
      const mockResponse = {
        short_url: 'http://localhost:8000/my-link',
        short_code: 'my-link',
        original_url: 'https://example.com',
        is_custom: true,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await shortenUrl({
        url: 'https://example.com',
        custom_alias: 'my-link',
      })

      expect(result).toEqual({ success: true, data: mockResponse })
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com', custom_alias: 'my-link' }),
      })
    })
  })

  describe('Error responses', () => {
    it('returns error for conflict (409) - alias taken', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ detail: "Custom alias 'test' is already taken" }),
      })

      const result = await shortenUrl({
        url: 'https://example.com',
        custom_alias: 'test',
      })

      expect(result).toEqual({
        success: false,
        error: "Custom alias 'test' is already taken",
      })
    })

    it('returns formatted error for pattern mismatch validation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            detail: [
              {
                type: 'string_pattern_mismatch',
                loc: ['body', 'custom_alias'],
                msg: 'String should match pattern',
                input: 'invalid alias!',
              },
            ],
          }),
      })

      const result = await shortenUrl({
        url: 'https://example.com',
        custom_alias: 'invalid alias!',
      })

      expect(result).toEqual({
        success: false,
        error: 'Custom alias can only contain letters, numbers, hyphens, and underscores',
      })
    })

    it('returns formatted error for alias too short', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            detail: [
              {
                type: 'string_too_short',
                loc: ['body', 'custom_alias'],
                msg: 'String should have at least 3 characters',
                input: 'ab',
              },
            ],
          }),
      })

      const result = await shortenUrl({
        url: 'https://example.com',
        custom_alias: 'ab',
      })

      expect(result).toEqual({
        success: false,
        error: 'Custom alias must be at least 3 characters',
      })
    })

    it('returns formatted error for alias too long', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            detail: [
              {
                type: 'string_too_long',
                loc: ['body', 'custom_alias'],
                msg: 'String should have at most 20 characters',
                input: 'a'.repeat(21),
              },
            ],
          }),
      })

      const result = await shortenUrl({
        url: 'https://example.com',
        custom_alias: 'a'.repeat(21),
      })

      expect(result).toEqual({
        success: false,
        error: 'Custom alias must be at most 20 characters',
      })
    })

    it('returns default message for unknown validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            detail: [
              {
                type: 'url_parsing',
                loc: ['body', 'url'],
                msg: 'Input should be a valid URL',
                input: 'not-a-url',
              },
            ],
          }),
      })

      const result = await shortenUrl({ url: 'not-a-url' })

      expect(result).toEqual({
        success: false,
        error: 'Input should be a valid URL',
      })
    })

    it('joins multiple validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            detail: [
              {
                type: 'string_too_short',
                loc: ['body', 'custom_alias'],
                msg: 'String should have at least 3 characters',
                input: 'ab',
              },
              {
                type: 'url_parsing',
                loc: ['body', 'url'],
                msg: 'Input should be a valid URL',
                input: 'bad',
              },
            ],
          }),
      })

      const result = await shortenUrl({ url: 'bad', custom_alias: 'ab' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('Custom alias must be at least 3 characters')
        expect(result.error).toContain('Input should be a valid URL')
      }
    })

    it('returns status code error when detail is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      const result = await shortenUrl({ url: 'https://example.com' })

      expect(result).toEqual({
        success: false,
        error: 'Error: 500',
      })
    })
  })

  describe('Network errors', () => {
    it('returns error message for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await shortenUrl({ url: 'https://example.com' })

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      })
    })

    it('returns generic error for non-Error exceptions', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error')

      const result = await shortenUrl({ url: 'https://example.com' })

      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred',
      })
    })
  })
})
