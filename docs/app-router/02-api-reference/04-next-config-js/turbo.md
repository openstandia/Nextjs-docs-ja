---
title: turbo (Experimental)
nav_title: turbo
description: Turbopack固有のオプションを使用して、Next.jsを設定します。
sidebar_position: 33
sidebar_label: turbo
---

> **注意**：これらの機能は実験的なもので、`next --turbo`でのみ機能します。

## webpack ローダー

現在、Turbopack は webpack のローダー API のサブセットをサポートしており、いくつかの webpack ローダーを使って Turbopack のコードを変換できます。

ローダーを設定するには、`next.config.js`に、インストールしたローダーの名前と、ファイルの拡張子をローダーのリストにマッピングするオプションを追加します：

```js title="next.config.js"
module.exports = {
  experimental: {
    turbo: {
      loaders: {
        // オプションありの形式
        '.md': [
          {
            loader: '@mdx-js/loader',
            options: {
              format: 'md',
            },
          },
        ],
        // オプションなしの形式
        '.mdx': ['@mdx-js/loader'],
      },
    },
  },
}
```

上記の設定があれば、アプリケーションから変換されたコードを使うことができます：

```js
import MyDoc from './my-doc.mdx'

export default function Home() {
  return <MyDoc />
}
```

## Resolve Alias

`next.config.js`を通じて、Turbopack は、webpack の[`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolvealias)の設定と同様に、エイリアスを通じてモジュール解決を変更するように設定できます。

エイリアスの解決を設定するには、`next.config.js`で、インポートしたパターンを新しい解決先にマップします：

```js title="next.config.js"
module.exports = {
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' },
      },
    },
  },
}
```

これは`underscore`パッケージのインポートを`lodash`パッケージにエイリアスします。言い換えると、`import underscore from 'underscore'`は`underscore`の代わりに`lodash`モジュールをロードします。

Turbopack は、Node.js の[条件付きエクスポート](https://nodejs.org/docs/latest-v18.x/api/packages.html#conditional-exports)のように、このフィールドを使った条件付きエイリアスもサポートしています。現時点ではブラウザの条件のみがサポートされています。上記の場合、Turbopack がブラウザ環境をターゲットにしている場合、`mocha`モジュールのインポートは`mocha/browser-entry.js`にエイリアスされます。

webpack から Turbopack への移行方法については、[Turbopack の webpack との互換性に関するドキュメント](https://turbo.build/pack/docs/migrating-from-webpack)を参照してください。
