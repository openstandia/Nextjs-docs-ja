---
title: redirects
description: Next.js アプリにリダイレクトを追加します
---

リダイレクトを使うと、受信リクエストのパスを別の宛先パスに リダイレクトすることができます。

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

The following characters `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` are used for regex path matching, so when used in the `source` as non-special values they must be escaped by adding `\\` before them:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      {
        // this will match `/english(default)/something` being requested
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
        permanent: false,
      },
    ]
  },
}
```

## ヘッダー、クッキー、クエリーのマッチング

To only match a redirect when header, cookie, or query values also match the `has` field or don't match the `missing` field can be used. Both the `source` and all `has` items must match and all `missing` items must not match for the redirect to be applied.

`has` and `missing` items can have the following fields:

- `type`: `String` - must be either `header`, `cookie`, `host`, or `query`.
- `key`: `String` - the key from the selected type to match against.
- `value`: `String` or `undefined` - the value to check for, if undefined any value will match. A regex like string can be used to capture a specific part of the value, e.g. if the value `first-(?<paramName>.*)` is used for `first-second` then `second` will be usable in the destination with `:paramName`.

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      // if the header `x-redirect-me` is present,
      // this redirect will be applied
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
      // if the header `x-dont-redirect` is present,
      // this redirect will NOT be applied
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
      // if the source, query, and cookie are matched,
      // this redirect will be applied
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // the page value will not be available in the
            // destination since value is provided and doesn't
            // use a named capture group e.g. (?<page>home)
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
      // if the header `x-authorized` is present and
      // contains a matching value, this redirect will be applied
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
      // if the host is `example.com`,
      // this redirect will be applied
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

When leveraging [`basePath` support](/docs/app-router/api-reference/next-config-js/basePath) with redirects each `source` and `destination` is automatically prefixed with the `basePath` unless you add `basePath: false` to the redirect:

```js title="next.config.js"
module.exports = {
  basePath: '/docs',

  async redirects() {
    return [
      {
        source: '/with-basePath', // automatically becomes /docs/with-basePath
        destination: '/another', // automatically becomes /docs/another
        permanent: false,
      },
      {
        // does not add /docs since basePath: false is set
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

When leveraging [`i18n` support](/docs/app-router/building-your-application/routing/internationalization) with redirects each `source` and `destination` is automatically prefixed to handle the configured `locales` unless you add `locale: false` to the redirect. If `locale: false` is used you must prefix the `source` and `destination` with a locale for it to be matched correctly.

```js title="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async redirects() {
    return [
      {
        source: '/with-locale', // automatically handles all locales
        destination: '/another', // automatically passes the locale on
        permanent: false,
      },
      {
        // does not handle locales automatically since locale: false is set
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
        permanent: false,
      },
      {
        // this matches '/' since `en` is the defaultLocale
        source: '/en',
        destination: '/en/another',
        locale: false,
        permanent: false,
      },
      // it's possible to match all locales even when locale: false is set
      {
        source: '/:locale/page',
        destination: '/en/newpage',
        permanent: false,
        locale: false,
      },
      {
        // this gets converted to /(en|fr|de)/(.*) so will not match the top-level
        // `/` or `/fr` routes like /:path* would
        source: '/(.*)',
        destination: '/another',
        permanent: false,
      },
    ]
  },
}
```

In some rare cases, you might need to assign a custom status code for older HTTP Clients to properly redirect. In these cases, you can use the `statusCode` property instead of the `permanent` property, but not both. To to ensure IE11 compatibility, a `Refresh` header is automatically added for the 308 status code.

## その他のリダイレクト

- Inside [API Routes](/docs/pages/building-your-application/routing/api-routes) and [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers), you can redirect based on the incoming request.
- Inside [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) and [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props), you can redirect specific pages at request-time.

## バージョン履歴

| Version   | Changes                        |
| --------- | ------------------------------ |
| `v13.3.0` | `missing` が追加されました。   |
| `v10.2.0` | `has` が追加されました。       |
| `v9.5.0`  | `redirects` が追加されました。 |
