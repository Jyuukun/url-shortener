export interface ShortenRequest {
    url: string
    custom_alias?: string
}

export interface ShortenResponse {
    short_url: string
    short_code: string
    original_url: string
    is_custom: boolean
}

export interface ValidationError {
    type: string
    loc: string[]
    msg: string
    input: unknown
}

export interface ApiError {
    detail: string | ValidationError[]
}

export type ShortenResult =
    | { success: true; data: ShortenResponse }
    | { success: false; error: string }
