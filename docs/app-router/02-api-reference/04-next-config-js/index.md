---
title: next.config.js 設定オプション
description: next.config.jsを使用してアプリケーションの設定を行う方法を学びましょう。
---

Next.js の設定は、プロジェクトディレクトリのルートに存在する `next.config.js` ファイルで設定できます。

```js title=next.config.js
/** @type {import(‘next’).NextConfig} */
const nextConfig = {
  /* config options here */
}
module.exports = nextConfig
```

`next.config.js{} は、JSON ファイルではなく、通常の Node.js モジュールです。Next.js のサーバーとビルドフェーズで使用され、ブラウザのビルドには含まれません。

[ECMAScript モジュール](https://nodejs.org/api/esm.html)が必要な場合は、`next.config.mjs` を使用できます：

```js title=next.config.mjs
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
}

export default nextConfig
```

関数を使うこともできます：

```js title=next.config.mjs
export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
  }
  return nextConfig
}
```

Next.js 12.1.0 から、非同期関数が使えるようになりました：

```js title=next.config.js
module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
  }
  return nextConfig
}
```

`phase` は、コンフィギュレーションがロードされる現在のコンテキストです。[利用可能な phase ](https://github.com/vercel/next.js/blob/5e6b008b561caf2710ab7be63320a3d549474a5b/packages/next/shared/lib/constants.ts#L19-L23)を見ることができます。Phase は `next/constants` からインポートできます：

```js
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
    }
  }

  return {
    /* config options for all phases except development here */
  }
}
```

コメント行は、`next.config.js` で許可されている設定を置く場所であり、[このファイルで定義](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-shared.ts)されている。

しかし、どの設定も必須ではありませんし、それぞれの設定が何をするのかを理解する必要もありません。その代わりに、このセクションで有効化または変更する必要のある機能を検索すれば、何をすればよいかがわかります。

> `next.config.js` は Webpack、Babel、TypeScript で解析されません。

このページでは、利用可能なすべての設定オプションについて説明します。
