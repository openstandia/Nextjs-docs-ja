import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export const NextJsVersion = ({ label }: { label: string }) => {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext()

  const version = (customFields?.nextjsGitHubVersionHash ?? '') as string

  return (
    <>
      {version && (
        <div>
          <span>{label}</span>
          <a
            href={`https://github.com/vercel/next.js/tree/${version}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {version.substring(0, 7)}
          </a>
        </div>
      )}
    </>
  )
}
