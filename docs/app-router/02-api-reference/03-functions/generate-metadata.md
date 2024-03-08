---
title: Metadata Object and generateMetadata Options
sidebar_label: generateMetadata
description: Next.js アプリケーションにメタデータを追加して、検索エンジン最適化（SEO）とウェブ共有性を向上させる方法をご紹介します
related:
  title: 次のステップ
  description: Metadata APIオプションをすべて表示します
  links:
    - app-router/api-reference/file-conventions/metadata
    - app-router/api-reference/functions/generate-viewport
    - app-router/building-your-application/optimizing/metadata
---

このページでは、`generateMetadata` と静的メタデータオブジェクトを含む、すべての **設定ベースのメタデータ** オプションについて説明します。

```tsx title="layout.tsx | page.tsx"
import { Metadata } from 'next'

// either Static metadata
export const metadata: Metadata = {
  title: '...',
}

// or Dynamic metadata
export async function generateMetadata({ params }) {
  return {
    title: '...',
  }
}
```

> **Good to know**:
>
> - `metadata` オブジェクトと `generateMetadata` 関数のエクスポートは、**Server Components でのみ** サポートされています。
> - 同じルートセグメントから `metadata` オブジェクトと `generateMetadata` 関数の両方をエクスポートすることはできません。

## `metadata` オブジェクト

静的メタデータを定義するには、`layout.js` または `page.js` ファイルから [`Metadata` オブジェクト](#metadata-fields)をエクスポートします。

```tsx title="layout.tsx | page.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

サポートされるオプションの完全なリストについては、[Metadata Fields](#metadata-fields) を参照してください。

## `generateMetadata` 関数

動的なメタデータは、現在のルートパラメータ、外部データ、親セグメントの `metadata` などの **動的な情報** に依存し、[Metadata オブジェクト](#metadata-fields)を返す `generateMetadata` 関数をエクスポートすることで設定できます。

```tsx title="app/products/[id]/page.tsx"
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}
```

### Parameters

`generateMetadata` 関数は以下のパラメータを受け付けます:

- `props` - 現在のルートのパラメータを含むオブジェクトです:

  - `params` - ルートセグメントから `generateMetadata` が呼び出されるセグメントまでの[動的ルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)オブジェクトを含むオブジェクトです。例:

    | ルート                          | URL         | `params`                  |
    | ------------------------------- | ----------- | ------------------------- |
    | `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
    | `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
    | `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

  - `searchParams` - 現在のURLの [search params](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters) を含むオブジェクトです。例:

    | URL             | `searchParams`       |
    | --------------- | -------------------- |
    | `/shop?a=1`     | `{ a: '1' }`         |
    | `/shop?a=1&b=2` | `{ a: '1', b: '2' }` |
    | `/shop?a=1&a=2` | `{ a: ['1', '2'] }`  |

- `parent` - 親ルートセグメントから解決されたメタデータの promise です。

### Returns

`generateMetadata` は、1つ以上のメタデータフィールドを含む [Metadata オブジェクト](#metadata-fields)を返す必要があります。

> **Good to know**:
>
> - メタデータがランタイム情報に依存しない場合は、`generateMetadata` ではなく静的 [metadata オブジェクト](#metadata-オブジェクト)を使用して定義する必要があります。
> - `fetch` リクエストは、`generateMetadata`、`generateStaticParams`、Layouts、Pages、およびServer Components全体で同じデータに対して自動的に[メモ化](/docs/app-router/building-your-application/caching#request-memoization)されます。`fetch` が利用できない場合は、React [`cache` を使用できます](/docs/app-router/building-your-application/caching#request-memoization)。
> - `searchParams` は `page.js` セグメントでのみ使用できます。
> - Next.js の [`redirect()`](/docs/app-router/api-reference/functions/redirect) メソッドと [`notFound()`](/docs/app-router/api-reference/functions/not-found) メソッドは、`generateMetadata` の内部でも使用できます。

## Metadata Fields

### `title`

`title` 属性は、文書のタイトルを設定するのに使われます。単純な[文字列](#string)かオプションの[テンプレートオブジェクト](#template-object)として定義できます。

#### String

```jsx title="layout.js | page.js"
export const metadata = {
  title: 'Next.js',
}
```

```html title="<head> output" hideLineNumbers
<title>Next.js</title>
```

#### Template object

```tsx title="app/layout.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '...',
    default: '...',
    absolute: '...',
  },
}
```

##### Default

`title.default` は、`title` を定義していない子ルートセグメントに **フォールバックタイトル** を提供するために使われます。

```tsx title="app/layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Acme',
  },
}
```

```tsx title="app/about/page.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {}

// Output: <title>Acme</title>
```

##### Template

`title.template` を使うと、**子** ルートセグメントで定義された `titles` にプレフィックスやサフィックスを追加することができます。

```tsx title="app/layout.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // テンプレート作成時にデフォルトが必要
  },
}
```

```tsx title="app/about/page.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

// Output: <title>About | Acme</title>
```

> **Good to know**:
>
> - `title.template` は **子**ルートのセグメントに適用され、定義されたセグメントには適用され**ません**。つまり:
>
>   - `title.default` は `title.template` を追加する際に **必須** です。
>   - `layout.js` で定義された `title.template` は、同じルートセグメントの `page.js` で定義されたタイトルには適用されません。
>   - `page.js` で定義された `title.template` は、ページが常に終了セグメントである（子ルートセグメントを持たない）ため、何の効果もありません。
>
> - `title.template` は、ルートが `title` または `title.default` を定義していない場合は **効果がありません**。

##### Absolute

`title.absolute` を使用すると、親セグメントで設定された `title.template` を**無視**したタイトルを指定することができます。

```tsx title="app/layout.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```tsx title="app/about/page.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'About',
  },
}

// Output: <title>About</title>
```

> **Good to know**:
>
> - `layout.js`
>
>   - `title` (string) および `title.default` は、子セグメント (独自のタイトルを定義していない) のデフォルトのタイトルを定義します。`title.template` が存在する場合、最も近い親セグメントから補強します。
>   - `title.absolute` は、子セグメントのデフォルトのタイトルを定義します。親セグメントの `title.template` は無視されます。
>   - `title.template` は、子セグメント用の新しいタイトルテンプレートを定義します。
>
> - `page.js`
>   - ページが独自のタイトルを定義していない場合、最も近い親が解決したタイトルが使われます。
>   - `title` (string) はルートのタイトルを定義します。`title.template` が存在する場合、最も近い親セグメントから補強します。
>   - `title.absolute` はルートのタイトルを定義します。親セグメントの `title.template` は無視されます。
>   - `title.template` は `page.js` には影響しません。なぜなら、ページは常にルートの終端セグメントのためです。

### `description`

```jsx title="layout.js | page.js"
export const metadata = {
  description: 'The React Framework for the Web',
}
```

```html title="<head> output" hideLineNumbers
<meta name="description" content="The React Framework for the Web" />
```

### Basic Fields

```jsx title="layout.js | page.js"
export const metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="application-name" content="Next.js" />
<meta name="author" content="Seb" />
<link rel="author" href="https://nextjs.org" />
<meta name="author" content="Josh" />
<meta name="generator" content="Next.js" />
<meta name="keywords" content="Next.js,React,JavaScript" />
<meta name="referrer" content="origin-when-cross-origin" />
<meta name="color-scheme" content="dark" />
<meta name="creator" content="Jiachi Liu" />
<meta name="publisher" content="Sebastian Markbåge" />
<meta name="format-detection" content="telephone=no, address=no, email=no" />
```

### `metadataBase`

`metadataBase` は、完全修飾 URL を必要とする `metadata` フィールドのベース URL プレフィックスを設定する便利なオプションです。

- `metadataBase` は、**現在のルートセグメント以下** で定義された URL ベースの `metadata` フィールドです。絶対 URL の代わりに **相対パス** を使用できるようにします。
- フィールドの相対パスは、`metadataBase` と組み合わされて完全修飾URLを形成します。
- 設定されていない場合、`metadataBase` には **自動的**に[デフォルト値](#default-value)が入力されます。

```jsx title="layout.js | page.js"
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
```

```html title="<head> output" hideLineNumbers
<link rel="canonical" href="https://acme.com" />
<link rel="alternate" hreflang="en-US" href="https://acme.com/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://acme.com/de-DE" />
<meta property="og:image" content="https://acme.com/og-image.png" />
```

> **Good to know**:
>
> - `metadataBase` は通常、ルート `app/layout.js` で設定され、すべてのルートでURLベースの `metadata` フィールドに適用されます。
> - 絶対URLを必要とするURLベースの `metadata` フィールドはすべて、`metadataBase` オプションで設定できます。
> - `metadataBase` は、サブドメイン（例: `https://app.acme.com` ）またはベースパス（例: `https://acme.com/start/from/here` ）を含むことができます。
> - `metadata` フィールドが絶対URLを提供する場合、`metadataBase` は無視されます。
> - `metadataBase` を設定せずにURLベースの `metadata` フィールドに相対パスを使用すると、ビルドエラーになります。
> - Next.jsは、`metadataBase`（例: `https://acme.com/` ）と相対フィールド（例: `/path` ）の間で重複するスラッシュを、単一のスラッシュ（例: `https://acme.com/path` ）に正規化します。

#### Default value

設定されていない場合、`metadataBase` は **デフォルト値** を持ちます。

- [`VERCEL_URL`](https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables#:~:text=.-,VERCEL_URL,-The%20domain%20name)が検出された場合: `https://${process.env.VERCEL_URL}`、それ以外の場合は、`http://localhost:${process.env.PORT || 3000}`にフォールバックします。
- デフォルトを上書きする場合は、環境変数を使用してURLを計算することをお勧めします。これにより、ローカルの開発環境、ステージング環境、本番環境用のURLを設定することができます。

#### URL 構成

URLの構成は、デフォルトのディレクトリトラバーサルセマンティクスよりも開発者の意図を優先します。

- `metadataBase` と `metadata` フィールド間の末尾のスラッシュは正規化されます。
- `metadata` フィールドの「絶対」パス（通常、URLパス全体を置き換える）は、（`metadataBase` の末尾から始まる）「相対」パスとして扱われます。

例えば、次のような `metadataBase` があるとします:

```tsx title="app/layout.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

上記の `metadataBase` を継承し、独自の値を設定する `metadata`フィールドは以下のように解決されます:

| `metadata` フィールド            | 解決された URL                   |
| -------------------------------- | -------------------------------- |
| `/`                              | `https://acme.com`               |
| `./`                             | `https://acme.com`               |
| `payments`                       | `https://acme.com/payments`      |
| `/payments`                      | `https://acme.com/payments`      |
| `./payments`                     | `https://acme.com/payments`      |
| `../payments`                    | `https://acme.com/payments`      |
| `https://beta.acme.com/payments` | `https://beta.acme.com/payments` |

### `openGraph`

```jsx title="layout.js | page.js"
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

```html title="<head> output" hideLineNumbers
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:url" content="https://nextjs.org/" />
<meta property="og:site_name" content="Next.js" />
<meta property="og:locale" content="en_US" />
<meta property="og:image:url" content="https://nextjs.org/og.png" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="600" />
<meta property="og:image:url" content="https://nextjs.org/og-alt.png" />
<meta property="og:image:width" content="1800" />
<meta property="og:image:height" content="1600" />
<meta property="og:image:alt" content="My custom alt" />
<meta property="og:type" content="website" />
```

```jsx title="layout.js | page.js"
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    type: 'article',
    publishedTime: '2023-01-01T00:00:00.000Z',
    authors: ['Seb', 'Josh'],
  },
}
```

```html title="<head> output" hideLineNumbers
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-01-01T00:00:00.000Z" />
<meta property="article:author" content="Seb" />
<meta property="article:author" content="Josh" />
```

> **Good to know**:
>
> - オープングラフの画像には、[ファイルベースのメタデータAPI](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image#画像ファイルjpgpnggif)を使用した方が便利な場合があります。コンフィグエクスポートと実際のファイルを同期させる必要がなく、ファイルベースのAPIが自動的に正しいメタデータを生成してくれます。

### `robots`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="robots" content="noindex, follow, nocache" />
<meta
  name="googlebot"
  content="index, nofollow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
/>
```

### `icons`

> **Good to know**: アイコンについては、可能な限り[ファイルベースのメタデータAPI](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image#画像ファイルjpgpnggif)を使用することをお勧めします。コンフィグエクスポートと実際のファイルを同期させる必要がなく、ファイルベースのAPIが自動的に正しいメタデータを生成してくれます。

```jsx title="layout.js | page.js"
export const metadata = {
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}
```

```html title="<head> output" hideLineNumbers
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
```

```jsx title="layout.js | page.js"
export const metadata = {
  icons: {
    icon: [
      { url: '/icon.png' },
      new URL('/icon.png', 'https://example.com'),
      { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
}
```

```html title="<head> output" hideLineNumbers
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="icon" href="https://example.com/icon.png" />
<link rel="icon" href="/icon-dark.png" media="(prefers-color-scheme: dark)" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
<link
  rel="apple-touch-icon"
  href="/apple-icon-x3.png"
  sizes="180x180"
  type="image/png"
/>
```

> **Good to know**: `msapplication-*` メタタグは、Microsoft Edge の Chromium ビルドではサポートされなくなったため、不要になりました。

### `themeColor`

> **非推奨**: メタデータの `themeColor` オプションは、Next.js 14で廃止されました。代わりに[ビューポート設定](/docs/app-router/api-reference/functions/generate-viewport)を使用してください。

### `manifest`

[Web アプリケーションマニフェスト仕様](https://developer.mozilla.org/docs/Web/Manifest)で定義されている、Web アプリケーションマニフェストです。

```jsx title="layout.js | page.js"
export const metadata = {
  manifest: 'https://nextjs.org/manifest.json',
}
```

```html title="<head> output" hideLineNumbers
<link rel="manifest" href="https://nextjs.org/manifest.json" />
```

### `twitter`

Twitterの仕様は（驚くことに）X（旧Twitter）以外にも使われています。

Twitter Card マークアップリファレンスの詳細は[こちら](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)です。

```jsx title="layout.js | page.js"
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'], // 絶対URLでなければなりません
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
```

```jsx title="layout.js | page.js"
export const metadata = {
  twitter: {
    card: 'app',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: {
      url: 'https://nextjs.org/og.png',
      alt: 'Next.js Logo',
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:card" content="app" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
<meta name="twitter:image:alt" content="Next.js Logo" />
<meta name="twitter:app:name:iphone" content="twitter_app" />
<meta name="twitter:app:id:iphone" content="twitter_app://iphone" />
<meta name="twitter:app:id:ipad" content="twitter_app://ipad" />
<meta name="twitter:app:id:googleplay" content="twitter_app://googleplay" />
<meta name="twitter:app:url:iphone" content="https://iphone_url" />
<meta name="twitter:app:url:ipad" content="https://ipad_url" />
<meta name="twitter:app:name:ipad" content="twitter_app" />
<meta name="twitter:app:name:googleplay" content="twitter_app" />
```

### `viewport`

> **非推奨**: `metadata` の `viewport` オプションは、Next.js 14で廃止されました。代わりに[ビューポート設定](/docs/app-router/api-reference/functions/generate-viewport)を使用してください。

### `verification`

```jsx title="layout.js | page.js"
export const metadata = {
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="google-site-verification" content="google" />
<meta name="y_key" content="yahoo" />
<meta name="yandex-verification" content="yandex" />
<meta name="me" content="my-email" />
<meta name="me" content="my-link" />
```

### `appleWebApp`

```jsx title="layout.js | page.js"
export const metadata = {
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}
```

```html title="<head> output" hideLineNumbers
<meta
  name="apple-itunes-app"
  content="app-id=myAppStoreID, app-argument=myAppArgument"
/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Apple Web App" />
<link
  href="/assets/startup/apple-touch-startup-image-768x1004.png"
  rel="apple-touch-startup-image"
/>
<link
  href="/assets/startup/apple-touch-startup-image-1536x2008.png"
  media="(device-width: 768px) and (device-height: 1024px)"
  rel="apple-touch-startup-image"
/>
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
```

### `alternates`

```jsx title="layout.js | page.js"
export const metadata = {
  alternates: {
    canonical: 'https://nextjs.org',
    languages: {
      'en-US': 'https://nextjs.org/en-US',
      'de-DE': 'https://nextjs.org/de-DE',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://nextjs.org/mobile',
    },
    types: {
      'application/rss+xml': 'https://nextjs.org/rss',
    },
  },
}
```

```html title="<head> output" hideLineNumbers
<link rel="canonical" href="https://nextjs.org" />
<link rel="alternate" hreflang="en-US" href="https://nextjs.org/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://nextjs.org/de-DE" />
<link
  rel="alternate"
  media="only screen and (max-width: 600px)"
  href="https://nextjs.org/mobile"
/>
<link
  rel="alternate"
  type="application/rss+xml"
  href="https://nextjs.org/rss"
/>
```

### `appLinks`

```jsx title="layout.js | page.js"
export const metadata = {
  appLinks: {
    ios: {
      url: 'https://nextjs.org/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.example.android/package',
      app_name: 'app_name_android',
    },
    web: {
      url: 'https://nextjs.org/web',
      should_fallback: true,
    },
  },
}
```

```html title="<head> output" hideLineNumbers
<meta property="al:ios:url" content="https://nextjs.org/ios" />
<meta property="al:ios:app_store_id" content="app_store_id" />
<meta property="al:android:package" content="com.example.android/package" />
<meta property="al:android:app_name" content="app_name_android" />
<meta property="al:web:url" content="https://nextjs.org/web" />
<meta property="al:web:should_fallback" content="true" />
```

### `archives`

歴史的に興味深い記録、文書、その他の資料のコレクションについて記述します（[出典](https://www.w3.org/TR/2011/WD-html5-20110113/links.html#rel-archives)）。

```jsx title="layout.js | page.js"
export const metadata = {
  archives: ['https://nextjs.org/13'],
}
```

```html title="<head> output" hideLineNumbers
<link rel="archives" href="https://nextjs.org/13" />
```

### `assets`

```jsx title="layout.js | page.js"
export const metadata = {
  assets: ['https://nextjs.org/assets'],
}
```

```html title="<head> output" hideLineNumbers
<link rel="assets" href="https://nextjs.org/assets" />
```

### `bookmarks`

```jsx title="layout.js | page.js"
export const metadata = {
  bookmarks: ['https://nextjs.org/13'],
}
```

```html title="<head> output" hideLineNumbers
<link rel="bookmarks" href="https://nextjs.org/13" />
```

### `category`

```jsx title="layout.js | page.js"
export const metadata = {
  category: 'technology',
}
```

```html title="<head> output" hideLineNumbers
<meta name="category" content="technology" />
```

### `other`

すべてのメタデータオプションは、ビルトインサポートでカバーされているはずです。しかし、あなたのサイトに固有のカスタムメタデータタグや、
リリースされたばかりの新しいメタデータタグがあるかもしれません。**other** オプションを使って、カスタムメタデータタグをレンダリングすることができます。

```jsx title="layout.js | page.js"
export const metadata = {
  other: {
    custom: 'meta',
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="custom" content="meta" />
```

複数の同じキーのメタタグを生成したい場合は、配列値を使用することができます。

```jsx title="layout.js | page.js"
export const metadata = {
  other: {
    custom: ['meta1', 'meta2'],
  },
}
```

```html title="<head> output" hideLineNumbers
<meta name="custom" content="meta1" /> <meta name="custom" content="meta2" />
```

## サポートされていないメタデータ

以下のメタデータタイプは現在、ビルトインサポートされていません。しかし、レイアウトやページ自体でレンダリングすることはできます。

| メタデータ                    | 推奨                                                                                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<meta http-equiv="...">`     | [`redirect()`](/docs/app-router/api-reference/functions/redirect)、[Middleware](/docs/app-router/building-your-application/routing/middleware#nextresponse)、[セキュリティヘッダ](/docs/app-router/api-reference/next-config-js/headers)を経由して適切な HTTP ヘッダを使用します。 |
| `<base>`                      | タグをレイアウトまたはページ自体にレンダリングします。                                                                                                                                                                                                                             |
| `<noscript>`                  | タグをレイアウトまたはページ自体にレンダリングします。                                                                                                                                                                                                                             |
| `<style>`                     | Next.js のスタイリングについては[こちら](/docs/app-router/building-your-application/styling/css-modules)をご覧ください。                                                                                                                                                           |
| `<script>`                    | スクリプトの使い方については[こちら](/docs/app-router/building-your-application/optimizing/scripts)をご覧ください。                                                                                                                                                                |
| `<link rel="stylesheet" />`   | レイアウトやページ自体にスタイルシートを直接 `import` します。                                                                                                                                                                                                                     |
| `<link rel="preload />`       | [ReactDOM の preload メソッド](#link-relpreload)を使用します。                                                                                                                                                                                                                     |
| `<link rel="preconnect" />`   | [ReactDOM の preconnect メソッド](#link-relpreconnect) を使用します。                                                                                                                                                                                                              |
| `<link rel="dns-prefetch" />` | [ReactDOM の prefetchDNS メソッド](#link-reldns-prefetch) を使用します。                                                                                                                                                                                                           |

### リソースのヒント

`<link>` 要素には、外部リソースが必要であることをブラウザに示唆するために使用できる `rel` キーワードがいくつかあります。
ブラウザはこの情報を使って、キーワードに応じたプリロードの最適化を行います。

Metadata API はこれらのヒントを直接サポートしていませんが、[ReactDOM の新しいメソッド](https://github.com/facebook/react/pull/26237)を使用することで、それらをドキュメントの `<head>` に安全に挿入することができます。

```tsx title="app/preload-resources.tsx"
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return null
}
```

##### `<link rel="preload">`

ページレンダリング（ブラウザ）のライフサイクルの早い段階でリソースのロードを開始します。MDN ドキュメントは[こちら](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preload)です。

```tsx
ReactDOM.preload(href: string, options: { as: string })
```

```html title="<head> output" hideLineNumbers
<link rel="preload" href="..." as="..." />
```

##### `<link rel="preconnect">`

オリジンへの接続を先行して開始します。MDN ドキュメントは[こちら](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preconnect)です。

```tsx
ReactDOM.preconnect(href: string, options?: { crossOrigin?: string })
```

```html title="<head> output" hideLineNumbers
<link rel="preconnect" href="..." crossorigin />
```

##### `<link rel="dns-prefetch">`

リソースがリクエストされる前にドメイン名の解決を試みます。MDN ドキュメントは[こちら](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/dns-prefetch)です。

```tsx
ReactDOM.prefetchDNS(href: string)
```

```html title="<head> output" hideLineNumbers
<link rel="dns-prefetch" href="..." />
```

> **Good to know**:
>
> - これらのメソッドは現在、Client Components でのみサポートされており、最初のページロード時にサーバーサイドレンダリングが行われます。
> - `next/font`、`next/image`、`next/script` などの Next.js の組み込み機能は、関連するリソースヒントを自動的に処理します。
> - React 18.3 には、`ReactDOM.preload`、`ReactDOM.preconnect`、`ReactDOM.preconnectDNS` の型定義はまだ含まれていません。型エラーを回避するための一時的な解決策として、`// @ts-ignore` を使用できます。

## Types

`Metadata` 型を使用することで、メタデータに型安全性を追加することができます。
IDEに[組み込まれている TypeScript プラグイン](/docs/app-router/building-your-application/configuring/typescript)を使用している場合は手動で型を追加する必要はありませんが、必要であれば明示的に追加することもできます。

### `metadata` オブジェクト

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}
```

### `generateMetadata` 関数

#### Regular function

```tsx
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Next.js',
  }
}
```

#### Async function

```tsx
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

#### With segment props

```tsx
import type { Metadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateMetadata({ params, searchParams }: Props): Metadata {
  return {
    title: 'Next.js',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

#### With parent metadata

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

#### JavaScript Projects

JavaScriptプロジェクトでは、JSDoc を使って型安全性を追加することができます。

```js
/** @type {import("next").Metadata} */
export const metadata = {
  title: 'Next.js',
}
```

## バージョン履歴

| Version   | Changes                                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.2.0` | `viewport` と `themeColor`、`colorScheme` は [`viewport` configuration](/docs/app-router/api-reference/functions/generate-viewport) に取って代わられ、非推奨となりました。 |
| `v13.2.0` | `metadata` と `generateMetadata` が導入されました。                                                                                                                        |
