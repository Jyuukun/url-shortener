import { shortenUrl } from '../services/api'
import type { ShortenResponse } from '../types/url'

export interface ShortenState {
  result: ShortenResponse | null
  error: string | null
  pending: boolean
}

export const initialShortenState: ShortenState = {
  result: null,
  error: null,
  pending: false,
}

export async function shortenAction(
  _prevState: ShortenState,
  formData: FormData
): Promise<ShortenState> {
  const url = formData.get('url') as string
  const customAlias = formData.get('customAlias') as string | null

  if (!url) {
    return { result: null, error: 'Please enter a URL', pending: false }
  }

  const response = await shortenUrl({
    url,
    custom_alias: customAlias?.trim() || undefined,
  })

  if (response.success) {
    return { result: response.data, error: null, pending: false }
  }

  return { result: null, error: response.error, pending: false }
}
