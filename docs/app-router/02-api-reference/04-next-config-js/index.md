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

- [appDir](./appDir): App Routerを使用して、レイアウト、ストリーミングなどを有効にします。
- [assetPrefix](./assetPrefix): CDN を設定するための assetPrefix 設定オプションの使い方を学びます。
- [basePath](./basePath): `basePath` を使用して、Next.js アプリケーションをドメインのサブパスにデプロイします。
- [compress](./compress): Next.js は、レンダリングされたコンテンツと静的ファイルを圧縮するための gzip 圧縮を提供していますが、これはサーバーターゲットでのみ機能します。詳細についてはこちらをご覧ください。
- [devIndicators](./devIndicators): 最適化されたページには、静的に最適化されているかどうかを知らせるインジケータがあります。ここでオプトアウトすることもできます。
- [distDir](./distDir): デフォルトの .next ディレクトリの代わりにカスタムのビルドディレクトリを設定します。
- [env](./env): Next.js アプリケーションでビルド時に環境変数を追加およびアクセスする方法を学びます。
- [eslint](./eslint): デフォルトでは、Next.js はビルド時に ESLint のエラーと警告を報告します。この動作をオプトアウトする方法については、こちらを確認してください。
- [exportPathMap](./exportPathMap): `next export` を使用したときにHTMLファイルとしてエクスポートされるページをカスタマイズします。
- [generateBuildId](./generateBuildId): ビルドIDを設定してください。このIDは、現在のビルドがどのアプリケーションに提供されているかを識別するのに使用されます。
- [generateEtags](./generateEtags): Next.js では、デフォルトですべてのページに etag が生成されます。etag の生成を無効にする方法については、こちらで詳細をご確認ください。
- [headers](./headers): Next.js アプリにカスタム HTTP ヘッダーを追加します。
- [httpAgentOptions](./httpAgentOptions): Next.js では、デフォルトで HTTP Keep-Alive が自動的に使用されます。HTTP Keep-Alive を無効にする方法については、こちらをご覧ください。
- [images](./images): `next/image` ローダーのカスタム設定です。
- [cacheHandler](./incrementalCacheHandlerPath): Next.js のキャッシュを構成し、Redis、Memcached などの外部サービスを使用してデータを保存、再検証する方法を学習します。
- [instrumentationHook](./instrumentationHook): Next.js アプリに instrumentation を設定するには、instrumentationHook オプションを使用します。
- [logging](./logging): 開発モードで Next.js を実行する際のデータフェッチのログ出力設定方法です。
- [mdxRs](./mdxRs): 新しい Rust コンパイラを使用して、App Router 内の MDX ファイルをコンパイルします。
- [onDemandEntries](./onDemandEntries): Next.js が開発中に作成されるページを解放したりメモリに保持する方法を設定します。
- [optimizePackageImports](./optimizePackageImports): Next.js 設定オプションの optmizedPackageImports の API リファレンスです。
- [output](./output): Next.js は、アプリケーションの簡単なデプロイを可能にするために、自動的に各ページが必要とするファイルをトレースします。こちらでその仕組みを学びます。
- [pageExtensions](./pageExtensions): Pages Router でページを解決するときに Next.js が使用するデフォルトのページ拡張子を拡張します。
- [Partial Prerendering (experimental)](./partial-prerendering): Next.js 14 で部分プリレンダリング（実験的）を有効にする方法について説明します。
- [poweredByHeader](./poweredByHeader): Next.js では、デフォルトで x-powered-by ヘッダーが追加されます。オプトアウトする方法については、こちらをご覧ください。
- [productionBrowserSourceMaps](./productionBrowserSourceMaps): プロダクションビルド中にブラウザのソースマップの生成を有効にします。
- [reactStrictMode](./reactStrictMode): Next.js の完全なランタイムは Strict Mode に対応しました。オプトイン方法を学びます。
- [redirects](./redirects): Next.js アプリにリダイレクトを追加します。
- [rewrites](./rewrites): Next.js アプリケーションにリライト機能を追加します。
- [serverActions](./serverActions): Next.js アプリケーションでの Server Actions の挙動を設定します。
- [serverComponentsExternalPackages](./serverComponentsExternalPackages): Server Components のバンドルから特定の依存関係を除外し、ネイティブな Node.js の require を使用してください。
- [trailingSlash](./trailingSlash): Next.js のページを設定して、末尾のスラッシュの有無に対応させます。
- [transpilePackages](./transpilePackages): ローカルパッケージ（モノリポスのようなもの）または外部依存関係（ node_modules ）から依存関係を自動的に変換し、バンドル化します。
- [turbo](./turbo): Turbopack 固有のオプションを使用して、Next.js を設定します。
- [typedRoutes](./typedRoutes): 静的型付きリンクの実験的なサポートを有効にします。
- [typescript](./typescript): Next.js では、デフォルトで TypeScript のエラーが報告されます。この動作を無効にする方法をこちらで学びます。
- [urlImports](./urlImports): Next.js で外部 URL からモジュールをインポートする設定（Experimental）です。
- [webpack](./webpack): Next.js を使用する際に webpack の設定をカスタマイズする方法を学びます。
- [webVitalsAttribution](./webVitalsAttribution): Web Vitals の問題の原因を特定するために、webVitalsAttribution オプションの使用方法を学びます。
