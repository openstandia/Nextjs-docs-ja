---
title: rewrite
description: Next.jsアプリケーションにリライト機能を追加します
---

リライトにより、リクエストされたパスを別のパスにマップできます。

リライトはURLプロキシとして機能し、目的のパスをマスクすることで、ユーザーがサイト上の場所を変更していないように見せます。対照的に、リダイレクトは新しいページに再ルーティングし、URLの変更を表示します。

リライトを使用するには、`next.config.js`内の`rewrites`キーを使用します：

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}
```

リライトはクライアントサイドのルーティングに適用され、上記の例では`<Link href="/about">`にリライトが適用されます。

`rewrites`は非同期関数で、`source`と`destination`プロパティを持つオブジェクトを配列、またはオブジェクトの配列（以下を参照）を返すことを期待しています：

- `source`: `String` - 受信したリクエストパスのパターンです。
- `destination`: `String`はルーティング先のパスです。
- `basePath`: `false`または`undefined` - falseの場合、マッチング時にbasePathを含みません。外部へのリライト専用に使用できます。
- `locale`: `false`または`undefined` - マッチング時にロケールを含めるかです。
- `has`は、`type`、`key`、`value`プロパティを持つ[hasオブジェクト](#ヘッダークッキークエリのマッチング)の配列です。
- `missing`は、`type`、`key`、`value`プロパティを持つ[missingオブジェクト](#ヘッダークッキークエリのマッチング)の配列です。

`rewrites` 関数が配列を返す場合、リライトはファイルシステム（ページと`/public` 以下のファイル）を確認した後、動的なルーティングの前に適用されます。
`rewrites` 関数が特定の形状を持つ配列のオブジェクトを返すと、この動作を変更し、より細かく制御できます。これはNext.jsの`v10.1`以降の機能です:

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        // このリライトはヘッダー/リダイレクトを確認した後、ページファイルの上書きを許可する _next/public ファイルを含む全てのファイルの前に確認されます。
        {
          source: '/some-page',
          destination: '/somewhere-else',
          has: [{ type: 'query', key: 'overrideMe' }],
        },
      ],
      afterFiles: [
        // このリライトは、ページまたは public ファイルが確認された後、
        // かつ、動的ルーティングの前に確認されます
        {
          source: '/non-existent',
          destination: '/somewhere-else',
        },
      ],
      fallback: [
        // このリライトは、ページ、 public ファイルと
        // 動的ルーティングが確認された後に確認されます
        {
          source: '/:path*',
          destination: `https://my-old-site.com/:path*`,
        },
      ],
    }
  },
}
```

> **Good to know**: `beforeFiles`でのリライトは、ソースと一致した直後にファイルシステム/動的ルーティングを確認しません。すべての `beforeFiles`が確認されるまで続行します。

Next.js のルートが確認される順序は以下のとおりです:

1. [ヘッダー](/docs/app-router/api-reference/next-config-js/headers)が確認/適用されます。
2. [リダイレクト](/docs/app-router/api-reference/next-config-js/redirects)が確認/適用されます。
3. `beforeFiles`のリライトが確認/適用されます。
4. [publicディレクトリ](/docs/app-router/building-your-application/optimizing/static-assets)の静的ファイル、`_next/static`ファイル、非動的ページが確認/提供されます。
5. `afterFiles`のリライトが確認/適用されます。これらのリライトの1つがマッチした場合、各マッチの後で動的ルート/静的ファイルを確認します。
<!-- textlint-disable -->
6. `fallback` リライトが確認/適用されます。これらは、404 ページのレンダリング前と動的ルート/すべての静的アセットの確認後に適用されます。 `getStaticPaths` の中で [fallback: true/'blocking'](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true) を使用している場合、 `next.config.js` で定義された fallback `rewrites` は実行されません。
<!-- textlint-enable -->

## リライトのパラメーター

リライトでパラメーターを使用する場合、`destination`でパラメーターが1つも使用されていない場合、デフォルトでパラメーターはクエリに渡されます。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/old-about/:path*',
        destination: '/about', // ここでは:pathパラメーターは使用されていないので、クエリとして自動的に渡されます
      },
    ]
  },
}
```

`destination`でパラメーターが使用されている場合、パラメーターは自動的にクエリに渡されません。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: '/:path*', // ここでは:pathパラメーターが使用されているため、クエリとして自動的には渡されません
      },
    ]
  },
}
```

さらに、`destination`の中でパラメーターがすでに使用されている場合でも、クエリとして手動でパラメーターを渡すことができます。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:first/:second',
        destination: '/:first?second=:second',
        // :first パラメーターは destination で使用されているため、:second パラメーターは
        // 自動的にクエリに追加されませんが、上記のように手動で追加することができます
      },
    ]
  },
}
```

> **Good to know**: リライトからのパラメーターは[Automatic Static Optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)によって生成された静的ページや[プリレンダリング](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props)のパラメーターはハイドレーション後にクライアントで解析され、クエリとして提供されます。

## パスのマッチング

パスのマッチングが可能であり、たとえば `/blog/:slug` は `/blog/hello-world` にマッチします（ネストされたパスは含まれません）。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/news/:slug', // マッチしたパラメーターはdestinationで使用できます
      },
    ]
  },
}
```

### ワイルドカードによるパスのマッチング

ワイルドカードを使用してパスをマッチさせることもできます。たとえば、`/blog/:slug*` は `/blog/a/b/c/d/hello-world` にマッチします。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // マッチしたパラメーターはdestinationで使用できます
      },
    ]
  },
}
```

### 正規表現によるパスのマッチング

正規表現を使用してパスをマッチさせることもできます。パラメーターの後ろに括弧で正規表現を書くことができます。たとえば、`/blog/:slug(\\d{1,})` は `/blog/123` にマッチしますが、`/blog/abc` にはマッチしません。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/old-blog/:post(\\d{1,})',
        destination: '/blog/:post', // マッチしたパラメーターはdestinationで使用できます
      },
    ]
  },
}
```

次の文字 `(`, `)`, `{`, `}`, `[`, `]`, `|`, `\`, `^`, `.`, `:`, `*`, `+`, `-`, `?`, `$`は正規表現のパスマッチングで使用されます。そのため `source` 内で特殊な値として使用する場合、それらの前に `\\` を追加してエスケープする必要があります。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        // リクエストされた `/english(default)/something` にマッチします
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
      },
    ]
  },
}
```

## ヘッダー、クッキー、クエリのマッチング

ヘッダー、クッキー、クエリの値にマッチした場合にのみリライトを適用するために、`has` フィールドを使用できます。また `missing` フィールドと合わせて使用することで、その値がマッチしない場合にリライトを適用できます。`source` とすべての `has` アイテムがマッチし、すべての `missing` アイテムがマッチしない場合にのみ、リライトが適用されます。

`has`と`missing`のアイテムは以下のフィールドを持つことができます:

- `type`: `String` - `header`、`cookie`、`host`、または`query`でなければなりません。
- `key`: `String` - 選択したタイプに対するキーをマッチさせます。
- `value`: `String`または`undefined` - チェックする値です。undefined の場合、あらゆる値にマッチします。例えば `first-(?<paramName>.*)` が `first-second` に対して使用された場合、`second` は `:paramName`として destination の値に利用できます。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      // ヘッダー`x-rewrite-me`が存在している場合、
      // このリライトが適用されます
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // ヘッダー`x-rewrite-me`が存在しない場合、
      // このリライトが適用されます
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // source、query、cookieがすべてマッチした場合、
      // このリライトが適用されます
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // valueが指定され、名前付きのキャプチャグループ（例: (?<page>home)）を使用していないため、
            // ページの値は destination で利用できません。
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        destination: '/:path*/home',
      },
      // ヘッダー`x-authorized`が存在し、
      // 値がマッチしている場合、このリライトが適用されます
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        destination: '/home?authorized=:authorized',
      },
      // ホスト名が `example.com`の場合、
      // このリライトが適用されます
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        destination: '/another-page',
      },
    ]
  },
}
```

## 外部URLへのリライト

<details>
  <summary>例</summary>

- [Next.jsの段階的な採用](https://github.com/vercel/next.js/tree/canary/examples/custom-routes-proxying)
- [複数のゾーンの利用](https://github.com/vercel/next.js/tree/canary/examples/with-zones)

</details>

リライトを使って外部の URL にリライトできます。これは、Next.jsを段階的に採用する際に特に便利です。以下の例は、メインアプリケーションの `/blog` ルートを外部サイトにリダイレクトするリライトの例です。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://example.com/blog',
      },
      {
        source: '/blog/:slug',
        destination: 'https://example.com/blog/:slug', // マッチしたパラメーターはdestinationで使用できます
      },
    ]
  },
}
```

`trailingSlash: true` を使用している場合、`source` パラメーターにも末尾の `/` を挿入する必要があります。もしリライト先のサーバーも末尾の `/` を期待している場合、それも `destination` パラメーターに含める必要があります。

```js title="next.config.js"
module.exports = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/blog/',
        destination: 'https://example.com/blog/',
      },
      {
        source: '/blog/:path*/',
        destination: 'https://example.com/blog/:path*/',
      },
    ]
  },
}
```

### Next.jsの段階的な採用

すべてのNext.jsルートをチェックした後、Next.js を既存のウェブサイトへのプロキシにフォールバックさせることもできます。

こうすることで、Next.js に移行するページを増やしても、その都度、設定を変更する必要がなくなります。

```js title="next.config.js"
module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://custom-routes-proxying-endpoint.vercel.app/:path*`,
        },
      ],
    }
  },
}
```

### `basePath` を利用している場合のリライト

[`basePath`](/docs/app-router/api-reference/next-config-js/basePath)とリライトを連携させると、`source` と `destination` には自動的に `basePath` がプレフィクスとして追加されます。

ただし、リライトに `basePath: false` を追加すると、`basePath` は追加されません。

```js title="next.config.js"
module.exports = {
  basePath: '/docs',

  async rewrites() {
    return [
      {
        source: '/with-basePath', // 自動的に/docs/with-basePathに変わります
        destination: '/another', // 自動的に/docs/anotherに変わります
      },
      {
        // basePath: falseを設定しているため、/without-basePathには/docsを追加しません
        // 注意：これは内部のリライト、たとえば`destination: '/another'`では使えません
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
      },
    ]
  },
}
```

### 国際化に対応している場合のリライト

リライトと[国際化対応](/docs/app-router/building-your-application/routing/internationalization)を連携させると、それぞれの `source` と `destination` は設定された `locales` を処理するために自動的にプレフィクスが付けられます。

ただし、リライトに `locale: false` を追加すると、ロケールの処理を自動で行いません。`locale: false` を使用する場合、`source` と `destination` 両方にロケールをプレフィクスとして追加する必要があります。

```js title="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async rewrites() {
    return [
      {
        source: '/with-locale', //全てのロケールを自動的に取り扱います
        destination: '/another', // ロケールは自動的に渡されます
      },
      {
        // locale: falseを設定しているため、ロケールの処理は自動では行いません
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
      },
      {
        // これは「/」にマッチします。なぜなら「en」はdefaultLocaleだからです
        source: '/en',
        destination: '/en/another',
        locale: false,
      },
      {
        // locale: falseが設定されていても、すべてのロケールにマッチすることが可能です
        source: '/:locale/api-alias/:path*',
        destination: '/api/:path*',
        locale: false,
      },
      {
        // これは /(en|fr|de)/(.*) に変換されるので、トップレベルの / や /fr のようなルートにはマッチしませんが /:path* にマッチします
        source: '/(.*)',
        destination: '/another',
      },
    ]
  },
}
```

## バージョン履歴

| バージョン | 変更点          |
| ---------- | --------------- |
| `v13.3.0`  | `missing`を追加 |
| `v10.2.0`  | `has`を追加     |
| `v9.5.0`   | ヘッダーを追加  |
