import { css } from '@emotion/react'

export const cardStyles = css`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
  border: 1px solid #166534;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`

export const resultLabelStyles = css`
  font-size: 12px;
  font-weight: 600;
  color: #4ade80;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`

export const shortUrlStyles = css`
  font-size: 18px;
  font-weight: 600;
  color: #86efac;
  word-break: break-all;
  margin-bottom: 16px;
`

export const originalUrlStyles = css`
  font-size: 14px;
  color: #94a3b8;
  word-break: break-all;
  margin-bottom: 16px;
`

export const buttonRowStyles = css`
  display: flex;
  gap: 8px;
`

export const copyButtonStyles = css`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #4ade80;
  background: transparent;
  border: 1px solid #166534;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(34, 197, 94, 0.1);
  }
`

export const copiedStyles = css`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #4ade80;
`
