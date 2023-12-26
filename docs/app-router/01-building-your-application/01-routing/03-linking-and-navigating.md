---
title: リンクとナビゲート
description: Learn how navigation works in Next.js, and how to use the Link Component and `useRouter` hook.
---

Next.js の Router は[サーバー中心ルーティング](/docs/app-router/building-your-application/routing#server-centric-routing-with-client-side-navigation)と[クライアントサイドナビゲーション](#ナビゲーションの仕組み)を使用しています。また[インスタントロード状態](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)と[同時レンダリング](https://ja.react.dev/reference/react/startTransition)をサポートしています。これはナビゲーションがクライアントサイドの状態を維持し、高価な再レンダリングを避け、中断可能で、競合状態を引き起こさないことを意味します。

ルート間のナビゲーションには 2 つの方法があります：

- [`<Link>`コンポーネント](#link-コンポーネント)
- [`useRouter` フック](#userouter-hook)

このページでは `<Link>` と `useRouter()` の使い方を説明し、ナビゲーションの仕組みについて深く掘り下げていきます。

## `<Link>` コンポーネント

`<Link>` は HTML の `<a>` 要素を拡張した React コンポーネントで、[プリフェッチ](#プリフェッチ) とルート間のクライアントサイドナビゲーションを提供します。Next.js でルート間をナビゲートする主要な方法です。

`<Link>` を使うには、`next/link` からインポートし、`href` プロパティをコンポーネントに渡します。

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

`<Link>`に渡すことができるオプションについて詳しくは[API リファレンス](/docs/app-router/api-reference/components/link)を参照してください。

## Examples

### 動的 Segment へのリンク

[動的セグメント](/docs/app-router/building-your-application/routing/dynamic-routes)にリンクするとき、リンクのリストを生成するために[テンプレートリテラルと補間](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)を使うことができます。例えば、ブログ記事のリストを生成するには、次のようにします。

```jsx filename="app/blog/PostList.jsx"
import Link from 'next/link'

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### アクティブなリンクのチェック

リンクがアクティブかどうかを判断するには、[`usePathname()`](/docs/app-router/api-reference/functions/use-pathname)を使うことができます。例えば、アクティブなリンクにクラスを追加するには、現在の `pathname` がリンクの `href` と一致するかどうかをチェックします：

```jsx filename="app/ui/Navigation.jsx"
'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next/link'

export function Navigation({ navLinks }) {
  const pathname = usePathname()

  return (
    <>
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href)

        return (
          <Link
            className={isActive ? 'text-blue' : 'text-black'}
            href={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        )
      })}
    </>
  )
}
```

### `ID` へのスクロール

`<Link>`のデフォルトの動作は、[変更されたルートセグメントの先頭にスクロールする](#フォーカスおよびスクロールの管理)です。`href` に `id` が定義されている場合、通常の `<a>` タグと同様に、特定の `id` までスクロールします。

ルート Segment の先頭までスクロールしないようにするには、`scroll={false}` を設定して `href` にハッシュ化された `id` を追加します：

```jsx
<Link href="/#hashid" scroll={false}>
  Scroll to specific id.
</Link>
```

## `useRouter()` Hook

`useRouter` フックを使うと、[クライアントコンポーネント](/docs/app-router/building-your-application/rendering/client-components) 内のルートをプログラムで変更できます。

`useRouter` を使用するには、`next/navigation` からインポートし、Client Component 内でフックを呼び出します：

```jsx filename="app/page.jsx"
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

`useRouter` は `push()` や `refresh()` などのメソッドを提供する。詳細は[API リファレンス](/docs/app-router/api-reference/functions/use-router)を参照してください。

> **推奨:** `useRouter`を使用する特別な要件がない限り、ルート間を移動するには`<Link>`コンポーネントを使用してください。

## ナビゲーションの仕組み

- ルート遷移は `<Link>` を使うか、`router.push()` を呼び出すことで開始されます。
- Router はブラウザのアドレスバーの URL を更新します。
- Router は[クライアントサイドキャッシュ](#レンダリングされた-server-component-のクライアント側キャッシュ)から変更されていない Segment(共有レイアウトなど）を再利用することで、不要な作業を回避します。これは[部分レンダリング](/docs/app-router/building-your-application/routing#partial-rendering)とも呼ばれます。
- [ソフトナビゲーションの条件](#ソフトナビゲーション)が満たされていれば、Router は新しい Segment をサーバーではなくキャッシュから取得します。そうでない場合、Router は[ハードナビゲーション](#ハードナビゲーション)を実行し、サーバーから Server Component のペイロードをフェッチします。
- 作成された場合、ペイロードがフェッチされている間、サーバーから[loading UI](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)が表示されます。
- Router はキャッシュされた、もしくは新しいペイロードを使用して、クライアント上で新しい Segment をレンダリングします。

### レンダリングされた Server Component のクライアント側キャッシュ

> **Good to know:**このクライアント側キャッシュは、サーバー側の[Next.js HTTP キャッシュ](/docs/app-router/building-your-application/data-fetching#caching-data)とは異なります。

新しい Router には、Server Component の**レンダリング結果**（ペイロード）を保存する**インメモリクライアントサイドキャッシュ**があります。キャッシュはルート Segment によって分割され、任意のレベルで無効化でき、同時レンダリング間の一貫性を保証します。

ユーザーがアプリをナビゲートすると、Router は以前にフェッチした Segment のペイロード**と** [プリフェッチ](#プリフェッチ) Segment をキャッシュに保存します。

つまり、特定のケースでは、Router はサーバーに新たにリクエストする代わりにキャッシュを再利用できます。これにより、不必要にデータを再フェッチしたりコンポーネントを再レンダリングしたりすることがなくなり、パフォーマンスが向上します。

### プリフェッチ

プリフェッチはルートが訪問される前にバックグラウンドでプリロードする方法です。プリフェッチされたルートのレンダリング結果は Router のクライアントサイドキャッシュに追加されます。これにより、プリフェッチされたルートへのナビゲートがほぼ瞬時になります。

デフォルトでは、ルートは `<Link>` コンポーネントを使用しているときにビューポートに表示されるようになるとプリフェッチされます。これはページが最初にロードされたときか、スクロールによって起こります。また[`useRouter()`フック](/docs/app-router/api-reference/functions/use-router#userouter)の`prefetch`メソッドを使用して、ルーティングをプログラムでプリフェッチすることもできます。

**静的ルートと動的ルート**：

- ルートが静的な場合、ルート Segment のすべての Server Component のペイロードはプリフェッチされます。
- ルートが動的な場合、最初の共有レイアウトから最初の `loading.js` ファイルまでのペイロードがプリフェッチされます。これはルート全体を動的にプリフェッチするコストを削減し、動的なルートに対して[instant loading states](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#インスタントロード状態)を可能にします。

> **Good to know:**
>
> - プリフェッチは本番環境でのみ有効です。
> - プリフェッチは `<Link>` に `prefetch={false}` を渡すことで無効にできます。

### ソフト・ナビゲーション

ナビゲーションの際、変更された Segment のキャッシュは再利用され（存在する場合）、サーバーへの新たなデータ要求は行われない。

#### ソフトナビゲーションの条件

ナビゲート先のルートが[**prefetched**](#プリフェッチ)されており、[動的セグメント](/docs/app-router/building-your-application/routing/dynamic-routes) **を含まないか、または**現在のルートと同じ動的パラメータを持つ場合、Next.js はソフトナビゲーションを使用します。

たとえば、動的な `[team]` Segment を含む次のルートを考えてみましょう： `/dashboard/[team]/*.` `dashboard/[team]/*` 以下のキャッシュされた Segment は `[team]` パラメータが変更されたときのみ無効になります。

- `dashboard/team-red/*`から`/dashboard/team-red/*`への移動はソフトナビゲーションになります。
- `dashboard/team-red/*`から`/dashboard/team-blue/*`への移動はハードナビゲーションになります。

### ハードナビゲーション

ナビゲーションの際、キャッシュは無効化され、サーバーはデータを再取得し、変更された Segment を再レンダリングする。

### バック/フォワード・ナビゲーション

バック/フォワード・ナビゲーション（[popstate event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)）はソフト・ナビゲーション動作です。つまり、クライアント側のキャッシュが再利用され、ナビゲーションはほぼ瞬時に行われます。

### フォーカスおよびスクロールの管理

デフォルトでは、Next.js はフォーカスを設定し、ナビゲーションで変更された Segment をスクロールして表示します。
