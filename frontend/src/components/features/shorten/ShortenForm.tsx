/** @jsxImportSource @emotion/react */
import { useActionState, useEffect, useRef, useState } from 'react'
import { initialShortenState, shortenAction } from '../../../actions/shorten'
import { SubmitButton } from '../../common/SubmitButton'
import { ResultCard } from './ResultCard'
import {
  customAliasContentStyles,
  customAliasWrapperStyles,
  errorStyles,
  fieldStyles,
  formStyles,
  hintStyles,
  inputStyles,
  labelStyles,
  toggleLabelStyles,
  toggleRowStyles,
  toggleSwitchStyles,
} from './ShortenForm.styled'

export function ShortenForm() {
  const [state, formAction] = useActionState(shortenAction, initialShortenState)
  const [showCustomAlias, setShowCustomAlias] = useState(false)
  const [customAlias, setCustomAlias] = useState('')
  const [url, setUrl] = useState('')
  const customAliasRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.result && !state.error) {
      setUrl('')
      setCustomAlias('')
    }
  }, [state.result, state.error])

  const handleToggle = () => {
    const newState = !showCustomAlias
    setShowCustomAlias(newState)
    if (newState) {
      setTimeout(() => customAliasRef.current?.focus(), 0)
    } else {
      setCustomAlias('')
    }
  }

  const isSubmitDisabled = showCustomAlias && customAlias.trim() === ''

  return (
    <>
      <form action={formAction} css={formStyles}>
        <div css={fieldStyles}>
          <label htmlFor="url" css={labelStyles}>
            URL to shorten
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://example.com/your/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            css={inputStyles}
          />
        </div>

        <div css={fieldStyles}>
          <div
            css={toggleRowStyles}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggle()
              }
            }}
            role="switch"
            aria-checked={showCustomAlias}
            tabIndex={0}
          >
            <span css={toggleLabelStyles}>Use custom alias</span>
            <div css={toggleSwitchStyles} data-checked={showCustomAlias} aria-hidden="true" />
          </div>
          <div css={customAliasWrapperStyles} data-expanded={showCustomAlias}>
            <div css={customAliasContentStyles}>
              <input
                ref={customAliasRef}
                id="customAlias"
                name="customAlias"
                type="text"
                placeholder="my-custom-link"
                minLength={3}
                maxLength={40}
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                css={inputStyles}
                tabIndex={showCustomAlias ? 0 : -1}
                aria-hidden={!showCustomAlias}
              />
              <span css={hintStyles}>
                3-40 characters, letters, numbers, hyphens, and underscores only
              </span>
            </div>
          </div>
        </div>

        <SubmitButton
          label="Shorten URL"
          pendingLabel="Shortening..."
          disabled={isSubmitDisabled}
        />

        {state.error && <div css={errorStyles}>{state.error}</div>}
      </form>

      {state.result && <ResultCard result={state.result} />}
    </>
  )
}
