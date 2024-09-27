---
title: serverComponentsExternalPackages
description: Server Components のバンドルから特定の依存関係を除外し、ネイティブな Node.js の require を使用してください。
sidebar_position: 30
---

[Server Components](/docs/app-router/building-your-application/rendering/server-components)と[Route Handlers](/docs/app-router/building-your-application/routing/route-handlers)の内部で使用される依存関係は、Next.js によって自動的にバンドルされます。

依存関係が Node.js 固有の機能を使用している場合、特定の依存関係を Server Components のバンドルから除外し、ネイティブの Node.js require を使用するように選択できます。

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@acme/ui'],
  },
}

module.exports = nextConfig
```

Next.js には、現在互換性維持に取り組んでいて、自動的にオプトアウトされる[よく使用されるパッケージの短いリスト](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/server-external-packages.json)が含まれています：

- `@aws-sdk/client-s3`
- `@aws-sdk/s3-presigned-post`
- `@blockfrost/blockfrost-js`
- `@jpg-store/lucid-cardano`
- `@mikro-orm/core`
- `@mikro-orm/knex`
- `@prisma/client`
- `@sentry/nextjs`
- `@sentry/node`
- `@swc/core`
- `argon2`
- `autoprefixer`
- `aws-crt`
- `bcrypt`
- `better-sqlite3`
- `canvas`
- `cpu-features`
- `cypress`
- `eslint`
- `express`
- `firebase-admin`
- `jest`
- `jsdom`
- `lodash`
- `mdx-bundler`
- `mongodb`
- `mongoose`
- `next-mdx-remote`
- `next-seo`
- `payload`
- `pg`
- `playwright`
- `postcss`
- `prettier`
- `prisma`
- `puppeteer`
- `rimraf`
- `sharp`
- `shiki`
- `sqlite3`
- `tailwindcss`
- `ts-node`
- `typescript`
- `vscode-oniguruma`
- `webpack`
