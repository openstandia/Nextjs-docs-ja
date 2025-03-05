import React, { type ReactNode, useEffect, useState } from 'react'
import Heading from '@theme-original/Heading'
import type HeadingType from '@theme/Heading'
import Head from '@docusaurus/Head'
import type { WrapperProps } from '@docusaurus/types'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'

type Props = WrapperProps<typeof HeadingType>

export default function HeadingWrapper(props: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const { url } = siteConfig
  const pageTitle = document.title || siteConfig.title
  const pageDescription =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content') || siteConfig.tagline

  const pageUrl = `${url}${location.pathname}`
  const locale = document.querySelector('html')?.getAttribute('lang') || 'ja_JP'

  // h1要素の場合のみSEOタグを挿入（重複を避ける）
  const isH1 = props.as === 'h1'

  return (
    <>
      {isH1 && pageTitle && (
        <Head>
          {/* OGPメタタグ */}
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:locale" content={locale} />

          {/* Twitterカード */}
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:site" content={pageUrl} />
        </Head>
      )}
      <Heading {...props} />
    </>
  )
}
