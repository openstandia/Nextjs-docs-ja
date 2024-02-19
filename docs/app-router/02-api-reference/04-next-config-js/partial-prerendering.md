---
title: Partial Prerendering (experimental)
description: Next.js 14 で部分プリレンダリング（実験的）を有効にする方法について説明します。
---

> **注意**: 部分プリレンダリングは実験的な機能であり、現在のところ **本番環境には適していません**。

部分プレレンダリングは、ルートの静的な部分をプリレンダリングし、キャッシュから提供し、動的な箇所をストリームで埋め込むことができる実験的な機能です。これら全ては一つのHTTPリクエスト内で行われます。

部分なプリレンダリング は `next@canary` で利用可能です:

```bash title="Terminal"
npm install next@canary
```

実験的に `ppr` フラグを設定することで、部分プリレンダリングを有効にすることができます:

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
}

module.exports = nextConfig
```

> **Good to know:**
>
> - 部分プリレンダリングは、クライアント側のナビゲーションにはまだ適用されません。積極的に取り組んでいるところです。
> - 部分的なプリレンダリングは、[Node.js ランタイム](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes)専用に設計されています。静的なシェルを即座に提供できる場合、Node.js ランタイムのサブセットを使用する必要はありません。

部分プリレンダリングの詳細は、[Next.js Learn コース](https://nextjs.org/learn/dashboard-app/partial-prerendering)をご覧ください。
