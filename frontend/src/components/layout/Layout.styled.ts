import { css } from '@emotion/react'

export const layoutStyles = css`
  min-height: 100vh;
  background:
    radial-gradient(ellipse at top left, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
`

export const containerStyles = css`
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 24px;
`

export const headerStyles = css`
  text-align: center;
  margin-bottom: 48px;
`

export const titleStyles = css`
  font-size: 32px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 8px 0;
`

export const subtitleStyles = css`
  font-size: 16px;
  color: #94a3b8;
  margin: 0;
`

export const cardStyles = css`
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #334155;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
`

export const footerStyles = css`
  text-align: center;
  margin-top: 32px;
  color: #64748b;
  font-size: 14px;
`

export const githubLinkStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #94a3b8;
  }
`
