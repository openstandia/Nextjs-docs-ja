---
title: middleware.js
description: middleware.js ファイルのAPIリファレンスです。
related:
  title: ミドルウェアについてさらに学ぶ
  links:
    - app-router/building-your-application/routing/middleware
sidebar_position: 6
---

`middleware.js|ts` ファイルは [Middleware](/docs/app-router/building-your-application/routing/middleware) を記述し、リクエストが完了する前にサーバー上でコードを実行するために使用されます。次にリクエストに基づいて、リライト、リダイレクト、リクエストまたはレスポンスヘッダーの変更、または直接返信することにより、レスポンスを変更できます。

Middleware はルートがレンダリングされる前に実行されます。認証、ログ記録、リダイレクトの処理など、カスタムのサーバーサイドロジックを実装するのに特に便利です。

プロジェクトのルートにある `middleware.ts`（または .js）ファイルを使用してMiddlewareを定義します。例えば、`app` や `pages` と同じレベル、または該当する場合は `src` 内に配置します。

```tsx title="middleware.ts"
import { NextResponse, NextRequest } from 'next/server'

// この関数は中で `await` を使用する場合 `async` としてマークできます
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

## エクスポート

### Middleware 関数

ファイルは、デフォルトエクスポートまたは `middleware` として名付けられた単一の関数をエクスポートする必要があります。同じファイルで複数の Middleware はサポートされていません。

```js title="middleware.js"
// デフォルトエクスポートの例
export default function middleware(request) {
  // ミドルウェアロジック
}
```

### 設定オブジェクト（任意）

任意で Middleware 関数と一緒に設定オブジェクトをエクスポートできます。このオブジェクトには、Middleware が適用されるパスを指定する [matcher](#matcher) が含まれます。

#### Matcher

`matcher` オプションでは、Middleware を実行する特定のパスをターゲットにできます。これらのパスは以下の方法で指定できます:

- 単一のパスの場合: 直接文字列を使用してパスを定義します。例えば `'/about'` のように定義します。
- 複数パスの場合: 配列を使用して複数のパスをリストします。例えば `matcher: ['/about', '/contact']` は `/about` と `/contact` の両方に Middleware を適用します。

さらに、`matcher` は正規表現を通じて複雑なパス指定をサポートしています。例えば `matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']` のように、どのパスを含めるかまたは除外するかを正確に制御できます。

`matcher` オプションは、次のキーを持つオブジェクトの配列も受け入れます:

- `source`: リクエストパスのマッチに使われるパスまたはパターン。直接パスをマッチさせる場合は文字列、より複雑なマッチングの場合はパターンになります。
- `regexp`（任意）: `source` に基づいて一致を微調整する正規表現の文字列。どのパスを含め、除外するかについて追加の制御を提供します。
- `locale`（任意）: `false` に設定した場合、パスのマッチングでロケールベースのルーティングを無視します。
- `has`（任意）: ヘッダー、クエリパラメータ、またはクッキーなど、特定のリクエスト要素の存在に基づいて条件を指定します。
- `missing`（任意）: ヘッダーやクッキーが欠けているなど、特定のリクエスト要素が不足している条件に焦点を当てます。

```js title="middleware.js"
export const config = {
  matcher: [
    {
      source: '/api/*',
      regexp: '^/api/(.*)',
      locale: false,
      has: [
        { type: 'header', key: 'Authorization', value: 'Bearer Token' },
        { type: 'query', key: 'userId', value: '123' },
      ],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
```

## パラメーター

### `request`

Middleware を定義する際に、デフォルトエクスポート関数は `request` という単一のパラメータを受け入れます。このパラメータは `NextRequest` のインスタンスであり、HTTP リクエストを表します。

```tsx title="middleware.ts"
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ミドルウェアロジックはここに記述します
}
```

> **Good to know**:
>
> - `NextRequest` は Next.js ミドルウェアでHTTP リクエストを表す型であり、[`NextResponse`](#nextresponse) は HTTP レスポンスを操作して返送するために使用されるクラスです。

## NextResponse

Middleware は [`NextResponse`](/docs/app-router/building-your-application/routing/middleware#nextresponse) オブジェクトを使用でき、これは [Web Response API](https://developer.mozilla.org/en-US/docs/Web/API/Response) を拡張したものです。`NextResponse` オブジェクトを返すことで、直接クッキーを操作したり、ヘッダーを設定したり、リダイレクトやパスの書き換えを実装したりできます。

> **Good to know**: リダイレクトには `Response.redirect` を `NextResponse.redirect` の代わりに使用することもできます。

## Runtime

Middlewareは [Edge ランタイム](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes) のみをサポートしています。Node.js ランタイムは使用できません。

## バージョン履歴

| バージョン | 変更点                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `v13.1.0`  | 高度な Middleware フラグ追加                                                                                               |
| `v13.0.0`  | Middleware はリクエストヘッダー、レスポンスヘッダーを変更したレスポンスの送信に対応                                        |
| `v12.2.0`  | Middleware 安定版のリリース。詳細は[アップグレードガイド](https://nextjs.org/docs/messages/middleware-upgrade-guide)を参照 |
| `v12.0.9`  | Edge ランタイムで絶対 URL を強制するように変更 ([PR](https://github.com/vercel/next.js/pull/33410))                        |
| `v12.0.0`  | Middleware（ベータ）追加                                                                                                   |

## ミドルウェアについてさらに学ぶ
[Middleware](/docs/app-router/building-your-application/routing/middleware)