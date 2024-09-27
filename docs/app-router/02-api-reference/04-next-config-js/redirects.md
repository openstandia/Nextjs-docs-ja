---
title: redirects
description: Next.js アプリにリダイレクトを追加します。
sidebar_position: 27
---

リダイレクトを使うと、受信リクエストのパスを別の宛先パスにリダイレクトすることができます。

リダイレクトを使うには、`next.config.js` の `redirects` キーを使います:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
```

`redirects` は非同期関数で、`source`、`destination`、`permanent` プロパティを持つオブジェクトが配列で返されることを期待します:

- `source` は受信リクエストのパスパターンです。
- `destination` はルーティングしたいパスです。
- `permanent` `true` または `false` - `true`の場合、クライアントや検索エンジンにリダイレクトを永久にキャッシュするよう指示する 308 ステータスコードを使用し、falseの場合、一時的でキャッシュされない 307 ステータスコードを使用します。

> **なぜ Next.js は307と308を使うのですか？** 伝統的に 302 は一時的なリダイレクトに使われ、301 は恒久的なリダイレクトに使われたが、多くのブラウザは元のメソッドに関係なく、リダイレクトのリクエストメソッドを `GET` に変更しました。例えばブラウザが `POST /v1/users` リクエストを行い、ステータスコード `302` と location `/v2/users` を返した場合、その後のリクエストは期待された `POST /v2/users` ではなく `GET /v2/users` になるかもしれません。Next.js は、307 の一時リダイレクトと 308 の永久リダイレクトのステータスコードを使って、使用されたリクエストメソッドを明示的に保持します。

- `basePath`: `false` または `undefined` - falseの場合、`basePath` はマッチング時に含まれません。これは外部リダイレクトのみに使用できます。
- `locale`: `false` または `undefined` - マッチング時にロケールを含めないかどうかです。
- `has` は、`type`、`key`、`value`プロパティを持つ [has オブジェクト](#ヘッダークッキークエリーのマッチング)の配列です。
- `missing` は、`type`、`key`、`value`プロパティを持つ [missing オブジェクト](#ヘッダークッキークエリーのマッチング)の配列です。

リダイレクトは、、pages や `/public` ファイルを含むファイルシステムの前にチェックされます。

Pages Router を使う場合、[Middleware](/docs/app-router/building-your-application/routing/middleware) が存在し、パスにマッチしない限りリダイレクトはクライアント側のルーティング(`Link`, `router.push`)には適用されません。

リダイレクトが適用されると、リクエストで指定されたクエリの値がリダイレクト先に渡されます。例えば、以下のリダイレクト設定を参照してください:

```js
{
  source: '/old-blog/:path*',
  destination: '/blog/:path*',
  permanent: false
}
```

`old-blog/post-1?hello=world` がリクエストされると、クライアントは `/blog/post-1?hello=world` にリダイレクトされます。

## パスマッチング

パスのマッチは可能で、例えば `/old-blog/:slug` は `/old-blog/hello-world` にマッチします（ネストされたパスはありません）:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug', // マッチしたパラメータは destination で使用することができます
        permanent: true,
      },
    ]
  },
}
```

### ワイルドカードパスマッチング

ワイルドカードパスにマッチさせるには、パラメータの後に `*` を使います。例えば、`/blog/:slug*` は `/blog/a/b/c/d/hello-world` にマッチします:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // マッチしたパラメータは destination で使用することができます
        permanent: true,
      },
    ]
  },
}
```

### 正規表現パスマッチング

正規表現パスにマッチさせるには、パラメータの後に正規表現を括弧で括ります。例えば、`/post/:slug( \d{1,})` は `/post/123` にマッチしますが、`/post/abc` にはマッチしません:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/news/:slug', // マッチしたパラメータは destination で使用することができます
        permanent: false,
      },
    ]
  },
}
```

`(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` は正規表現パスマッチングに使用されるため、 `source` 内で非特殊値として使用される場合は、それらの文字の前に `\\`を追加してエスケープする必要があります:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        // これは `/english(default)/something` にマッチします
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
        permanent: false,
      },
    ]
  },
}
```

## ヘッダー、クッキー、クエリーのマッチング

ヘッダ、クッキー、クエリの値が `has` フィールドにもマッチするとき、あるいは `missing` フィールドにマッチしないときにのみ、リダイレクトをマッチさせるために使うことができます。
リダイレクトを適用するためには、`source` とすべての `has` 項目がマッチし、すべての `missing` 項目がマッチしなければなりません。

`has` と `missing` には以下のフィールドがあります:

- `type`: `String` - `header`、`cookie`、`host`、`query` のいずれかでなければなりません。
- `key`: `String` - 選択した型のキーと照合します。
- `value`: `String` or `undefined` - チェックする値です。undefinedの場合、任意の値がマッチします。 正規表現のような文字列を使用して、値の特定の部分を捕捉することができます。例えば、値として `first-(?<paramName>.*)` を使用し、`first-second` であれば、`:paramName` として destination で `second` を使用することができます。

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      // ヘッダ `x-redirect-me` が存在する場合、このリダイレクトが適用されます。
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
      // ヘッダ `x-dont-redirect` が存在する場合、このリダイレクトは適用されません。
      {
        source: '/:path((?!another-page$).*)',
        missing: [
          {
            type: 'header',
            key: 'x-do-not-redirect',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
      //
      // source、query、cookie が一致した場合、このリダイレクトが適用されます。
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // 値が提供され名前付きキャプチャグループを使用しないため、
            // ページの値は destination で使用できません。例: (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        permanent: false,
        destination: '/another/:path*',
      },
      // ヘッダ `x-authorized` が存在し、マッチする値が含まれていれば、このリダイレクトが適用されます。
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        permanent: false,
        destination: '/home?authorized=:authorized',
      },
      // ホストが `example.com` の場合、このリダイレクトが適用されます。
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
    ]
  },
}
```

### basePathをサポートするリダイレクト

リダイレクトに `basePath: false` を追加しない限り、リダイレクトで [basePath サポート](/docs/app-router/api-reference/next-config-js/basePath)を利用する場合、それぞれの `source` と `destination` には自動的に `basePath` が先頭に付きます:

```js title="next.config.js"
module.exports = {
  basePath: '/docs',

  async redirects() {
    return [
      {
        source: '/with-basePath', // 自動的に /docs/with-basePath になります
        destination: '/another', // 自動的に /docs/another になります
        permanent: false,
      },
      {
        // basePath: falseが設定されているので、/docsは追加されません。
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
        permanent: false,
      },
    ]
  },
}
```

### 国際化をサポートするリダイレクト

リダイレクトで[国際化サポート](/docs/app-router/building-your-application/routing/internationalization)を使用する場合は、 `locale: false` をリダイレクトに追加しない限り、設定されているロケールに対応するように `source` と `destination` が自動的にプレフィックスされます。`locale: false` を使用する場合は、`source` と `destination` にロケールのプレフィックスをつけなければ正しくマッチしません。

```js title="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async redirects() {
    return [
      {
        source: '/with-locale', // すべてのロケールを自動的に処理します
        destination: '/another', // 自動的にロケールが渡されます
        permanent: false,
      },
      {
        // locale:falseが設定されているので、ロケールは自動的に処理されません
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
        permanent: false,
      },
      {
        // `en` がデフォルトのロケールのため、`/`　にマッチします
        source: '/en',
        destination: '/en/another',
        locale: false,
        permanent: false,
      },
      // locale:falseが設定されていても、すべてのロケールにマッチさせることができます
      {
        source: '/:locale/page',
        destination: '/en/newpage',
        permanent: false,
        locale: false,
      },
      {
        // これは /(en|fr|de)/(.*) に変換されるため、/:path* のようにトップレベルの `/` や `/fr` ルートにはマッチしません。
        source: '/(.*)',
        destination: '/another',
        permanent: false,
      },
    ]
  },
}
```

まれに、古い HTTP クライアントが適切にリダイレクトするために、カスタムステータスコードを割り当てる必要がある場合があります。
このような場合、`permanent` プロパティの代わりに `statusCode` プロパティを使用することができますが、両方を使用することはできません。
IE11 との互換性を確保するために、308 ステータスコードに対して `Refresh` ヘッダが自動的に追加されます。

## その他のリダイレクト

- [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) と [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) の内部では、送られてくるリクエストに基づいてリダイレクトすることができます。
- [`getStaticProps`](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props) と [`getServerSideProps`](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props) の内部では、リクエスト時に特定のページをリダイレクトできます。

## バージョン履歴

| Version   | Changes                        |
| --------- | ------------------------------ |
| `v13.3.0` | `missing` が追加されました。   |
| `v10.2.0` | `has` が追加されました。       |
| `v9.5.0`  | `redirects` が追加されました。 |
