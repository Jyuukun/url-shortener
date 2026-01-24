/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import type { ShortenResponse } from '../../../types/url'
import {
  buttonRowStyles,
  cardStyles,
  copiedStyles,
  copyButtonStyles,
  originalUrlStyles,
  resultLabelStyles,
  shortUrlStyles,
} from './ResultCard.styled'

interface ResultCardProps {
  result: ShortenResponse
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.short_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div css={cardStyles}>
      <div css={resultLabelStyles}>Shortened URL</div>
      <div css={shortUrlStyles}>{result.short_url}</div>

      <div css={resultLabelStyles}>Original URL</div>
      <div css={originalUrlStyles}>{result.original_url}</div>

      <div css={buttonRowStyles}>
        <button type="button" onClick={handleCopy} css={copyButtonStyles}>
          Copy
        </button>
        {copied && <span css={copiedStyles}>Copied!</span>}
      </div>
    </div>
  )
}
