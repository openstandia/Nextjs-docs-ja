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

In the `pages` directory, the `next/head` React component is used to manage `<head>` HTML elements such as `title` and `meta` . In the `app` directory, `next/head` is replaced with the new [built-in SEO support](/docs/app-router/building-your-application/optimizing/metadata).

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

[See all metadata options](/docs/app-router/api-reference/functions/generate-metadata).

### ステップ 4: ページの移行

- Pages in the [`app` directory](/docs/app-router/building-your-application/routing) are [Server Components](/docs/app-router/building-your-application/rendering/server-components) by default. This is different from the `pages` directory where pages are [Client Components](/docs/app-router/building-your-application/rendering/client-components).
- [Data fetching](/docs/app-router/building-your-application/data-fetching) has changed in `app`. `getServerSideProps`, `getStaticProps` and `getInitialProps` have been replaced with a simpler API.
- The `app` directory uses nested folders to [define routes](/docs/app-router/building-your-application/routing/defining-routes) and a special `page.js` file to make a route segment publicly accessible.
- | `pages` Directory | `app` Directory       | Route          |
  | ----------------- | --------------------- | -------------- |
  | `index.js`        | `page.js`             | `/`            |
  | `about.js`        | `about/page.js`       | `/about`       |
  | `blog/[slug].js`  | `blog/[slug]/page.js` | `/blog/post-1` |

We recommend breaking down the migration of a page into two main steps:

- Step 1: Move the default exported Page Component into a new Client Component.
- Step 2: Import the new Client Component into a new `page.js` file inside the `app` directory.

> **Good to know**: This is the easiest migration path because it has the most comparable behavior to the `pages` directory.

**Step 1: Create a new Client Component**

- Create a new separate file inside the `app` directory (i.e. `app/home-page.tsx` or similar) that exports a Client Component. To define Client Components, add the `'use client'` directive to the top of the file (before any imports).
  - Similar to the Pages Router, there is an [optimization step](/docs/app-router/building-your-application/rendering/client-components#full-page-load) to prerender Client Components to static HTML on the initial page load.
- Move the default exported page component from `pages/index.js` to `app/home-page.tsx`.

```tsx title="app/home-page.tsx"
'use client'

// This is a Client Component (same as components in the `pages` directory)
// It receives data as props, has access to state and effects, and is
// prerendered on the server during the initial page load.
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

**Step 2: Create a new page**

- Create a new `app/page.tsx` file inside the `app` directory. This is a Server Component by default.
- Import the `home-page.tsx` Client Component into the page.
- If you were fetching data in `pages/index.js`, move the data fetching logic directly into the Server Component using the new [data fetching APIs](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating). See the [data fetching upgrade guide](#step-6-migrating-data-fetching-methods) for more details.

  ```tsx title="app/page.tsx"
  // Import your Client Component
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // Fetch data directly in a Server Component
    const recentPosts = await getPosts()
    // Forward fetched data to your Client Component
    return <HomePage recentPosts={recentPosts} />
  }
  ```

- If your previous page used `useRouter`, you'll need to update to the new routing hooks. [Learn more](/docs/app-router/api-reference/functions/use-router).
- Start your development server and visit [`http://localhost:3000`](http://localhost:3000). You should see your existing index route, now served through the app directory.

### ステップ 5: ルーティングフックの移行

A new router has been added to support the new behavior in the `app` directory.

In `app`, you should use the three new hooks imported from `next/navigation`: [`useRouter()`](/docs/app-router/api-reference/functions/use-router), [`usePathname()`](/docs/app-router/api-reference/functions/use-pathname), and [`useSearchParams()`](/docs/app-router/api-reference/functions/use-search-params).

- The new `useRouter` hook is imported from `next/navigation` and has different behavior to the `useRouter` hook in `pages` which is imported from `next/router`.
  - The [`useRouter` hook imported from `next/router`](/docs/pages/api-reference/functions/use-router) is not supported in the `app` directory but can continue to be used in the `pages` directory.
- The new `useRouter` does not return the `pathname` string. Use the separate `usePathname` hook instead.
- The new `useRouter` does not return the `query` object. Use the separate `useSearchParams` hook instead.
- You can use `useSearchParams` and `usePathname` together to listen to page changes. See the [Router Events](/docs/app-router/api-reference/functions/use-router#router-events) section for more details.
- These new hooks are only supported in Client Components. They cannot be used in Server Components.

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

In addition, the new `useRouter` hook has the following changes:

- `isFallback` has been removed because `fallback` has [been replaced](#replacing-fallback).
- The `locale`, `locales`, `defaultLocales`, `domainLocales` values have been removed because built-in i18n Next.js features are no longer necessary in the `app` directory. [Learn more about i18n](/docs/app-router/building-your-application/routing/internationalization).
- `basePath` has been removed. The alternative will not be part of `useRouter`. It has not yet been implemented.
- `asPath` has been removed because the concept of `as` has been removed from the new router.
- `isReady` has been removed because it is no longer necessary. During [static rendering](/docs/app-router/building-your-application/rendering/server-components#static-rendering-default), any component that uses the [`useSearchParams()`](/docs/app-router/api-reference/functions/use-search-params) hook will skip the prerendering step and instead be rendered on the client at runtime.

[View the `useRouter()` API reference](/docs/app-router/api-reference/functions/use-router).

### ステップ 6: データフェッチメソッドの移行

The `pages` directory uses `getServerSideProps` and `getStaticProps` to fetch data for pages. Inside the `app` directory, these previous data fetching functions are replaced with a [simpler API](/docs/app-router/building-your-application/data-fetching) built on top of `fetch()` and `async` React Server Components.

```tsx title="app/page.tsx"
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

#### サーバーサイドレンダリング (`getServerSideProps`)

In the `pages` directory, `getServerSideProps` is used to fetch data on the server and forward props to the default exported React component in the file. The initial HTML for the page is prerendered from the server, followed by "hydrating" the page in the browser (making it interactive).

```jsx title="pages/dashboard.js"
// `pages` directory

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

In the `app` directory, we can colocate our data fetching inside our React components using [Server Components](/docs/app-router/building-your-application/rendering/server-components). This allows us to send less JavaScript to the client, while maintaining the rendered HTML from the server.

By setting the `cache` option to `no-store`, we can indicate that the fetched data should [never be cached](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating). This is similar to `getServerSideProps` in the `pages` directory.

```tsx title="app/dashboard/page.tsx"
// `app` directory

// This function can be named anything
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

In the `pages` directory, you can retrieve request-based data based on the Node.js HTTP API.

For example, you can retrieve the `req` object from `getServerSideProps` and use it to retrieve the request's cookies and headers.

```jsx title="pages/index.js"
// `pages` directory

export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];

  return { props: { ... }}
}

export default function Page(props) {
  return ...
}
```

The `app` directory exposes new read-only functions to retrieve request data:

- [`headers()`](/docs/app-router/api-reference/functions/headers): Based on the Web Headers API, and can be used inside [Server Components](/docs/app-router/building-your-application/rendering/server-components) to retrieve request headers.
- [`cookies()`](/docs/app-router/api-reference/functions/cookies): Based on the Web Cookies API, and can be used inside [Server Components](/docs/app-router/building-your-application/rendering/server-components) to retrieve cookies.

```tsx title="app/page.tsx"
// `app` directory
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = headers().get('authorization')

  return '...'
}

export default async function Page() {
  // You can use `cookies()` or `headers()` inside Server Components
  // directly or in your data fetching function
  const theme = cookies().get('theme')
  const data = await getData()
  return '...'
}
```

#### 静的サイトジェネレーション (`getStaticProps`)

In the `pages` directory, the `getStaticProps` function is used to pre-render a page at build time. This function can be used to fetch data from an external API or directly from a database, and pass this data down to the entire page as it's being generated during the build.

```jsx title="pages/index.js"
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

In the `app` directory, data fetching with [`fetch()`](/docs/app-router/api-reference/functions/fetch) will default to `cache: 'force-cache'`, which will cache the request data until manually invalidated. This is similar to `getStaticProps` in the `pages` directory.

```jsx title="app/page.js"
// `app` directory

// This function can be named anything
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

In the `pages` directory, the `getStaticPaths` function is used to define the dynamic paths that should be pre-rendered at build time.

```jsx title="pages/posts/[id].js"
// `pages` directory
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

In the `app` directory, `getStaticPaths` is replaced with [`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params).

[`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params) behaves similarly to `getStaticPaths`, but has a simplified API for returning route parameters and can be used inside [layouts](/docs/app-router/building-your-application/routing/pages-and-layouts). The return shape of `generateStaticParams` is an array of segments instead of an array of nested `param` objects or a string of resolved paths.

```jsx title="app/posts/[id]/page.js"
// `app` directory
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

Using the name `generateStaticParams` is more appropriate than `getStaticPaths` for the new model in the `app` directory. The `get` prefix is replaced with a more descriptive `generate`, which sits better alone now that `getStaticProps` and `getServerSideProps` are no longer necessary. The `Paths` suffix is replaced by `Params`, which is more appropriate for nested routing with multiple dynamic segments.

---

#### `fallback` の置換

In the `pages` directory, the `fallback` property returned from `getStaticPaths` is used to define the behavior of a page that isn't pre-rendered at build time. This property can be set to `true` to show a fallback page while the page is being generated, `false` to show a 404 page, or `blocking` to generate the page at request time.

```jsx title="pages/posts/[id].js"
// `pages` directory

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

In the `app` directory the [`config.dynamicParams` property](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamicparams) controls how params outside of [`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params) are handled:

- **`true`**: (default) Dynamic segments not included in `generateStaticParams` are generated on demand.
- **`false`**: Dynamic segments not included in `generateStaticParams` will return a 404.

This replaces the `fallback: true | false | 'blocking'` option of `getStaticPaths` in the `pages` directory. The `fallback: 'blocking'` option is not included in `dynamicParams` because the difference between `'blocking'` and `true` is negligible with streaming.

```jsx title="app/posts/[id]/page.js"
// `app` directory

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

With [`dynamicParams`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamicparams) set to `true` (the default), when a route segment is requested that hasn't been generated, it will be server-rendered and cached.

#### Incremental Static Regeneration (`getStaticProps` with `revalidate`)

In the `pages` directory, the `getStaticProps` function allows you to add a `revalidate` field to automatically regenerate a page after a certain amount of time.

```jsx title="pages/index.js"
// `pages` directory

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

In the `app` directory, data fetching with [`fetch()`](/docs/app-router/api-reference/functions/fetch) can use `revalidate`, which will cache the request for the specified amount of seconds.

```jsx title="app/page.js"
// `app` directory

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

#### API ルート

API Routes continue to work in the `pages/api` directory without any changes. However, they have been replaced by [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) in the `app` directory.

Route Handlers allow you to create custom request handlers for a given route using the Web [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs.

```ts title="app/api/route.ts"
export async function GET(request: Request) {}
```

> **Good to know**: If you previously used API routes to call an external API from the client, you can now use [Server Components](/docs/app-router/building-your-application/rendering/server-components) instead to securely fetch data. Learn more about [data fetching](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating).

### ステップ 7: スタイリング

In the `pages` directory, global stylesheets are restricted to only `pages/_app.js`. With the `app` directory, this restriction has been lifted. Global styles can be added to any layout, page, or component.

- [CSS Modules](/docs/app-router/building-your-application/styling/css-modules)
- [Tailwind CSS](/docs/app-router/building-your-application/styling/tailwind-css)
- [Global Styles](/docs/app-router/building-your-application/styling/css-modules#global-styles)
- [CSS-in-JS](/docs/app-router/building-your-application/styling/css-in-js)
- [External Stylesheets](/docs/app-router/building-your-application/styling/css-modules#external-stylesheets)
- [Sass](/docs/app-router/building-your-application/styling/sass)

#### Tailwind CSS

If you're using Tailwind CSS, you'll need to add the `app` directory to your `tailwind.config.js` file:

```js title="tailwind.config.js"
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- Add this line
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

You'll also need to import your global styles in your `app/layout.js` file:

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

Learn more about [styling with Tailwind CSS](/docs/app-router/building-your-application/styling/tailwind-css)

## Codemods

Next.js は、機能が非推奨になったときにコードベースをアップグレードするのに役立つ Codemod 変換を提供します。詳しくは [Codemods](/docs/app-router/building-your-application/upgrading/codemods) をご覧ください。
