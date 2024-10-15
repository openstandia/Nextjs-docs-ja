// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes as prismThemes } from 'prism-react-renderer'
import { officialNextJsDocsSidebarItemsAdapter } from './sidebars.adapter.mjs'
import { version } from './version.json'

const configureGtag = () => {
  const trackingId = process.env.GTAG_TRACKING_ID
  if (trackingId) {
    return {
      gtag: {
        trackingID: trackingId,
      },
    }
  }
  return {}
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
  tagline: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
  url: 'https://ja.next-community-docs.dev/',
  baseUrl: process.env.BASE_URL || '/',
  staticDirectories: ['public', 'static'],
  onBrokenLinks: 'warn',  //TODO リンク切れを修正したらthrowに戻す
  onBrokenMarkdownLinks: 'warn',  //TODO リンク切れを修正したらthrowに戻す
  favicon: 'img/favicon.ico',
  projectName: 'nextjs-docs-ja',

  customFields: {
    nextjsGitHubVersionHash: `${version}`,
  },

  themes: [
    [
      // @ts-ignore
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      // @ts-ignore
      ({
        indexPages: true,
        hashed: true,
        language: ['en', 'ja'],
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/openstandia/Nextjs-docs-ja/blob/main',

          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const defaultSidebarItems = await defaultSidebarItemsGenerator(args)
            return officialNextJsDocsSidebarItemsAdapter(defaultSidebarItems)
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: false,
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [],
          filename: 'sitemap.xml',
        },
        ...configureGtag(),
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '日本語翻訳プロジェクト',
        logo: {
          alt: 'Next.js Docs Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
          className: 'navbar__logo-nextjs',
        },
        items: [
          {
            href: 'https://nextjs.org/docs',
            label: 'English',
            position: 'right',
          },
          {
            href: 'https://github.com/openstandia/Nextjs-docs-ja',
            'aria-label': 'GitHub',
            className: 'navbar__link-github',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            items: [
              {
                label: '免責事項',
                to: 'https://www.nri.com/jp/site/notice',
              },
            ],
          },
          {
            items: [
              {
                label: 'サイト利用規定',
                to: 'https://www.nri.com/jp/site/right',
              },
            ],
          },
          {
            items: [
              {
                label: '個人情報保護方針',
                to: 'https://www.nri.com/jp/site/security',
              },
            ],
          },
          {
            items: [
              {
                label: '個人情報の取扱いについて',
                to: 'https://www.nri.com/jp/site/privacy',
              },
            ],
          },
          {
            items: [
              {
                label: '情報セキュリティ対策についての宣言',
                to: 'https://www.nri.com/jp/site/security_declare',
              },
            ],
          },
        ],
        copyright: `© Copyright Nomura Research Institute, Ltd.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: {
          ...prismThemes.dracula,
          ...{
            plain: {
              ...prismThemes.dracula.plain,
              backgroundColor: '#0a0a0a',
            },
          },
        },
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      metadata: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'keywords',
          content:
            'next, Next, nextjs, Nextjs, next.js, Next.js, react, React, App Router, 日本語, 和訳, 翻訳, ドキュメント',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:image',
          content: 'https://ja.next-community-docs.dev/img/logo.png',
        },
        {
          name: 'twitter:title',
          content: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
        },
        {
          name: 'twitter:description',
          content: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
        },
        {
          property: 'og:site_name',
          content: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
        },
        {
          property: 'og:image',
          content: 'https://ja.next-community-docs.dev/img/logo.png',
        },
      ],
    }),

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
    localeConfigs: {
      ja: {
        label: '日本語',
        direction: 'ltr',
        htmlLang: 'ja',
      },
    },
  },
}

module.exports = config
