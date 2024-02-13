---
title: コンテンツセキュリティポリシー
description: Next.js アプリケーションにコンテンツセキュリティポリシー（CSP）を設定する方法を説明します
related:
  links:
    - app-router/building-your-application/routing/middleware
    - app-router/api-reference/functions/headers
---

[コンテンツセキュリティポリシー（CSP）](https://developer.mozilla.org/docs/Web/HTTP/CSP)は、クロスサイトスクリプティング（XSS）、
クリックジャッキング、その他のコードインジェクション攻撃など、さまざまなセキュリティ脅威から Next.js アプリケーションを保護するために重要です。

CSPを使用することで、開発者は、コンテンツソース、スクリプト、スタイルシート、画像、フォント、オブジェクト、メディア（オーディオ、ビデオ）、iframeなどで、
どのオリジンが許容されるかを指定できます。

<details>
  <summary>例</summary>

- [Strict CSP](https://github.com/vercel/next.js/tree/canary/examples/with-strict-csp)

</details>

## Nonces

[nonce](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce) は、一度だけ使用するために作成された、ユニークでランダムな文字列です。
CSP と組み合わせて使用し、厳格な CSP ディレクティブをバイパスして、特定のインラインスクリプトやスタイルの実行を選択的に許可します。

### なぜ nonce を使うのか？

CSP は悪意のあるスクリプトをブロックするように設計されていますが、インラインスクリプトが必要な正当なシナリオも存在します。
そのような場合、nonce は、正しい nonce を持っていればスクリプトの実行を許可する方法を提供します。

### Middleware で nonce を追加する　

[Middleware](/docs/app-router/building-your-application/routing/middleware) を使えば、ページがレンダリングされる前にヘッダーを追加したり、nonce を生成したりすることができます。

ページが表示されるたびに、新しい nonce が生成されなければなりません。つまり、**nonce を追加するには動的レンダリングを使用しなければなりません**。

例えば:

```ts title="middleware.ts"
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

デフォルトでは、Middleware はすべてのリクエストに対して実行されます。Middleware を特定のパスで実行するようにフィルタするには、[matcher](/docs/app-router/building-your-application/routing/middleware#matcher) を使います。

マッチするプリフェッチ（`next/link` から）と CSP ヘッダを必要としない静的アセットを無視することをお勧めします。

```ts title="middleware.ts"
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

### nonce の読み取り

[`headers`](/docs/app-router/api-reference/functions/headers) を使用して [Server Component](/docs/app-router/building-your-application/rendering/server-components) から nonce を読み取ることができます:

```tsx title="app/page.tsx"
import { headers } from 'next/headers'
import Script from 'next/script'

export default function Page() {
  const nonce = headers().get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

## Nonces なし

nonce を必要としないアプリケーションでは、[`next.config.js`](/docs/app-router/api-reference/next-config-js) ファイルで CSP ヘッダーを直接設定できます:

```js title="next.config.js"
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

## バージョン履歴

nonce を適切に処理および適用するには、Next.js の `v13.4.20` 以上を使用することを推奨します。
