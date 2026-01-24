/** @jsxImportSource @emotion/react */
import type { ReactNode } from 'react'
import {
  cardStyles,
  containerStyles,
  footerStyles,
  headerStyles,
  layoutStyles,
  subtitleStyles,
  titleStyles,
} from './Layout.styled'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div css={layoutStyles}>
      <title>URL Shortener</title>
      <meta name="description" content="Transform long URLs into short, shareable links" />
      <div css={containerStyles}>
        <header css={headerStyles}>
          <h1 css={titleStyles}>URL Shortener</h1>
          <p css={subtitleStyles}>Transform long URLs into short, shareable links</p>
        </header>

        <main css={cardStyles}>{children}</main>

        <footer css={footerStyles}>Built with React 19 + FastAPI</footer>
      </div>
    </div>
  )
}
