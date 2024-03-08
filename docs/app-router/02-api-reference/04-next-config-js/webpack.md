---
title: Custom Webpack Config
nav_title: webpack
description: Next.jsを使用する際にwebpackの設定をカスタマイズする方法を学びましょう。
sidebar_position: 37
sidebar_label: webpack
---

> **Good to know**: webpack の設定変更はセマンティックバージョニングの対象外です。自己責任で行ってください。

アプリケーションの webpack 設定をカスタムする前に、Next.js がすでにサポートしていないか確認してください：

<!-- TODO: Fix links -->

- [CSS imports](/docs/app-router/building-your-application/styling)
- [CSS modules](/docs/app-router/building-your-application/styling/css-modules)
- [Sass/SCSS imports](/docs/app-router/building-your-application/styling/sass)
- [Sass/SCSS modules](/docs/app-router/building-your-application/styling/sass)
- [preact](https://github.com/vercel/next.js/tree/canary/examples/using-preact)

よく問い合わされる機能のいくつかは、プラグインとして提供されています：

- [@next/mdx](https://github.com/vercel/next.js/tree/canary/packages/next-mdx)
- [@next/bundle-analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)

Next.js による`webpack`の設定を拡張するには、次のように`next.config.js`の中で設定を拡張する関数を定義します：

```js title="next.config.js"
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // 重要: 変更されたconfigを返す
    return config
  },
}
```

> `webpack`関数は、サーバー用とクライアント用で 2 回実行されます。これにより、`isServer`プロパティを使用してクライアントとサーバーの設定を区別することができます。

`webpack`関数の第 2 引数は、以下のプロパティを持つオブジェクトです：

- `buildId`: `String` - ビルド間で一意な識別子として使用されるビルド ID
- `dev`: `Boolean` - コンパイルが開発中に行われるかどうかを示す
- `isServer`: `Boolean` - サーバーサイドのコンパイルでは`true`、クライアントサイドのコンパイルでは`false`となる
- `nextRuntime`: `String | undefined` - サーバーサイドのコンパイルの対象となるランタイム。`"edge"`または`"nodejs"`で、クライアントサイドのコンパイルでは`undefined`
- `defaultLoaders`: `Object` - Next.js が内部的に使用するデフォルトのローダー：
  - `babel`: `Object` - デフォルトの`babel-loader`設定

`defaultLoaders.babel`の例は以下のようなものです：

```js
// babel-loaderに依存するローダーを追加するための設定例
// このソースは@next/mdxプラグインのソースから引用している：
// https://github.com/vercel/next.js/tree/canary/packages/next-mdx
module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options,
        },
      ],
    })

    return config
  },
}
```

#### `nextRuntime`

`nextRuntime`が `"edge"`または`"nodejs"`の場合、`isServer`は`true`であることに注意してください。nextRuntime が`"edge"`の場合、現在は Middleware とエッジランタイムの Server Components 専用です。
