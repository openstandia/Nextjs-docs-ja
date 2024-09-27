---
title: mdxRs
description: 新しい Rust コンパイラを使用して、App Router 内の MDX ファイルをコンパイルします。
sidebar_position: 18
---

`@next/mdx`と一緒に使用します。新しい Rust コンパイラを使用して MDX ファイルをコンパイルします。

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
