---
title: リダイレクト
description: Next.js でリダイレクトを操作するさまざまな方法を学びます。
related:
  links:
    - app-router/api-reference/functions/redirect
    - app-router/api-reference/functions/permanentRedirect
    - app-router/building-your-application/routing/middleware
    - app-router/api-reference/next-config-js/redirects
---

Next.js でリダイレクトを操作するには、いくつかの方法があります。このページでは、それぞれのオプション、使用例、大量のリダイレクトの管理方法について詳しく説明します。

| API                                                              | 目的                                                     | 使用場所                                          | ステータスコード                         |
| :--------------------------------------------------------------- | :------------------------------------------------------- | :------------------------------------------------ | :--------------------------------------- |
| [`redirect`](#redirect-関数)                                     | ミューテーションやイベント後にユーザーをリダイレクトする | Server Components, Server Actions, Route Handlers | 307 (一時的) または 303 (Server Actions) |
| [`permanentRedirect`](#permanentredirect-関数)                   | ミューテーションやイベント後にユーザーをリダイレクトする | Server Components, Server Actions, Route Handlers | 308 (永久的)                             |
| [`useRouter`](#userouter-フック)                                 | クライアントサイドのナビゲーションを実行する             | Client Components のイベントハンドラ              | N/A                                      |
| [`redirects` in `next.config.js`](#nextconfigjs-内の-redirects)  | パスに基づいてリクエストをリダイレクトする               | `next.config.js` ファイル                         | 307 (一時的) または 308 (永久的)         |
| [`NextResponse.redirect`](#middleware-内の-nextresponseredirect) | 条件に基づいてリクエストをリダイレクトする               | Middleware                                        | 任意                                     |

## `redirect` 関数

<!-- TODO: fix link -->

`redirect` 関数を使用すると、ユーザーを別の URL にリダイレクトできます。[Server Components](/docs/app-router/building-your-application/rendering/server-components), [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers), [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)で `redirect` を呼び出すことができます。

`redirect` は、ミューテーションやイベントの後によく使用されます。例えば、投稿の作成する場合には以下のようになります。

```tsx title="app/actions.tsx"
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id: string) {
  try {
    // データベースを呼び出す
  } catch (error) {
    // エラーを処理する
  }

  revalidatePath('/posts') // キャッシュされた投稿を更新する
  redirect(`/post/${id}`) // 新しい投稿ページに遷移する
}
```

> **Good to know**:
>
> - `redirect` はデフォルトで 307 (一時リダイレクト) ステータスコードを返します。Server Actions で使用されると、303 (他を参照)を返します。303 は、POSTリクエストの結果として成功ページへリダイレクトするときに一般的に使用されます。
> - `redirect` は内部でエラーをスローするので、`try/catch` ブロックの外で呼び出すべきです。
> - `redirect` は、レンダリングプロセス中に Client Components で呼び出すことができますが、イベントハンドラでは呼び出すことができません。代わりに [`useRouter` フック](#userouter-フック)を使用できます。
> - `redirect` は絶対 URL も受け入れ、外部リンクへのリダイレクトに使用できます。
> - レンダリングプロセスの前にリダイレクトしたい場合は、[`next.config.js`](#nextconfigjs-内の-redirects) または [Middleware](#middleware-内の-nextresponseredirect) を使用してください。

詳細は [`redirect` API リファレンス](/docs/app-router/api-reference/functions/redirect)を参照してください。

## `permanentRedirect` 関数

<!-- TODO: fix link -->

`permanentRedirect` 関数を使用すると、ユーザーを**永久的に**別の URL にリダイレクトできます。[Server Components](/docs/app-router/building-your-application/rendering/server-components), [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers), [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)で `permanentRedirect` を呼び出すことができます。

`permanentRedirect` は、エンティティの正規 URL を変更するミューテーションやイベントの後によく使用されます。例えば、ユーザーが自分のユーザーネームを変更した後のユーザープロフィールの URL を更新する場合などです:

```tsx title="app/actions.ts"
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username: string, formData: FormData) {
  try {
    // データベースを呼び出す
  } catch (error) {
    // エラーを処理する
  }

  revalidateTag('username') // ユーザーネームへのすべての参照を更新する
  permanentRedirect(`/profile/${username}`) // 新しいユーザープロフィールに遷移する
}
```

> **Good to know**:
>
> - `permanentRedirect` はデフォルトで 308 (永久リダイレクト) ステータスコードを返します。
> - `permanentRedirect` は絶対 URL を引数に取り、外部リンクへのリダイレクトにも使用できます。
> - レンダリングプロセスの前にリダイレクトしたい場合は、[`next.config.js`](#nextconfigjs-内の-redirects) または [Middleware](#middleware-内の-nextresponseredirect) を使用してください。

詳細は[`permanentRedirect` API リファレンス](/docs/app-router/api-reference/functions/permanentRedirect)を参照してください。

## `useRouter()` フック

Client Components のイベントハンドラ内でリダイレクトが必要な場合は、`useRouter` フックから `push` メソッドを使用できます。例えば:

```tsx title="app/page.tsx"
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

> **Good to know**:
>
> - プログラムによるユーザーのナビゲーションが必要ない場合は、[`<Link>`](/docs/app-router/api-reference/components/link) コンポーネントを使用してください。

詳細は [`useRouter` API リファレンス](/docs/app-router/api-reference/functions/use-router)を参照してください。

## `next.config.js` 内の `redirects`

`next.config.js` ファイルの `redirects` オプションを使用すると、受信したリクエストのパスを別のパスにリダイレクトできます。これは、ページの URL 構造を変更したり、事前にリダイレクトのリストが分かっている場合に便利です。

<!-- TODO: fix link -->

`redirects`は、[path](/docs/app-router/api-reference/next-config-js/redirects#path-matching), [header、cookie、query のマッチング](/docs/app-router/api-reference/next-config-js/redirects#header-cookie-and-query-matching)をサポートしており、リクエストに基づいてユーザーをリダイレクトする柔軟性を提供します。

`redirects` を使用するには、`next.config.js` ファイルにオプションを追加します:

```js title="next.config.js"
module.exports = {
  async redirects() {
    return [
      // 基本的なリダイレクト
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // ワイルドカードを使用したパスマッチング
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}
```

詳細は [`redirects` API reference](/docs/app-router/api-reference/next-config-js/redirects)を参照してください。

> **Good to know**:
>
> - `redirects` は、`permanent` オプションを使用して 307 (一時的なリダイレクト) または 308 (永久的なリダイレクト) のステータスコードを返すことができます。
> - `redirects` は、プラットフォームによっては制限があるかもしれません。例えば、Vercel では、リダイレクトの制限は 1,024 回です。大量のリダイレクト (1,000以上) を管理するには、[Middleware](/docs/app-router/building-your-application/routing/middleware) を使用したカスタムのソリューションを作成することを検討してください。詳細は[規模に応じたリダイレクトの管理](#規模に応じたリダイレクトの管理高度) を参照してください。
> - `redirects` は Middleware の前に実行されます。

## Middleware 内の `NextResponse.redirect`

Middleware を使用すると、リクエストが完了する前にコードを実行できます。その後、着信リクエストに基づいて、`NextResponse.redirect`を使用して異なる URL にリダイレクトします。これは、条件（例えば、認証、セッション管理など）に基づいてユーザーをリダイレクトしたい場合や、[多数のリダイレクトがある場合](#規模に応じたリダイレクトの管理高度)に便利です。

例えば、ユーザーが認証されていない場合に `/login` ページへリダイレクトするには:

```tsx title="middleware.ts"
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // ユーザーが認証されていれば、通常通り続行
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // 認証されていない場合は、ログインページにリダイレクト
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

> **Good to know**:
>
> - Middleware は、`next.config.js` の `redirects` の**後**、レンダリングの**前**に実行されます。

詳細情報は [Middleware](/docs/app-router/building-your-application/routing/middleware) のドキュメントを参照してください。

## 規模に応じたリダイレクトの管理（高度）

大量のリダイレクト（1,000以上）を管理するためには、Middleware を使用してカスタムのソリューションを作成することを検討するかもしれません。これにより、アプリケーションを再デプロイすることなくリダイレクトをプログラム的に処理できます。

これを実現するためには、以下のことを考慮する必要があります:

1. リダイレクトマップの作成と保存
2. データルックアップ・パフォーマンスの最適化

> **Next.js の例**: 以下の推奨事項の実装例として、[Middleware とブルームフィルター](https://redirects-bloom-filter.vercel.app/)の例を参照してください。

### 1. リダイレクトマップの作成と保存

リダイレクトマップは、リダイレクトのリストで、データベース（通常はキー・バリューストア）や JSON ファイルに保存できます。

以下のデータ構造を考えてみてください:

```json
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```

[Middleware](/docs/app-router/building-your-application/routing/middleware) では、Vercelの [Edge Config](https://vercel.com/docs/storage/edge-config/get-started)や [Redis](https://vercel.com/docs/storage/vercel-kv) などのデータベースから読み取り、受け取ったリクエストに基づいてユーザーをリダイレクトできます:

```tsx title="middleware.ts"
import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // リダイレクトが見つからない場合、リダイレクトせずに続行する
  return NextResponse.next()
}
```

### 2. データルックアップ・パフォーマンスの最適化

すべての受け取ったリクエストに対して大量のデータセットを読み取ることは遅く、コストがかかります。データルックアップ・パフォーマンスを最適化する方法は2つあります:

- 高速な読み取りが可能なデータベースを使用する、例えば [Vercel Edge Config](https://vercel.com/docs/storage/edge-config/get-started) や [Redis](https://vercel.com/docs/storage/vercel-kv)。
- データベースまたは大きなリダイレクトファイルを読み取る**前**にリダイレクトが存在するかどうかを効率的にチェックするためのデータルックアップ戦略、例えば [ブルームフィルター](https://en.wikipedia.org/wiki/Bloom_filter) を使用する。

上記の例を考慮に入れつつ、生成されたブルームフィルターファイルを Middleware にインポートし、受け取ったリクエストの pathname がブルームフィルターに存在するかをチェックします。

もし存在する場合は、リクエストを実際のファイルをチェックする [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) に転送し、ユーザーを適切な URL にリダイレクトします。これにより、大量のリダイレクトファイルを Middleware にインポートすることがなく、すべての受け取ったリクエストが遅くなることを回避できます。

```tsx title="middleware.ts"
import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

// JSON ファイルからブルームフィルタを初期化する
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)

export async function middleware(request: NextRequest) {
  // 受信したリクエストのパスを取得
  const pathname = request.nextUrl.pathname

  // パスがブルームフィルタに存在するかどうかを確認
  if (bloomFilter.has(pathname)) {
    // パス名を Route Handler に転送する
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )

    try {
      // Route Handler からリダイレクトデータを取得する
      const redirectData = await fetch(api)

      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json()

        if (redirectEntry) {
          // ステータスコードを決定する
          const statusCode = redirectEntry.permanent ? 308 : 307

          // 宛先にリダイレクトする
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // リダイレクトが見つからない場合、リダイレクトせずにリクエストを続行する
  return NextResponse.next()
}
```

次に、 Route Handler 内でで以下のように実装します:

```tsx title="app/redirects/route.ts"
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }

  // redirects.json ファイルからリダイレクトエントリを取得する
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]

  // ブルームフィルタの偽陽性を考慮する
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  // リダイレクトエントリを返す
  return NextResponse.json(redirect)
}
```

**Good to know:**

- ブルームフィルタを生成するためには、[`bloom-filters`](https://www.npmjs.com/package/bloom-filters)のようなライブラリを使用できます。
- Route Handler へのリクエストを検証して、悪意のあるリクエストを防止するべきです。
