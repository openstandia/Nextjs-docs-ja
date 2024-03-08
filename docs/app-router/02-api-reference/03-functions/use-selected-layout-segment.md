---
title: useSelectedLayoutSegment
description: useSelectedLayoutSegment フックのAPIリファレンス。
---

`useSelectedLayoutSegment`は**Client Component**のフックであり、呼び出されたレイアウトの**1 階層下**のアクティブなルート Segment を読み取ることができます。

これは、アクティブな子 Segment に応じてスタイルが変化するような、親レイアウト内のタブなどのナビゲーション UI を作成するのに役立ちます。

```tsx title="app/example-client-component.tsx"
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>Active segment: {segment}</p>
}
```

> **Good to know**:
>
> - `useSelectedLayoutSegment`は[Client Component](/docs/app-router/building-your-application/rendering/client-components)のフックであり、レイアウトはデフォルトで[Server Components](/docs/app-router/building-your-application/rendering/server-components)であるため、`useSelectedLayoutSegment`は通常、レイアウトにインポートされた Client Component から呼び出されます。
> - `useSelectedLayoutSegment` は、1 階層下の Segment のみを返します。全てのアクティブな Segments を返すには、[`useSelectedLayoutSegments`](/docs/app-router/api-reference/functions/use-selected-layout-segments) を参照してください。

## Parameters

```tsx
const segment = useSelectedLayoutSegment(parallelRoutesKey?: string)
```

`useSelectedLayoutSegment`は*オプション*で[`parallelRoutesKey`](/docs/app-router/building-your-application/routing/parallel-routes#useselectedlayoutsegments)を受け取り、そのスロット内のアクティブなルート Segment を読み取ることができます。

## Returns

`useSelectedLayoutSegment`はアクティブな Segment の文字列を返します。存在しない場合は`null`を返します。

例えば、以下のレイアウトと URL が与えられた場合、返される Segment は次のとおりになります。

| Layout                    | Visited URL                    | Returned Segment |
| ------------------------- | ------------------------------ | ---------------- |
| `app/layout.js`           | `/`                            | `null`           |
| `app/layout.js`           | `/dashboard`                   | `'dashboard'`    |
| `app/dashboard/layout.js` | `/dashboard`                   | `null`           |
| `app/dashboard/layout.js` | `/dashboard/settings`          | `'settings'`     |
| `app/dashboard/layout.js` | `/dashboard/analytics`         | `'analytics'`    |
| `app/dashboard/layout.js` | `/dashboard/analytics/monthly` | `'analytics'`    |

## 例

### active link component の作成

`useSelectedLayoutSegment`を使用すると、アクティブな Segment に応じてスタイルを変更可能な、active link component を作成できます。例えば、ブログのサイドバーの特集記事リストです。

```tsx title="app/blog/blog-nav-link.tsx"
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

// この client componentは、app/blog/layout.tsxにインポートされます。
export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  // /blog/hello-world`に遷移すると、'hello-world'が返されます。
  // 選択されたレイアウトSegment
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // リンクがアクティブかどうかに応じてスタイルを変更する。
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```tsx title="app/blog/layout.tsx"
// Client Componentを親レイアウト(Server Component)にインポートする。
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

## Version 履歴

| Version   | Changes                         |
| --------- | ------------------------------- |
| `v13.0.0` | `useSelectedLayoutSegment` 導入 |
