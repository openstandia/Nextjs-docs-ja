---
title: layout.js
description: API reference for the layout.js file.
sidebar_position: 3
---

レイアウトとは、ルート間で共有される UI です。

```tsx title="app/dashboard/layout.tsx"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

ルート・レイアウトは、`app`ディレクトリの最上位にあるレイアウトです。`<html>`タグや`<body>`タグ、その他グローバルに共有される UI を定義するために使われます。

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Props

### `children`（必須）

レイアウトコンポーネントは`children` prop を受け入れ、使用する必要があります。レンダリング中、`children`にはレイアウトがラップしているルート Segment が入力されます。これらは主に子[レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ページ)（存在する場合）または[ページ](/docs/app-router/building-your-application/routing/pages-and-layouts#ページ)のコンポーネントになりますが、該当する場合は[Loading](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)や[Error](/docs/app-router/building-your-application/routing/error-handling)のような他の特殊ファイルにもなります。

### `params`（任意）

ルート Segment からそのレイアウトまでの[動的なルートパラメーター](/docs/app-router/building-your-application/routing/dynamic-routes)オブジェクト。

| 例                                | URL            | `params`                  |
| :-------------------------------- | :------------- | :------------------------ |
| `app/dashboard/[team]/layout.js`  | `/dashboard/1` | `{ team: '1' }`           |
| `app/shop/[tag]/[item]/layout.js` | `/shop/1/2`    | `{ tag: '1', item: '2' }` |
| `app/blog/[...slug]/layout.js`    | `/blog/1/2`    | `{ slug: ['1', '2'] }`    |

例：

```tsx title="app/shop/[item]/layout.tsx"
export default function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    tag: string
    item: string
  }
}) {
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  return <section>{children}</section>
}
```

## Good to know

### レイアウトは`searchParams`を受け取らない

[ページ](/docs/app-router/api-reference/file-conventions/page)とは異なり、レイアウト・コンポーネントは searchParams プロップを**受け取りません**。これは、共有レイアウトがナビゲーションの間に[再レンダリングされない](/docs/app-router/building-your-application/routing/linking-and-navigating#3-partial-rendering)ため、ナビゲーションの間に`searchParams`は古くなる可能性があるためです。

クライアントサイドでナビゲーションを使用する場合、Next.js は自動的に、2 つのルート間の共通レイアウト以下のページ部分のみをレンダリングします。

たとえば、次のディレクトリ構造では、`dashboard/layout.tsx`は`/dashboard/settings`と`/dashboard/analytics`の両方に共通するレイアウトです：

```
app
└── dashboard
    ├── layout.tsx
    ├── settings
    │   └── page.tsx
    └── analytics
        └── page.js
```

<!-- textlint-disable -->

`dashboard/settings`から`/dashboard/analytics`に遷移する場合、`/dashboard/analytics`の`page.tsx`は UI が変更されたためサーバー上でレンダリングされますが、 `dashboard/layout.tsx`は 2 つのルート間で共通の UI であるため再レンダリングされません。

<!-- textlint-enable -->

<!-- textlint-disable -->

このパフォーマンスの最適化により、独自のデータをフェッチする共有レイアウトを含むルート全体ではなく、ページのデータフェッチとレンダリングのみが実行されるため、レイアウトを共有するページ間のナビゲーションがより速くなります。

<!-- textlint-enable -->

`dashboard/layout.tsx`は再レンダリングしないため、レイアウト Server Component の`searchParams` prop はナビゲーション後に古くなる可能性があります。

<!-- textlint-disable -->

- 代わりに、最新の `searchParams` によりクライアント上の再レンダリングされる Client Component 内で、ページの [`searchParams`](/docs/app-router/api-reference/file-conventions/page#searchparams任意) prop、または Client Component の [`useSearchParams`](/docs/app-router/api-reference/functions/use-search-params) フックを使用します
<!-- textlint-enable -->

### ルート・レイアウト

- `app` ディレクトリにはルートの`app/layout.js`が含まれていなければなりません
- ルート・レイアウトには`<html>`タグと`<body>`タグを定義しなければなりません

  - ルート・レイアウトに`<title>`や`<meta>`のような`<head>`タグを手動で追加すべきではありません。その代わりに、`<head>`要素のストリーミングや重複除去といった高度な要件を自動的に処理する[Metadata API](/docs/app-router/api-reference/functions/generate-metadata)を使うべきです

- [ルートグループ](/docs/app-router/building-your-application/routing/route-groups)を使用して、複数のルート・レイアウトを作成できます
  - **複数のルート・レイアウトにまたがって**ナビゲートすると、（クライアントサイド・ナビゲーションとは対照的に）**フルページ・ロード**が発生します。例えば、`app/(shop)/layout.js`を使用している`/cart`から、`app/(marketing)/layout.js`を使用している`/blog`に移動すると、全ページがロードされます。これは複数のルート・レイアウトに**のみ**適用されます。

## バージョン履歴

| Version   | Changes        |
| --------- | -------------- |
| `v13.0.0` | `layout`の導入 |
