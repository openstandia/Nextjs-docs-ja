---
title: typedRoutes (experimental)
nav_title: typedRoutes
description: 静的型付きリンクの実験的なサポートを有効にします。
sidebar_label: typedRoutes
sidebar_position: 34
---

[静的型付けリンク](/docs/app-router/building-your-application/configuring/typescript#statically-typed-links)の実験的なサポートです。この機能を使用するには、プロジェクトで TypeScript だけでなく App Router も使用する必要があります。

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
```
