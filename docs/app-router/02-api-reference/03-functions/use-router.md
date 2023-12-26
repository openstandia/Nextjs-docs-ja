---
title: useRouter
description: API reference for the useRouter hook.
---

`useRouter`フックは、[Client Component](/docs/app-router/building-your-application/rendering/client-components)内でプログラム的にルートを変更できます。

> **推奨:** `useRouter`を使用する特別な要件がない限り、ナビゲーションには[`<Link>`コンポーネント](/docs/app-router/building-your-application/routing/linking-and-navigating#link-コンポーネント)を使用してください。

```tsx title="app/example-client-component.tsx"
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

## `useRouter()`

- `router.push(href: string, { scroll: boolean })`: 指定されたルートへクライアントサイドナビゲーションを実行します。[ブラウザの履歴スタック](https://developer.mozilla.org/en-US/docs/Web/API/History_API)に新しいエントリーを追加します。
- `router.replace(href: string, { scroll: boolean })`: 提供されたルートへクライアントサイドナビゲーションを実行しますが、[ブラウザの履歴スタック](https://developer.mozilla.org/en-US/docs/Web/API/History_API)に新しいエントリーは追加しません。
- `router.refresh()`: 現在のルートを更新します。サーバーに新しいリクエストを行い、データリクエストを再取得し、Server Component を再レンダリングします。クライアントは、更新された React Server Component のペイロードを、影響を受けないクライアント側の React（`useState`など）やブラウザの状態（スクロール位置など）を保持したままマージします。
- `router.prefetch(href: string)`: 提供されたルートを[プリフェッチ](/docs/app-router/building-your-application/routing/linking-and-navigating#プリフェッチ)して、クライアント側の遷移を高速化します。
- `router.back()`: ブラウザの履歴スタックで一つ前のページに遷移する。
- `router.forward()`: ブラウザの履歴スタックで次のページに遷移する。

> **Good to know**:
>
> - ビューポート内に`<Link>`コンポーネントが表示されると、自動的にリンク先のページをプリフェッチします。
> - `refresh()`は、フェッチリクエストがキャッシュされている場合、同じレスポンスを再生成することができます。しかし、`cookies`や`headers`のような他の動的関数がレスポンスに変更をもたらす可能性があります。

### Migrating from `next/router`

- App Router を使用する場合は、`next/router`ではなく`next/navigation`から`useRouter`フックをインポートする必要があります。
- `pathname`文字列は削除され、[`usePathname()`](/docs/app-router/api-reference/functions/use-pathname)に置き換えられました。
- `query`オブジェクトは削除され、[`useSearchParams()`](/docs/app-router/api-reference/functions/use-search-params) に置き換えられました。
- `router.events`は置き換えられました。[以下を参照](#router-events)。

[完全な移行ガイドを見る](/docs/app-router/building-your-application/upgrading/app-router-migration).

## 例

### Router events

`usePathname`や`useSearchParams`のような他の Client Component のフックを組み合わせることで、ページの変更を検知することができます。

```jsx title="app/components/navigation-events.js"
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(url)
    // 現在のURLを利用できます
    // ...
  }, [pathname, searchParams])

  return null
}
```

レイアウトにインポートできます。

```jsx title="app/layout.js" highlight={2,10-12}
import { Suspense } from 'react'
import { NavigationEvents } from './components/navigation-events'

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  )
}
```

> **Good to know**: `<NavigationEvents>`は[`サスペンス`境界(Suspense boundary)](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#example)でラップされます。静的レンダリング中に`useSearchParams()`を実行すると、最も近い`サスペンス`境界(Suspense boundary)までクライアント側でレンダリングを引き起こすためです。[詳細はこちら](/docs/app-router/api-reference/functions/use-search-params)。

デフォルトでは、Next.js は新しいルートに遷移するときにページの一番上にスクロールします。この動作を無効にするには、`scroll: false`を`router.push()`または`router.replace()`に渡します。

```tsx title="app/example-client-component.tsx"
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}
```

## Version 履歴

| Version   | Changes                                |
| --------- | -------------------------------------- |
| `v13.0.0` | `next/navigation`から`useRouter`を導入 |
