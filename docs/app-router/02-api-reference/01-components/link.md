---
title: <Link>
description: ビルトインの next/link コンポーネントを使用して、クライアントサイドの高速なナビゲーションを可能にします。
sidebar_position: 3
---

`<Link>`は、HTML の`<a>`要素を拡張して、ルート間の[プリフェッチ](/docs/app-router/building-your-application/routing/linking-and-navigating#プリフェッチ)とクライアントサイドのナビゲーションを提供する React コンポーネントです。Next.js でルート間をナビゲートする主要な方法です。

```tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

## Props

Link コンポーネントで使用できる Props：

| Prop                    | 例                 | 型                   | 必須 |
| :---------------------- | :----------------- | :------------------- | :--- |
| [`href`](#href必須)     | `href="/dashboard` | String または Object | ✔️   |
| [`replace`](#replace)   | `replace={false}`  | Boolean              | -️   |
| [`scroll`](#scroll)     | `scroll={false}`   | Boolean              | -    |
| [`prefetch`](#prefetch) | `prefetch={false}` | Boolean              | -️   |

> **Good to know**: `className`や`target="_blank"`のような`<a>`タグの属性は、`<Link>`に props として追加することができ、基礎となる`<a>`要素に渡されます。

### `href`（必須）

遷移する先のパスまたは URL。

```tsx
<Link href="/dashboard">Dashboard</Link>
```

`href`はオブジェクトも受け付けます、例えば：

```tsx
// /about?name=test に遷移する
<Link
  href={{
    pathname: '/about',
    query: { name: 'test' },
  }}
>
  About
</Link>
```

### `replace`

**デフォルトは`false`です**。`true`の場合、`next/link`は[ブラウザの履歴スタック](https://developer.mozilla.org/ja/docs/Web/API/History_API)に新しい URL を追加する代わりに、現在の履歴の状態を置き換えます。

```tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

### `scroll`

**デフォルトは`true`です**。`<Link>`のデフォルトの動作は、新しいルートのトップまでスクロールするか、前後のナビゲーション時にスクロール位置を維持します。`false`の場合、`next/link`はナビゲーションの後、ページのトップにスクロールしません。

```tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

### `prefetch`

<!-- textlint-disable -->

**デフォルトは`true`です**。`true`の場合、`next/link`はバックグラウンドでページ（`href`で示される）をプリフェッチします。これはクライアントサイドのナビゲーションのパフォーマンスを向上させるのに有用です。ビューポート内のすべての `<Link />`が（初期状態またはスクロールによって）プリロードされます。

<!-- textlint-enable -->

`prefetch={false}`を渡すことで、プリフェッチを無効にできます。プリフェッチはプロダクションでのみ有効です。

```tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

## 例

### 動的ルートにリンクする

動的ルートの場合、リンクのパスを作成するためにテンプレート・リテラルを使うと便利です。

たとえば、動的ルート`app/blog/[slug]/page.js`へのリンクのリストは以下のように生成できます：

```jsx title="app/blog/page.js"
import Link from 'next/link'

function Page({ posts }) {
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

### Middleware

認証やその他の目的で、ユーザーを別のページに書き換えるため[Middleware](/docs/app-router/building-your-application/routing/middleware)を使用することはよくあります。`<Link />`コンポーネントが Middleware 経由の書き換えを伴うリンクを適切にプリフェッチするためには、表示する URL とプリフェッチする URL の両方を Next.js に伝える必要があります。これは、プリフェッチする正しいルートを知るために、Middleware への不要なフェッチを避けるために必要です。

たとえば、`/dashboard`ルートに認証済みユーザーとゲスト向けのビューがある場合、Middleware に次のようなコードを追加して、ユーザーを正しいページにリダイレクトできます：

```js title="middleware.js"
export function middleware(req) {
  const nextUrl = req.nextUrl
  if (nextUrl.pathname === '/dashboard') {
    if (req.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', req.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', req.url))
    }
  }
}
```

```js
import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed'

export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

## バージョン履歴

| Version   | Changes                                                                                                                                                                                         |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.0.0` | 子`<a>`タグが不要になりました。コードベースを自動的に更新するための[codemod](/docs/app-router/building-your-application/upgrading/codemods#aタグをlinkコンポーネントから削除する)が提供されます |
| `v10.0.0` | 動的なルートを指す`href` prop は自動的に解決され、`as` prop は必要なくなりました                                                                                                                |
| `v8.0.0`  | プリフェッチのパフォーマンスが向上されました                                                                                                                                                    |
| `v1.0.0`  | `next/link` 導入                                                                                                                                                                                |
