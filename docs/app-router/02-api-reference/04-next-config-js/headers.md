---
title: headers
description: Next.js アプリにカスタム HTTP ヘッダーを追加します
sidebar_position: 12
---

headers は、指定されたパスの受信リクエストに対するレスポンスにカスタム HTTP ヘッダーを設定することができます。

カスタム HTTP ヘッダーを設定するには、`next.config.js` の `headers` キーを使用します:

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

`headers` は非同期関数で、`source` プロパティと `headers` プロパティを持つオブジェクトを保持する配列が返されることを期待します:

- `source` は受信リクエストのパスパターンです。
- `headers` はレスポンスヘッダーオブジェクトの配列で、`key` と `value` のプロパティを持ちます。
- `basePath`: `false` または `undefined` - false の場合、マッチング時に `basePath` は含まれません。これは外部の書き換え専用に利用されます。
- `locale`: `false` または `undefined` - マッチング時にロケールを含めないかどうかを指定します。
- `has` は、`type`、`key`、`value` プロパティを持つ [has オブジェクト](#ヘッダクッキークエリーのマッチング)の配列です。
- `missing` は、`type`、`key`、`value` のプロパティを持つ [missing オブジェクト](#ヘッダークッキークエリーのマッチング)の配列です。

ヘッダーは、pages や `/public` ファイルを含むファイルシステムの前にチェックされます。

## ヘッダーのオーバーライド

2つのヘッダーが同じパスにマッチし、同じヘッダーキーを設定した場合、最後のヘッダーキーが最初のヘッダーキーを上書きします。
以下のヘッダーを使うと、`/hello`というパスは最後に設定されたヘッダー値が `world` であるため、`x-hello` というヘッダーが `world` になります。

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-hello',
            value: 'there',
          },
        ],
      },
      {
        source: '/hello',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

## パスマッチング

パスのマッチは許可され、例えば `/blog/:slug` は `/blog/hello-world` にマッチします（ネストされたパスはありません）:

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:slug',
        headers: [
          {
            key: 'x-slug',
            value: ':slug', // マッチしたパラメータは value で使用することができます
          },
          {
            key: 'x-slug-:slug', // マッチしたパラメータは key で使用することができます
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

### ワイルドカードパスマッチング

ワイルドカードパスにマッチさせるには、パラメータの後に `*` を使います。例えば、`/blog/:slug*` は `/blog/a/b/c/d/hello-world` にマッチします:

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:slug*',
        headers: [
          {
            key: 'x-slug',
            value: ':slug*', // マッチしたパラメータは value で使用することができます
          },
          {
            key: 'x-slug-:slug*', // マッチしたパラメータは key で使用することができます
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

### 正規表現パスマッチング

正規表現パスにマッチさせるには、パラメータの後に括弧で括ります。
例えば、`/blog/:slug(\\d{1,})` は `/blog/123`にマッチしますが、`/blog/abc` にはマッチしません:

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/blog/:post(\\d{1,})',
        headers: [
          {
            key: 'x-post',
            value: ':post',
          },
        ],
      },
    ]
  },
}
```

`(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` は正規表現パスマッチングに使用されるため、`source` 内で非特殊値として使用される場合は、それらの文字の前に `\\` を追加してエスケープする必要があります:

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        // これは `/english(default)/something` にマッチします
        source: '/english\\(default\\)/:slug',
        headers: [
          {
            key: 'x-header',
            value: 'value',
          },
        ],
      },
    ]
  },
}
```

## ヘッダー、クッキー、クエリーのマッチング

ヘッダー、クッキー、クエリーの値が `has` フィールドにもマッチするとき、あるいは `missing` フィールドにマッチしないときにのみ、ヘッダーを適用することができます。
ヘッダーを適用するためには、`source` とすべての `has` 項目がマッチし、すべての `missing` 項目がマッチしなければなりません。

`has` と `missing` には以下のフィールドがあります:

- `type`: `String` - `header`、`cookie`、`host`、`query` のいずれかでなければなりません。
- `key`: `String` - 選択した型のキーと照合します。
- `value`: `String` または `undefined` - チェックする値です。undefinedの場合、任意の値がマッチします。正規表現のような文字列を使用して、値の特定の部分を捕捉することができます。例えば、値として `first-(?<paramName>.*)` を使用し、`first-second` であれば、`:paramName` として destination で `second` を使用することができます。

```js title="next.config.js"
module.exports = {
  async headers() {
    return [
      // ヘッダ `x-add-header` が存在する場合、ヘッダ `x-another-header` が適用されます。
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-add-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // ヘッダ `x-no-header` が存在しない場合、x-another-header` ヘッダが適用されます。
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-no-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // source、query、および cookie が一致した場合、 x-authorized`ヘッダが適用されます。
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // 値が提供され名前付きキャプチャグループを使用しないため、
            // ページの値はヘッダーのkey/valuesで使用できません。例: (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-authorized',
            value: ':authorized',
          },
        ],
      },
      // ヘッダー `x-authorized` が存在し、マッチする値が含まれていれば、`x-another-header` が適用されます。
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
      // ホストが `example.com` の場合、このヘッダが適用されます。
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
    ]
  },
}
```

## basePath をサポートするヘッダー

ヘッダーで [`basePath` サポート](/docs/app-router/api-reference/next-config-js/basePath)を利用する場合、ヘッダーに `basePath: false` を追加しない限り、各 `source` は自動的に `basePath` でプレフィックスされます:

```js title="next.config.js"
module.exports = {
  basePath: '/docs',

  async headers() {
    return [
      {
        source: '/with-basePath', // /docs/with-basePath になります
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/without-basePath', // basePath:falseが設定されているので、変更されません
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
        basePath: false,
      },
    ]
  },
}
```

## 国際化をサポートするヘッダー

ヘッダで[国際化サポート](/docs/app-router/building-your-application/routing/internationalization)を利用する場合、ヘッダに `locale: false` を追加しない限り、各 `source` は設定された `locales` を扱うように自動的にプレフィックスされます。`locale: false` を使用する場合は、`source` にロケールのプレフィックスをつけなければ正しくマッチしません。

```js title="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async headers() {
    return [
      {
        source: '/with-locale', // すべてのロケールを自動的に処理します
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // locale: false が設定されているので、ロケールは自動的に処理されません
        source: '/nl/with-locale-manual',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // `en` はデフォルトのロケールのため、これは '/' にマッチします
        source: '/en',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // これは /(en|fr|de)/(.*) に変換されるため、/:path* のようにトップレベルの `/` や `/fr` ルートにはマッチしません。
        source: '/(.*)',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

## キャッシュ制御

ページやアセットに対して、`next.config.js` で `Cache-Control` ヘッダーを設定することはできません。
これらのヘッダは、レスポンスや静的アセットが効果的にキャッシュされるように、運用時に上書きされるためです。

App Router によるキャッシュの詳細については、[こちら](/docs/app-router/building-your-application/caching)をご覧ください。

## オプション

### X-DNS-Prefetch-Control

[このヘッダー](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)は DNS プリフェッチを制御し、ブラウザが外部リンク、画像、CSS、JavaScriptなどのドメイン名解決を積極的に実行できるようにします。
このプリフェッチはバックグラウンドで実行されるため、参照されるアイテムが必要になる頃には [DNS](https://developer.mozilla.org/docs/Glossary/DNS) が解決されている可能性が高くなります。これにより、ユーザーがリンクをクリックする際の待ち時間が短縮されます。

```js
{
  key: 'X-DNS-Prefetch-Control',
  value: 'on'
}
```

### Strict-Transport-Security

[このヘッダー](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security)は、HTTP を使用する代わりに HTTPS でのみアクセスされるべきであることをブラウザに通知します。
以下の設定を使用すると、現在および将来のすべてのサブドメインは、最大 2 年間 HTTPS を使用します。これにより、HTTP でしか提供できないページやサブドメインへのアクセスがブロックされます。

[Vercel](https://vercel.com/docs/concepts/edge-network/headers#strict-transport-security?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) にデプロイする場合は、`next.config.js` で `headers` を宣言しない限り、すべてのデプロイメントに自動的に追加されるので、このヘッダーは必要ありません。

```js
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

### X-Frame-Options

[このヘッダー](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options)は、サイトを iframe 内に表示することを許可するかどうかを示します。
これにより、クリックジャッキング攻撃を防ぐことができます。

**このヘッダーは CSP の `frame-ancestors` オプションに取って代わられ**、最近のブラウザではより良くサポートされています（設定の詳細については[コンテンツセキュリティポリシー](/docs/app-router/building-your-application/configuring/content-security-policy)を参照してください）。

```js
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
}
```

### Permissions-Policy

[このヘッダー](https://developer.mozilla.org/docs/Web/HTTP/Headers/Permissions-Policy)は、ブラウザで使用できる機能や API を制御することができます。以前は `Feature-Policy` という名前でした。

```js
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
}
```

### X-Content-Type-Options

[このヘッダー](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options)は、`Content-Type` ヘッダーが明示的に設定されていない場合に、ブラウザがコンテンツのタイプを推測しようとするのを防ぎます。これにより、ユーザーがファイルをアップロードして共有できるようにするウェブサイトの XSS エクスプロイトを防ぐことができます。

例えば、ユーザーが画像をダウンロードしようとしても、それが実行ファイルのような別の `Content-Type` として扱われ、悪意がある可能性があります。このヘッダーはブラウザの拡張機能をダウンロードする場合にも適用されます。このヘッダーの唯一の有効な値は `nosniff` です。

```js
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

### Referrer-Policy

[このヘッダー](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)は、現在のウェブサイト（オリジン）から別のウェブサイトに移動する際に、ブラウザが含める情報の量を制御します。

```js
{
  key: 'Referrer-Policy',
  value: 'origin-when-cross-origin'
}
```

### Content-Security-Policy

アプリケーションへのコンテンツセキュリティポリシーの追加については、[こちら](/docs/app-router/building-your-application/configuring/content-security-policy)をご覧ください。

## バージョン履歴

| Version   | Changes                      |
| --------- | ---------------------------- |
| `v13.3.0` | `missing` が追加されました。 |
| `v10.2.0` | `has` が追加されました。     |
| `v9.5.0`  | Headers が追加されました。   |
