// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

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
  title: 'Next.js Docs',
  tagline: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
  url: 'https://ja.next-community-docs.dev/',
  baseUrl: process.env.BASE_URL || '/',
  staticDirectories: ['public', 'static'],
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  projectName: 'nextjs-docs-ja',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/openstandia/Nextjs-docs-ja/blob/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
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
        title: 'Next.js Docs',
        logo: {
          alt: 'Next.js Docs Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'app-router/index',
            position: 'left',
            label: 'ガイドライン',
          },
          {
            href: 'https://github.com/openstandia/Nextjs-docs-ja',
            label: 'GitHub',
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      // for docusaurus-plugin-image-zoom
      zoom: {
        selector: '.markdown :not(em) > img',
        config: {
          background: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(50, 50, 50)',
          },
        },
      },
      metadata: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'keywords',
          content:
            'next, Next, nextjs, Nextjs, next.js, Next.js, react, React, App Router',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:image',
          content: 'https://ja.next-community-docs.dev/img/logo.png',
        },
        { name: 'twitter:title', content: 'Next.js Docs' },
        {
          name: 'twitter:description',
          content: 'Next.js 公式ドキュメント 日本語翻訳プロジェクト',
        },
        { property: 'og:site_name', content: 'Next.js Docs' },
        {
          property: 'og:image',
          content: 'https://ja.next-community-docs.dev/img/logo.png',
        },
      ],
    }),

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  plugins: [require.resolve('docusaurus-plugin-image-zoom')],
}

module.exports = config
