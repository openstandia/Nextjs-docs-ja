---
title: Middleware
description: Learn how to use Middleware to run code before a request is completed.
---

Middleware を使うと、リクエストが完了する前にコードを実行できる。そして、送られてきたリクエストに基づいて、レスポンスを書き換えたり、リダイレクトしたり、リクエストやレスポンスのヘッダーを変更したり、直接レスポンスしたりすることで、レスポンスを変更できる。

Middleware はキャッシュされたコンテンツとルートがマッチングされる前に実行されます。詳細は[パスのマッチング](#マッチングパス)を参照してください。

## 規約

Middleware を定義するには、プロジェクトのルートにある `middleware.ts` (または `.js`) ファイルを使用する。例えば、`pages` や `app` と同じ階層、または必要に応じて `src` 内に置く。

## Example

```ts filename="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}
```

## マッチングパス

Middleware は**プロジェクト内のすべてのルート**に対して呼び出されます。実行順序は以下のとおりです：

1. `next.config.js`の`headers`。
2. `next.config.js`の`redirects`。
3. Middleware（`rewrites`、`redirects` など）
4. `beforeFiles` (`rewrites`) from `next.config.js`.
5. ファイルシステムのルート（`public/`、`_next/static/`、`pages/`、`app/` など）
6. `afterFiles` (`rewrites`) from `next.config.js`.
7. 動的ルート (`/blog/[slug]`)
8. `next.config.js`の`fallback` (`rewrites`)

Middleware を実行するパスを定義する方法は 2 つある：

1. [カスタムマッチャー設定](#マッチャー)
2. [条件文](#条件文)

### マッチャー

`matcher`を使用すると、特定のパスで実行する Middleware をフィルタリングできる。

```js filename="middleware.js"
export const config = {
  matcher: '/about/:path*',
}
```

配列構文で、単一のパスまたは複数のパスにマッチさせることができる。

```js filename="middleware.js"
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

`matcher`の設定は完全な正規表現を許すので、負のルックアヘッドや文字マッチのようなマッチングがサポートされる。特定のパス以外をマッチさせる負のルックヘッドの例をここで見ることができる。

```js filename="middleware.js"
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

> **Note**: `matcher`の値は、ビルド時に静的に解析できるように定数である必要がある。変数のような動的な値は無視される。

設定されたマッチャー

1. `/`で始まらなければならない。
2. 名前付きパラメータを含むことができる：`about/:path`は `/about/a` と `/about/b` にマッチするが、 `/about/a/c` にはマッチしない。
3. （`:`で始まる）名前付きパラメータに修飾子をつけることができる： about/:path\*`は `/about/a/b/c` にマッチします。?`はゼロか 1 つ、`+`は 1 つ以上です。
4. 括弧で囲まれた正規表現が使える： `/about/(.*)` は `/about/:path*` と同じ。

詳細は[path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1)を参照してください。

> **Note**: 後方互換性のため、Next.js は常に `/public` を `/public/index` とみなします。したがって、`/public/:path` のマッチャーはマッチします。

### 条件文

```ts filename="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

## NextResponse

`NextResponse` API を使うと、以下のことができる。

- リクエストを別の URL に `redirect` する。
- 指定した URL を表示してレスポンスを `rewrite` する。
- API Routes、`getServerSideProps` および `rewrite` 先のリクエストヘッダを設定する。
- レスポンスクッキーを設定する
- レスポンスヘッダの設定

Middleware からレスポンスを生成するには、次のようにする。

1. レスポンスを生成するルート [Page](/docs/app-router/building-your-application/routing/pages-and-layouts) または [Edge API Route](/docs/app-router/building-your-application/routing/route-handlers) に `rewrite` する。
2. `NextResponse` を直接返す。[レスポンスの生成](#response-の作成)を参照してください。

## Cookie の利用

クッキーは通常のヘッダーである。`リクエスト`では `Cookie` ヘッダに格納される。レスポンスでは `Set-Cookie` ヘッダに格納される。Next.js は `NextRequest` と `NextResponse` の `cookies` 拡張機能を通して、これらのクッキーにアクセスし、操作する便利な方法を提供します。

1. `get`, `getAll`, `set`, `delete` のメソッドが用意されている。`has`でクッキーの存在を確認したり、`clear`ですべてのクッキーを削除したりできる。
2. 送信レスポンスでは、`cookies` は `get`、`getAll`、`set`、`delete` メソッドを持っている。

```ts filename="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('nextjs')?.value
  console.log(cookie) // => 'fast'
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

  return response
}
```

## Headers の設定

リクエストヘッダとレスポンスヘッダは `NextResponse` API を使って設定できます（*request*ヘッダの設定は Next.js v13.0.0 から）

```ts filename="middleware.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })

  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

> **Note**: バックエンドのウェブサーバーの設定によっては、[431 Request Header Fields Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431)エラーを引き起こす可能性があるため、大きなヘッダーの設定は避けてください。

## Response の作成

`Response`インスタンスまたは `NextResponse` インスタンスを返すことで、Middleware から直接レスポンスを返すことができます。（これは[Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware)から利用できます）

```ts filename="middleware.ts" switcher
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return new NextResponse(
      JSON.stringify({ success: false, message: 'authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}
```

## 高度な Middleware フラグ

Next.js の `v13.1` では、Middleware に 2 つの追加フラグが導入されました。 `skipMiddlewareUrlNormalize` と `skipTrailingSlashRedirect` です。

`skipTrailingSlashRedirect`は、Next.js のデフォルトのリダイレクトを無効にして、末尾のスラッシュを追加したり削除したりできます。これにより、Middleware 内部でカスタムの処理を行うことができるようになり、一部のパスでは末尾のスラッシュを維持し、他のパスでは維持しないようにできます。

```js filename="next.config.js"
module.exports = {
  skipTrailingSlashRedirect: true,
}
```

```js filename="middleware.js"
const legacyPrefixes = ['/docs', '/blog']

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // apply trailing slash handling
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    req.nextUrl.pathname += '/'
    return NextResponse.redirect(req.nextUrl)
  }
}
```

`skipMiddlewareUrlNormalize`は、Next.js が行う URL 正規化を無効にし、直接訪問とクライアント遷移の処理を同じにします。元の URL を使って完全に制御する必要がある高度なケースもありますが、そのような場合はこの機能を利用できます。

```js filename="next.config.js"
module.exports = {
  skipMiddlewareUrlNormalize: true,
}
```

```js filename="middleware.js"
export default async function middleware(req) {
  const { pathname } = req.nextUrl

  // GET /_next/data/build-id/hello.json

  console.log(pathname)
  // with the flag this now /_next/data/build-id/hello.json
  // without the flag this would be normalized to /hello
}
```

## Version History

| Version   | Changes                                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `v13.1.0` | 高度な Middleware フラグの追加                                                                                                     |
| `v13.0.0` | Middleware はリクエストヘッダ、レスポンスヘッダを変更し、レスポンスを送信できる                                                    |
| `v12.2.0` | Middleware は安定しています。[アップグレードガイド](https://nextjs.org/docs/messages/middleware-upgrade-guide)を参照してください。 |
| `v12.0.9` | Edge ランタイムで URL の絶対指定が強制されるようになりました([PR](https://github.com/vercel/next.js/pull/33410))                   |
| `v12.0.0` | Middleware（ベータ版）を追加しました                                                                                               |
