import React, { type ReactNode, useEffect, useState } from 'react'
import Heading from '@theme-original/Heading'
import type HeadingType from '@theme/Heading'
import Head from '@docusaurus/Head'
import type { WrapperProps } from '@docusaurus/types'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useLocation } from '@docusaurus/router'
import { useDoc } from '@docusaurus/plugin-content-docs/client'

type Props = WrapperProps<typeof HeadingType>

export default function HeadingWrapper(props: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const { url } = siteConfig

  // ドキュメントページでない場合に備えてtry-catchで囲む
  let pageTitle = siteConfig.title
  let pageDescription = siteConfig.tagline

  try {
    const doc = useDoc()
    if (doc?.frontMatter) {
      pageTitle = doc.frontMatter.title || siteConfig.title
      pageDescription = doc.frontMatter.description || siteConfig.tagline
    }
  } catch (error) {
    if (location.pathname.includes('/404')) {
      pageTitle = 'ページが見つかりません | ' + siteConfig.title
      pageDescription = 'お探しのページが見つかりませんでした。'
    }
  }

  const pageUrl = `${url}${location.pathname}`

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
