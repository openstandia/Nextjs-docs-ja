---
title: exportPathMap (Deprecated)
sidebar_label: exportPathMap
description: next export を使用したときにHTMLファイルとしてエクスポートされるページをカスタマイズします。
sidebar_position: 9
---

> この機能は `next export` 専用で、現在では**非推奨**となっており、`pages` を使った `getStaticPaths` や `app` を使った `generateStaticParams` が主流となっています。

<details>
  <summary>例</summary>

- [静的エクスポート](https://github.com/vercel/next.js/tree/canary/examples/with-static-export)

</details>

`exportPathMap` を使うと、リクエストパスとページ移動先のマッピングを指定することができます。
`exportPathMap` で定義されたパスは、`next dev` を使用するときにも使用できます。

まずは例として、以下のようなページを持つアプリ用にカスタム `exportPathMap` を作成して見ましょう:

- `pages/index.js`
- `pages/about.js`
- `pages/post.js`

`next.config.js` を開き、以下の `exportPathMap` 設定を追加します:

```js title="next.config.js"
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
}
```

> **Good to know**: `exportPathMap` の `query` フィールドは、[自動的に静的に最適化されたページ](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)や [`getStaticProps` ページ](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props)では使用できません。これらはビルド時にHTMLファイルにレンダリングされるため、`next export` 時に追加のクエリ情報を提供することができません。

ページはHTMLファイルとしてエクスポートされ、例えば `/about` は `/about.html` になります。

`exportPathMap` は2つの引数を受け取る非同期関数です。最初の引数は `defaultPathMap` で、これは Next.js が使用するデフォルトのマップです。2番目の引数は以下となります:

- `dev` - `exportPathMap` が開発中に呼び出されたときに `true` を返します。`next export` を実行するときは `false` を返します。開発では、`exportPathMap` はルートを定義するために使われます。
- `dir` - プロジェクトディレクトリへの絶対パスです。
- `outDir` - `out/` ディレクトリへの絶対パス（[`-o` で設定可能](#アウトプットディレクトリのカスタマイズ)）。`dev` が `true` の場合、`outDir` の値は `null` になります。
- `distDir` - `.next/` ディレクトリへの絶対パス（[`distDir` 設定](https://nextjs.org/docs/pages/api-reference/next-config-js/distDir)で設定可能）
- `buildId` - 生成されたビルドIDです。

返されるオブジェクトはページのマップであり、`key` は `pathname`、`value` は以下のフィールドを受け付けるオブジェクトです:

- `page`: `String` - `pages` ディレクトリ内のページをレンダリングします。
- `query`: `Object` - プリレンダリング時に `getInitialProps` に渡される `query` オブジェクトです。デフォルトは `{}` です。

> エクスポートされる `pathname` は、ファイル名（例えば、`/readme.md` ）にもできますが、`.html`と異なる場合は、そのコンテンツを提供するときに `Content-Type` ヘッダを `text/html` に設定する必要があるかもしれません。

## 末尾のスラッシュの追加

Next.js では、ページを `index.html` ファイルとしてエクスポートし、末尾にスラッシュを必要とするように設定することが可能です。つまり、`/about` は `/about/index.html` になり、`/about/` を経由してルーティングすることができます。これは Next.js 9 以前のデフォルトの動作でした。

戻って末尾のスラッシュを追加するには、`next.config.js` を開き、`trailingSlash` 設定を有効にする:

```js title="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

## アウトプットディレクトリのカスタマイズ

[`next export`](/docs/app-router/building-your-application/deploying/static-exports) では、`out` をデフォルトのアウトプットディレクトリとして使用します。カスタマイズしたい場合、`-o` 引数を使ってカスタマイズできます:

```bash title="Terminal"
next export -o outdir
```

> **注意**: `exportPathMap` の使用は非推奨で、`pages` 内の `getStaticPaths` によってオーバーライドされます。これらを一緒に使うことはお勧めしません。
