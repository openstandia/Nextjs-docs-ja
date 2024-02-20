---
title: pageExtensions
description: Pagesルーターでページを解決するときにNext.jsが使用するデフォルトのページ拡張子を拡張します
---

By default, Next.js accepts files with the following extensions: `.tsx`, `.ts`, `.jsx`, `.js`.
This can be modified to allow other extensions like markdown (`.md`, `.mdx`).

デフォルトでは、Next.js は次の拡張子のファイルを受け入れます: `.tsx`、`.ts`、`.jsx`、`.js`です。
マークダウン（`.md`、`.mdx`）のような他の拡張子を許可するように変更することもできます。

```js title="next.config.js"
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```
