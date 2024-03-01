---
title: App Router Incremental Adoption Guide
sidebar_label: App Router への移行
description: 既存の Next.js アプリケーションを Pages Router から App Router にアップグレードする方法をご紹介します
---

このガイドは以下の状況において役立つでしょう:

- [Next.js アプリケーションをバージョン 12 からバージョン 13 にアップデート](#nextjs-バージョン)
- [`pages` と `app` の両方のディレクトリで機能するアップグレード機能](#新機能のアップグレード)
- [既存のアプリケーションを `pages` から`app` に段階的に移行](#pages-から-app-への移行)

## アップグレード

### Node.js バージョン

Node.js の最小バージョンは **v18.17** になりました。詳しくは [Node.js のドキュメント](https://nodejs.org/docs/latest-v18.x/api/)をご覧ください。

### Next.js バージョン

Next.js バージョン 13 にアップデートするには、お好みのパッケージマネージャを使用して次のコマンドを実行してください:

```bash title="Terminal"
npm install next@latest react@latest react-dom@latest
```

### ESLint バージョン

ESLint を使用している場合は、ESLint のバージョンをアップグレードする必要があります:

```bash title="Terminal"
npm install -D eslint-config-next@latest
```

> **Good to know**: ESLint の変更を有効にするために、VS Code で ESLint サーバを再起動する必要がある可能性があります。
> コマンドパレット（Mac では `cmd+shift+p`、Windows では `ctrl+shift+p` ）を開き、`ESLint: Restart ESLint Server` を検索し、ESLint サーバを再起動します。

## 次のステップ

アップデートが完了したら、次のステップをご覧ください:

- [新機能のアップグレード](#新機能のアップグレード): 改良された Image コンポーネントや Link コンポーネントなど、新機能へのアップグレードに役立つガイドです。
- [`pages` から `app` ディレクトリに移行](#pages-から-app-への移行): `pages` から `app` ディレクトリへ段階的に移行するためのステップバイステップなガイドです。

## 新機能のアップグレード

Next.js 13 では、新しい機能と規約を備えた新しい [App Router](/docs/app-router/building-your-application/routing) が導入されました。
新しいルーターは `app` ディレクトリとして利用でき、`pages` ディレクトリと共存します。

Next.js 13 にアップグレードしても新しい [App Router](/docs/app-router/building-your-application/routing#app-router) を使う必要は **ありません**。
更新された [Image コンポーネント](#image-コンポーネント)、[Link コンポーネント](#link-コンポーネント)、[Script コンポーネント](#script-コンポーネント)、[Font 最適化](#font-最適化)など、両方のディレクトリで動作する新機能を持つ `pages` を引き続き使用できます。

### `<Image/>` コンポーネント

Next.js 12 では、一時的なインポート（`next/future/image`）により、Image コンポーネントに新たな改良が加えられました。
これらの改善点には、クライアントサイド JavaScript の削減、画像の拡張とスタイル設定の容易化、アクセシビリティの向上、ネイティブブラウザの遅延ロードなどが含まれます。

バージョン 13 では、この新しい動作が `next/image` のデフォルトになりました。

新しい Image コンポーネントへの移行を支援する 2 つの Codemod があります:

- [**`next-image-to-legacy-image` codemod**](/docs/app-router/building-your-application/upgrading/codemods#next-image-to-legacy-image): `next/image` インポートの名前を `next/legacy/image` 安全かつ自動的に変更します。既存のコンポーネントは同じ動作を維持します。
- [**`next-image-experimental` codemod**](/docs/app-router/building-your-application/upgrading/codemods#next-image-experimental): 危険なインラインスタイルを追加し、未使用の prop を削除します。これにより、既存のコンポーネントの動作が新しいデフォルトに合わせて変更されます。この codemod を使用するには、まず `next-image-to-legacy-image` codemod を実行する必要があります。

### `<Link>` コンポーネント

The [`<Link>` Component](/docs/app-router/building-your-application/routing/linking-and-navigating#link-component) no longer requires manually adding an `<a>` tag as a child. This behavior was added as an experimental option in [version 12.2](https://nextjs.org/blog/next-12-2) and is now the default. In Next.js 13, `<Link>` always renders `<a>` and allows you to forward props to the underlying tag.

[`<Link>` コンポーネント](/docs/app-router/building-your-application/routing/linking-and-navigating#link-コンポーネント)は、手動で `<a>` タグを子として追加する必要がなくなりました。
この動作はバージョン 12.2 で実験的なオプションとして追加されたもので、現在はデフォルトになっています。
Next.js 13 では、`<Link>` は常に `<a>` をレンダリングし、その下にあるタグに prop を転送することができます。

例えば:

```jsx
import Link from 'next/link'

// Next.js 12: `<a>` がネストされていない場合は除外されます。
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13: `<Link>` は常に `<a>` を内部でレンダリングします。
<Link href="/about">
  About
</Link>
```

リンクを Next.js 13 にアップグレードするには、[`new-link` codemod](/docs/app-router/building-your-application/upgrading/codemods#new-link) を使用します。

### `<Script>` コンポーネント

[`next/script`](/docs/app-router/api-reference/components/script) の動作は、`pages` と `app` の両方をサポートするように更新されましたが、
スムーズな移行を確実にするためにいくつかの変更が必要です:

- 以前 `_document.js` に含めていた `beforeInteractive` スクリプトを、ルートレイアウトファイル（`app/layout.tsx`）に移動してください。
- 実験的な `worker` ストラテジーはまだ `app` では動作しないため、このストラテジーで示されたスクリプトは削除するか、別のストラテジー（`lazyOnload` など）を使用するように修正する必要があります。
- `onLoad`、`onReady`、`onError` ハンドラは Server Components では動作しませんので、必ず [Client Components](/docs/app-router/building-your-application/rendering/client-components) に移動するか、完全に削除してください。

### Font 最適化

Previously, Next.js helped you optimize fonts by [inlining font CSS](/docs/app-router/building-your-application/optimizing/fonts).
Version 13 introduces the new [`next/font`](/docs/app-router/building-your-application/optimizing/fonts) module which gives you the ability to customize your font loading experience while still ensuring great performance and privacy. `next/font` is supported in both the `pages` and `app` directories.

While [inlining CSS](/docs/app-router/building-your-application/optimizing/fonts) still works in `pages`, it does not work in `app`. You should use [`next/font`](/docs/app-router/building-your-application/optimizing/fonts) instead.

See the [Font Optimization](/docs/app-router/building-your-application/optimizing/fonts) page to learn how to use `next/font`.

以前の Next.js では、[Font CSS をインライン化する](/docs/app-router/building-your-application/optimizing/fonts) ことで Font の最適化をサポートしていました。
バージョン 13 では、新しい [`next/font`](/docs/app-router/building-your-application/optimizing/fonts) モジュールが導入され、優れたパフォーマンスとプライバシーを確保しながら、Font の読み込み体験をカスタマイズできるようになりました。
`next/font` は、`pages` と `app`の両方のディレクトリでサポートされています。

[CSS のインライン化](/docs/app-router/building-your-application/optimizing/fonts)は `pages` ではまだ機能しますが、`app` では機能しません。
代わりに `next/font` を使用してください。

`next/font` の使用方法については、[Font 最適化](/docs/app-router/building-your-application/optimizing/fonts)ページを参照してください。

## `pages` から `app` への移行

> **🎥 Watch:** Learn how to incrementally adopt the App Router → [YouTube (16 minutes)](https://www.youtube.com/watch?v=YQMSietiFm0).

Moving to the App Router may be the first time using React features that Next.js builds on top of such as Server Components, Suspense, and more. When combined with new Next.js features such as [special files](/docs/app-router/building-your-application/routing#file-conventions) and [layouts](/docs/app-router/building-your-application/routing/pages-and-layouts#layouts), migration means new concepts, mental models, and behavioral changes to learn.

We recommend reducing the combined complexity of these updates by breaking down your migration into smaller steps. The `app` directory is intentionally designed to work simultaneously with the `pages` directory to allow for incremental page-by-page migration.

- The `app` directory supports nested routes _and_ layouts. [Learn more](/docs/app-router/building-your-application/routing).
- Use nested folders to [define routes](/docs/app-router/building-your-application/routing/defining-routes) and a special `page.js` file to make a route segment publicly accessible. [Learn more](#step-4-migrating-pages).
- [Special file conventions](/docs/app-router/building-your-application/routing#file-conventions) are used to create UI for each route segment. The most common special files are `page.js` and `layout.js`.
  - Use `page.js` to define UI unique to a route.
  - Use `layout.js` to define UI that is shared across multiple routes.
  - `.js`, `.jsx`, or `.tsx` file extensions can be used for special files.
- You can colocate other files inside the `app` directory such as components, styles, tests, and more. [Learn more](/docs/app-router/building-your-application/routing).
- Data fetching functions like `getServerSideProps` and `getStaticProps` have been replaced with [a new API](/docs/app-router/building-your-application/data-fetching) inside `app`. `getStaticPaths` has been replaced with [`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params).
- `pages/_app.js` and `pages/_document.js` have been replaced with a single `app/layout.js` root layout. [Learn more](/docs/app-router/building-your-application/routing/pages-and-layouts#root-layout-required).
- `pages/_error.js` has been replaced with more granular `error.js` special files. [Learn more](/docs/app-router/building-your-application/routing/error-handling).
- `pages/404.js` has been replaced with the [`not-found.js`](/docs/app-router/api-reference/file-conventions/not-found) file.
- `pages/api/*` API Routes have been replaced with the [`route.js`](/docs/app-router/api-reference/file-conventions/route) (Route Handler) special file.

### ステップ 1: `app` ディレクトリの作成

Next.js の最新バージョン（13.4以上が必要）にアップデートします:

```bash
npm install next@latest
```

次に、プロジェクトのルート（または `src/` ディレクトリ）に新しい `app` ディレクトリを作成します。

### ステップ 2: ルートレイアウトの作成

`app` ディレクトリ内に新しい `app/layout.tsx` ファイルを作成します。
これは、`app` 内のすべてのルートに適用される[ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)です。

```tsx title="app/layout.tsx"
export default function RootLayout({
  // Layouts は children prop を受け入れなければなりません
  // これはネストされたレイアウトやページで構成されます
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

- `app` ディレクトリにはルートレイアウトを含める **必要があります**。
- Next.js は `<html>` タグと `<body>` タグを自動的に作成しないため、ルートレイアウトには `<html>` タグと `<body>` タグを定義する必要があります。
- ルートレイアウトは `pages/_app.tsx` と `pages/_document.tsx` ファイルを置き換えます。
- レイアウトファイルには `.js`、`.jsx`、`.tsx` の拡張子を使用できます。

`<head>` HTML 要素を管理するには、[組み込みの SEO サポート](/docs/app-router/building-your-application/optimizing/metadata)を使用できます:

```tsx title="app/layout.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

#### `_document.js` と `_app.js` の移行

既存の `_app` または `_document` ファイルがある場合、その内容（グローバルスタイルなど）をルートレイアウト（`app/layout.tsx`）にコピーできます。
`app/layout.tsx` のスタイルは、`pages/*` には適用 _されません_。`pages/*` のルートが壊れるのを防ぐため、移行中は`_app`/`_document` を維持する必要があります。
完全に移行したら、安全に削除できます。

React Context プロバイダーを使用している場合は、[Client Component](/docs/app-router/building-your-application/rendering/client-components) に移動する必要があります。

#### `getLayout()` パターンのレイアウトへの移行（任意）

Next.js では、`pages` ディレクトリでページごとのレイアウトを実現するために、[Page コンポーネントにプロパティ](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern#per-page-layouts)を追加することを推奨しています。
このパターンは、`app` ディレクトリの[ネストされたレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト)のネイティブサポートに置き換えることができます。

<details>
  <summary>before と after の例を見る</summary>

**Before**

```jsx title="components/DashboardLayout.js"
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```

```jsx title="pages/dashboard/index.js"
import DashboardLayout from '../components/DashboardLayout'

export default function Page() {
  return <p>My Page</p>
}

Page.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}
```

**After**

- `pages/dashboard/index.js` から `Page.getLayout` プロパティを削除し、`app` ディレクトリに[ページを移行する手順](#ステップ-4-ページの移行)に従ってください。

  ```jsx title="app/dashboard/page.js"
  export default function Page() {
    return <p>My Page</p>
  }
  ```

- `DashboardLayout` の内容を新しい [Client Component](/docs/app-router/building-your-application/rendering/client-components) に移動し、`pages` ディレクトリの動作を保持します。

  ```jsx title="app/dashboard/DashboardLayout.js"
  'use client' // このディレクティブはファイルの一番上、インポートの前に置かなければなりません

  // これは Client Component です
  export default function DashboardLayout({ children }) {
    return (
      <div>
        <h2>My Dashboard</h2>
        {children}
      </div>
    )
  }
  ```

- `DashboardLayout` を `app` ディレクトリ内の新しい `layout.js` ファイルにインポートします。

  ```jsx title="app/dashboard/layout.js"
  import DashboardLayout from './DashboardLayout'

  // これは Server Component です
  export default function Layout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>
  }
  ```

- `DashboardLayout.js`（Client Component）のインタラクティブでない部分を少しずつ `layout.js`（Server Component）に移動することで、クライアントに送信するコンポーネント JavaScript の量を減らすことができます。

</details>

### ステップ 3: `next/head` の移行

`pages` ディレクトリでは、`next/head` のReact コンポーネントが、`title` や `meta` などの `<head>` HTML 要素を管理するために使用されます。
`app` ディレクトリでは、`next/head` は新しい[組み込み SEO サポート](/docs/app-router/building-your-application/optimizing/metadata)に置き換えられます。

**Before:**

```tsx title="pages/index.tsx"
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  )
}
```

**After:**

```tsx title="app/page.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return '...'
}
```

すべてのメタデータオプションは[こちら](/docs/app-router/api-reference/functions/generate-metadata)をご参照下さい。

### ステップ 4: ページの移行

- [`app` ディレクトリ](/docs/app-router/building-your-application/routing)のページはデフォルトで [Server Components](/docs/app-router/building-your-application/rendering/server-components) です。これは、ページが [Client Components](/docs/app-router/building-your-application/rendering/client-components) である `pages` ディレクトリとは異なります。
- `app` 内の[データフェッチ](/docs/app-router/building-your-application/data-fetching)方法は変更されました。`getServerSideProps`、`getStaticProps`、`getInitialProps`は、よりシンプルなAPIに置き換えられました。
- `app` ディレクトリはネストされたフォルダを使用して[ルートを定義](/docs/app-router/building-your-application/routing/defining-routes)し、特別な `page.js` ファイルを使用してルートセグメントをパブリックアクセス可能にします。
- | `pages` ディレクトリ | `app` ディレクトリ    | ルート         |
  | -------------------- | --------------------- | -------------- |
  | `index.js`           | `page.js`             | `/`            |
  | `about.js`           | `about/page.js`       | `/about`       |
  | `blog/[slug].js`     | `blog/[slug]/page.js` | `/blog/post-1` |

ページの移行を大きく 2 つのステップに分けることをお勧めします:

- ステップ 1: デフォルトでエクスポートされたページコンポーネントを新しい Client Component に移動します。
- ステップ 2: 新しい Client Component を、`app` ディレクトリ内の新しい `page.js` ファイルにインポートします。

> **Good to know**: これは、`pages` ディレクトリと最も類似した動作をするため、最も簡単な移行手順です。

**Step 1: 新しい Client Component を作成する**

- `app` ディレクトリ内に、Client Component をエクスポートする新しい別 のファイル（`app/home-page.tsx` など）を作成します。Client Component を定義するには、`'use client'` ディレクティブをファイルの先頭（インポートの前）に追加します。
  - Pages Router と同様に、最初のページロード時に Client Components を静的HTMLにプリレンダリングする[最適化ステップ](/docs/app-router/building-your-application/rendering/client-components#full-page-load)があります。
- デフォルトのエクスポートされたページコンポーネントを `pages/index.js` から `app/home-page.tsx` に移動します。

```tsx title="app/home-page.tsx"
'use client'

// これは Client Component です（`pages`ディレクトリのコンポーネントと同じです）。
// プロップとしてデータを受け取り、ステートとエフェクトにアクセスすることができます。
// 最初のページロード時にサーバー上でプリレンダリングされます。
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**Step 2: 新しいページを作成する**

- `app` ディレクトリ内に新しい `app/page.tsx` ファイルを作成します。これはデフォルトでは Server Component です。
- `home-page.tsx` Client Component をページにインポートします。
- `pages/index.js` でデータを取得していた場合は、新しい[データ取得 API](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating) を使用して、データ取得ロジックを直接 Server Component に移動します。詳細については、[データ取得アップグレードガイド](#ステップ-6-データフェッチメソッドの移行)を参照してください。

  ```tsx title="app/page.tsx"
  // Client Component をインポートします
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // Server Component で直接データを取得します
    const recentPosts = await getPosts()
    // 取得したデータを Client Component に転送します
    return <HomePage recentPosts={recentPosts} />
  }
  ```

- 以前のページで `useRouter` を使用していた場合は、新しいルーティングフックに更新する必要があります。詳細は[こちら](/docs/app-router/api-reference/functions/use-router)です。
- 開発サーバーを起動し、[`http://localhost:3000`](http://localhost:3000)。既存の index ルートが、`app` ディレクトリを通して提供されているのが確認できるはずです。

### ステップ 5: ルーティングフックの移行

`app` ディレクトリの新しい動作をサポートするために、新しいルーターが追加されました。

アプリでは、`next/navigation` からインポートされた 3 つの新しいフック、[`useRouter()`](/docs/app-router/api-reference/functions/use-router)、[`usePathname()`](/docs/app-router/api-reference/functions/use-pathname)、[`useSearchParams()`](/docs/app-router/api-reference/functions/use-search-params) を使用する必要があります。

- 新しい `useRouter` フックは `next/navigation` からインポートされ、`next/router` からインポートされる `pages` の `useRouter` フックとは動作が異なります。
  - [`next/router` からインポートされた `useRouter`フック](/docs/pages/api-reference/functions/use-router)は、`app` ディレクトリではサポートされていませんが、`pages` ディレクトリでは引き続き使用できます。
- 新しい `useRouter` は `pathname` 文字列を返しません。代わりに別の `usePathname` フックを使ってください。
- 新しい `useRouter` は `query` オブジェクトを返しません。代わりに別の `useSearchParams` フックを使ってください。
- `useSearchParams` と `usePathname` を一緒に使うことで、ページの変更を監視することができます。詳細は[ルーターイベント](/docs/app-router/api-reference/functions/use-router#router-events)のセクションを参照してください。
- これらの新しいフックは、Client Components でのみサポートされています。Server Components では使用できません。

```tsx title="app/example-client-component.tsx"
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

さらに、新しい `useRouter` フックには以下の変更があります:

- `fallback` が[置き換えられた](#fallback-の置換)ため、`isFallback` が削除されました。
- i18n 組み込みの Next.js 機能が `app` ディレクトリで不要になったため、`locale`、`locales`、`defaultLocales`、`domainLocales` の値が削除されました。国際化については[こちら](/docs/app-router/building-your-application/routing/internationalization)をご覧ください。
- `basePath` が削除されました。代替機能は `useRouter` の一部にはありません。新しいルーターではまだ実装されていません。
- `asPath` は、新しいルーターから `as` の概念が削除されたため、削除されました。
- `isReady` は不要になったため削除されました。[静的レンダリング](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)の間、`useSearchParams()` フックを使用するコンポーネントは、プリレンダリングのステップをスキップし、代わりに実行時にクライアント上でレンダリングされます。

[`useRouter()` API リファレンスを参照ください。](/docs/app-router/api-reference/functions/use-router)

### ステップ 6: データフェッチメソッドの移行

`pages` ディレクトリでは、`getServerSideProps` と `getStaticProps` を使用してページのデータを取得します。
`app` ディレクトリの内部では、これらの以前のデータ取得関数は `fetch()` と非同期の React Server Components の上に構築されたより[シンプルな API](/docs/app-router/building-your-application/data-fetching) に置き換えられます。

```tsx title="app/page.tsx"
export default async function Page() {
  // このリクエストは手動で無効にされるまでキャッシュされるべきです
  // `getStaticProps` に似ています
  // `force-cache` はデフォルトであり、省略可能です
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // このリクエストはリクエスト毎にリフェッチされるべきです
  // `getServerSideProps` に似ています
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // このリクエストは 10 秒の有効期限でキャッシュされるべきです
  // `getStaticProps` の `revalidate` オプションに似ています
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

#### Server-side Rendering (`getServerSideProps`)

`pages` ディレクトリで、`getServerSideProps` はサーバ上のデータを取得し、ファイル内のデフォルトのエクスポートされた React コンポーネントに props を転送するために使用されます。
ページの初期 HTML はサーバからプリレンダリングされ、ブラウザでページを "ハイドレート" します（インタラクティブにします）。

```jsx title="pages/dashboard.js"
// `pages` ディレクトリ

export async function getServerSideProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Dashboard({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

`app` ディレクトリでは、[Server Components](/docs/app-router/building-your-application/rendering/server-components) を使って React コンポーネント内にデータフェッチを配置することができます。
これにより、サーバーからレンダリングされた HTML を維持しながら、クライアントへの JavaScript の送信を少なくすることができます。

`cache` オプションを `no-store` に設定することで、取得したデータを[キャッシュしない](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)ことを示すことができます。
これは `pages` ディレクトリの `getServerSideProps` と同様です。

```tsx title="app/dashboard/page.tsx"
// `app` ディレクトリ

// この関数名は何でも問題ありません
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

#### Request オブジェクトへのアクセス

`pages` ディレクトリでは、Node.js HTTP API に基づいてリクエストベースのデータを取得できます。

例えば、`getServerSideProps` から `req` オブジェクトを取得し、それを使用してリクエストのクッキーとヘッダを取得できます。

```jsx title="pages/index.js"
// `pages` ディレクトリ

export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];

  return { props: { ... }}
}

export default function Page(props) {
  return ...
}
```

`app` ディレクトリは、リクエストデータを取得するための新しい読み取り専用関数を公開します:

- [`headers()`](/docs/app-router/api-reference/functions/headers): Web Headers API に基づき、 [Server Components](/docs/app-router/building-your-application/rendering/server-components) 内部でリクエストヘッダを取得するために使用することができます。
- [`cookies()`](/docs/app-router/api-reference/functions/cookies): Web Cookies APIに基づき、[Server Components](/docs/app-router/building-your-application/rendering/server-components) 内部でクッキーを取得するために使用できます。

```tsx title="app/page.tsx"
// `app` ディレクトリ
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = headers().get('authorization')

  return '...'
}

export default async function Page() {
  // Server Components 内で `cookies()` または `headers()` を直接使用するか、データ取得関数で使用することができます
  const theme = cookies().get('theme')
  const data = await getData()
  return '...'
}
```

#### Static Site Generation (`getStaticProps`)

`pages` ディレクトリでは、`getStaticProps` 関数がビルド時にページをプリレンダリングするために使用されます。
この関数は、外部 API やデータベースから直接データを取得し、ビルド時に生成されるページ全体にデータを渡すために使用できます。

```jsx title="pages/index.js"
// `pages` ディレクトリ

export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

`app` ディレクトリでは、[`fetch()`](/docs/app-router/api-reference/functions/fetch)によるデータフェッチはデフォルトで `cache: 'force-cache'` となり、手動で無効にするまでリクエストデータをキャッシュします。
これは `pages` ディレクトリの `getStaticProps` と同様です。

```jsx title="app/page.js"
// `app` ディレクトリ

// この関数名は何でも問題ありません
async function getProjects() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return projects
}

export default async function Index() {
  const projects = await getProjects()

  return projects.map((project) => <div>{project.name}</div>)
}
```

#### 動的パス (`getStaticPaths`)

`pages` ディレクトリでは、`getStaticPaths` 関数を使用して、ビルド時にプリレンダリングする動的パスを定義します。

```jsx title="pages/posts/[id].js"
// `pages` ディレクトリ
import PostLayout from '@/components/post-layout'

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return { props: { post } }
}

export default function Post({ post }) {
  return <PostLayout post={post} />
}
```

`app` ディレクトリでは、`getStaticPaths` が [`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params) に置き換えられています。

[`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params) の動作は`getStaticPaths`と似ていますが、ルートパラメータを返す API が簡略化されており、[レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts)内部で使用できます。
`generateStaticParams` の戻り値は、ネストされた `param` オブジェクトの配列や解決されたパスの文字列ではなく、セグメントの配列です。

```jsx title="app/posts/[id]/page.js"
// `app` ディレクトリ
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

`generateStaticParams` という名前は、`app` ディレクトリ内の新しいモデルに対して、`getStaticPaths`よりも適切です。
`get` プレフィックスはより説明的な `generate` に置き換えられ、`getStaticProps` と `getServerSideProps` が不要になった今、単独でよりよく収まるようになりました。
`Paths` サフィックスは `Params` に置き換えられ、複数の動的セグメントを持つネストされたルーティングにより適しています。

---

#### `fallback` の置換

`pages` ディレクトリでは、`getStaticPaths` から返される `fallback` プロパティを使用して、ビルド時にプリレンダリングされないページの動作を定義します。
このプロパティを `true` に設定するとページが生成されている間にフォールバックページが表示され、`false` に設定すると 404 ページが表示され、`blocking` に設定するとリクエスト時にページが生成されます。

```jsx title="pages/posts/[id].js"
// `pages` ディレクトリ

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  ...
}

export default function Post({ post }) {
  return ...
}
```

`app` ディレクトリの [`config.dynamicParams` プロパティ](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamicparams)は、[`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params) 以外のパラメータがどのように処理されるかを制御します:

- **`true`**: (デフォルト) `generateStaticParams` に含まれていない動的セグメントは、必要に応じて生成されます。
- **`false`**: `generateStaticParams` に含まれていない動的セグメントは 404 を返します。

これは `pages` ディレクトリの `getStaticPaths` の `fallback: true | false | 'blocking'` オプションを置き換えるものです。
`fallback:'blocking'` オプションは `dynamicParams` には含まれません。 なぜなら、`'blocking'` と `true` の違いはストリーミングでは無視できるためです。

```jsx title="app/posts/[id]/page.js"
// `app` ディレクトリ

export const dynamicParams = true;

export async function generateStaticParams() {
  return [...]
}

async function getPost(params) {
  ...
}

export default async function Post({ params }) {
  const post = await getPost(params);

  return ...
}
```

[`dynamicParams`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamicparams)を `true` (デフォルト)に設定すると、
生成されていないルートセグメントがリクエストされたとき、それはサーバーレンダリングされ、キャッシュされます。

#### Incremental Static Regeneration (`getStaticProps` with `revalidate`)

`pages` ディレクトリでは、`getStaticProps` 関数で `revalidate` フィールドを追加し、一定時間後に自動的にページを再生成することができます。

```jsx title="pages/index.js"
// `pages` ディレクトリ

export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```

`app` ディレクトリでは、[`fetch()`](/docs/app-router/api-reference/functions/fetch) によるデータフェッチは `revalidate` を使うことができ、指定した秒数だけリクエストをキャッシュします。

```jsx title="app/page.js"
// `app` ディレクトリ

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

#### API Routes

API Routes は、`pages/api` ディレクトリでは変更なく機能し続けます。
しかし、これらは `app` ディレクトリの [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) に置き換えられました。

Route Handlers を使うと、Web [Request API](https://developer.mozilla.org/docs/Web/API/Request) と [Response API](https://developer.mozilla.org/docs/Web/API/Response) を使って、指定したルートにカスタムリクエストハンドラを作成できます。

```ts title="app/api/route.ts"
export async function GET(request: Request) {}
```

> **Good to know**: これまで API Routes を使用してクライアントから外部 API を呼び出していた場合、
> 代わりに [Server Components](/docs/app-router/building-your-application/rendering/server-components) を使用して安全にデータを取得できるようになりました。
> データ取得の詳細については、[こちら](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)をご覧ください。

### ステップ 7: スタイリング

`pages` ディレクトリでは、グローバルスタイルシートは `pages/_app.js` のみに制限されていました。
`app` ディレクトリでは、この制限が解除されました。グローバルスタイルはどのレイアウト、ページ、コンポーネントにも追加できます。

- [CSS Modules](/docs/app-router/building-your-application/styling/css-modules)
- [Tailwind CSS](/docs/app-router/building-your-application/styling/tailwind-css)
- [Global Styles](/docs/app-router/building-your-application/styling/css-modules#グローバルスタイル)
- [CSS-in-JS](/docs/app-router/building-your-application/styling/css-in-js)
- [External Stylesheets](/docs/app-router/building-your-application/styling/css-modules#外部スタイルシート)
- [Sass](/docs/app-router/building-your-application/styling/sass)

#### Tailwind CSS

Tailwind CSS を使用している場合は、`tailwind.config.js` ファイルに `app` ディレクトリを追加する必要があります:

```js title="tailwind.config.js"
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- この行を追加する
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

また、`app/layout.js` ファイルでグローバルスタイルをインポートする必要があります:

```jsx title="app/layout.js"
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

[Tailwind CSSを使ったスタイリング](/docs/app-router/building-your-application/styling/tailwind-css)の詳細を学ぶ

## Codemods

Next.js は、機能が非推奨になったときにコードベースをアップグレードするのに役立つ Codemod 変換を提供します。詳しくは [Codemods](/docs/app-router/building-your-application/upgrading/codemods) をご覧ください。
