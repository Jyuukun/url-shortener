import type {
  ApiError,
  ShortenRequest,
  ShortenResponse,
  ShortenResult,
  ValidationError,
} from '../types/url'

const API_BASE = '/api/v1'

const VALIDATION_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  custom_alias: {
    string_pattern_mismatch:
      'Custom alias can only contain letters, numbers, hyphens, and underscores',
    string_too_short: 'Custom alias must be at least 3 characters',
    string_too_long: 'Custom alias must be at most 40 characters',
  },
}

function formatValidationError(err: ValidationError): string {
  const field = String(err.loc[err.loc.length - 1])
  return VALIDATION_ERROR_MESSAGES[field]?.[err.type] ?? err.msg
}

export async function shortenUrl(request: ShortenRequest): Promise<ShortenResult> {
  try {
    const response = await fetch(`${API_BASE}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError
      let errorMessage: string

      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((err) => formatValidationError(err)).join(', ')
      } else {
        errorMessage = errorData.detail || `Error: ${response.status}`
      }

      return { success: false, error: errorMessage }
    }

    const data = (await response.json()) as ShortenResponse
    return { success: true, data }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    }
  }
}
