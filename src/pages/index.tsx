import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import styles from '../css/index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          <p>{siteConfig.title.split(' ').slice(0, 2).join(' ')}</p>
          <p>{siteConfig.title.split(' ')[2]}</p>
        </h1>
        <p className={styles.subtitle}>
          Next.js AppRouterの公式ドキュメント日本語訳を提供します。
        </p>
        <div className={styles.buttons}>
          <Link
            className={`${styles.button} ${styles.primaryButton}`}
            to="/docs"
          >
            ドキュメントを読む
          </Link>
          <Link
            className={`${styles.button} ${styles.secondaryButton}`}
            to="/docs/app"
          >
            App Routerを学ぶ
          </Link>
        </div>
      </div>
    </header>
  )
}

function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresGrid}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📚</div>
          <h3 className={styles.featureTitle}>最新の翻訳</h3>
          <p>
            Next.js
            15の最新機能を含む、包括的な日本語ドキュメントを提供しています。
          </p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>⚡</div>
          <h3 className={styles.featureTitle}>App Router</h3>
          <p>
            新しいApp Routerアーキテクチャの詳細な解説と実装例を提供します。
          </p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>𝕏</div>
          <h3 className={styles.featureTitle}>Next.js 公式Xで紹介</h3>
          <p>
            Next.js の公式 Xアカウントにも本サイトについて
            <Link to="https://twitter.com/nextjs/status/1746921179879735677">
              ポスト
            </Link>
            いただきました。
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={siteConfig.title}
      description="Next.js公式ドキュメント日本語訳 - モダンなReactフレームワークの完全ガイド"
    >
      <HomepageHeader />
      <main>
        <Features />
      </main>
    </Layout>
  )
}
