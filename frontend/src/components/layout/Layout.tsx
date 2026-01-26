/** @jsxImportSource @emotion/react */
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactNode } from 'react'
import {
  cardStyles,
  containerStyles,
  footerStyles,
  githubLinkStyles,
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

        <footer css={footerStyles}>
          Built with React + FastAPI <br />
          <a
            href="https://github.com/Jyuukun/url-shortener"
            target="_blank"
            rel="noopener noreferrer"
            css={githubLinkStyles}
          >
            <FontAwesomeIcon icon={faGithub} />
            Check on GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
