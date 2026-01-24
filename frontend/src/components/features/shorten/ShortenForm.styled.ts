import { css } from '@emotion/react'

export const formStyles = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  width: 100%;
`

export const fieldStyles = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const labelStyles = css`
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
`

export const inputStyles = css`
  padding: 12px 16px;
  font-size: 16px;
  background: #0f172a;
  color: #f1f5f9;
  border: 1px solid #475569;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`

export const hintStyles = css`
  font-size: 12px;
  color: #94a3b8;
`

export const errorStyles = css`
  padding: 12px 16px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #991b1b;
  border-radius: 8px;
  color: #fca5a5;
  font-size: 14px;
`

export const toggleRowStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
`

export const toggleLabelStyles = css`
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
`

export const toggleSwitchStyles = css`
  position: relative;
  width: 44px;
  height: 24px;
  background: #475569;
  border-radius: 12px;
  transition: background 0.2s ease;

  &[data-checked='true'] {
    background: #6366f1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #e2e8f0;
    border-radius: 50%;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &[data-checked='true']::after {
    transform: translateX(20px);
  }
`

export const customAliasWrapperStyles = css`
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.2s ease;

  &[data-expanded='true'] {
    grid-template-rows: 1fr;
    opacity: 1;
  }
`

export const customAliasContentStyles = css`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
`
