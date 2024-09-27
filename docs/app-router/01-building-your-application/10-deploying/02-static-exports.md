---
title: 静的エクスポート
description: Next.js は、静的サイトまたはシングルページアプリケーション（SPA）として開始し、その後オプションでサーバーを必要とする機能を使用するようにアップグレードすることができます。
---

Next.js は、静的サイトまたはシングルページアプリケーション（SPA）として開始し、その後オプションでサーバーを必要とする機能を使用するようにアップグレードすることができます。

`next build` を実行すると、Next.js はルートごとに HTML ファイルを生成します。Next.js は、厳密な SPA を個別の HTML ファイルに分割することで、クライアントサイドでの不要な JavaScript コードの読み込みを回避し、バンドルサイズを小さくしてページ読み込みを高速化します。

Next.js はこの静的エクスポートをサポートしているため、HTML/CSS/JS の静的アセットを提供できるウェブサーバーであればどこにでもデプロイしてホストすることができます。

## 構成

静的エクスポートを有効にするには、`next.config.js` 内で `output` モードを変更します:

```js title="next.config.js" highlight={5}
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}

module.exports = nextConfig
```

`next build` を実行すると、Next.js はアプリケーションの HTML/CSS/JS アセットを含む `out` フォルダを生成します。

## サポートされている機能

Next.js のコア機能は、静的エクスポートをサポートするように設計されています。

### Server Components

静的エクスポートを生成するために `next build` を実行すると、従来の静的サイト生成と同様に、`app` ディレクトリ内で記述された `Server Components` がビルド中に実行されます。

生成されたコンポーネントは、最初のページロード用に静的な HTML にレンダリングされ、ルート間のクライアントナビゲーション用に静的なペイロードになります。静的エクスポートを使用する場合、[動的なサーバ関数](#サポートされていない機能)を使用しない限り、サーバコンポーネントに変更は必要ありません。

```tsx title="app/page.tsx"
export default async function Page() {
  // This fetch will run on the server during `next build`
  const res = await fetch('https://api.example.com/...')
  const data = await res.json()

  return <main>...</main>
}
```

### Client Components

クライアントでデータ取得を行いたい場合は、[SWR](https://github.com/vercel/swr) でクライアントコンポーネントを使用してリクエストをメモ化することができます。

```tsx title="app/other/page.tsx"
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/1`,
    fetcher
  )
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'

  return data.title
}
```

ルート遷移はクライアントサイドで行われるため、これは従来の SPA のように動作します。たとえば、次のようなインデックスルートではクライアント上でさまざまな Post に移動することができます:

```tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <h1>Index Page</h1>
      <hr />
      <ul>
        <li>
          <Link href="/post/1">Post 1</Link>
        </li>
        <li>
          <Link href="/post/2">Post 2</Link>
        </li>
      </ul>
    </>
  )
}
```

### 画像最適化

`next/image` による[画像の最適化](/docs/app-router/building-your-application/optimizing/images)は、`next.config.js` でカスタム画像ローダーを定義することで、静的エクスポートで使用できます。たとえば、Cloudinary のようなサービスを使用して画像を最適化できます:

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}

module.exports = nextConfig
```

このカスタムローダーは、外部ソースから画像を取得する方法を定義します。例えば、以下のローダーは Cloudinary の URL を作成します:

```ts title="my-loader.ts"
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(
    ','
  )}${src}`
}
```

そして、アプリケーションで `next/image` を使い、Cloudinary の画像への相対パスを定義します:

```tsx title="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtles" src="/turtles.jpg" width={300} height={300} />
}
```

### Route Handlers

Route Handlers は、`next build` を実行するときに静的レスポンスをレンダリングします。`GET` HTTP メソッドのみがサポートされています。これは、キャッシュされたデータまたはキャッシュされていないデータから、静的な HTML、JSON、TXT、またはその他のファイルを生成するために使用できます。:

```ts title="app/data.json/route.ts"
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

上記の `app/data.json/route.ts` ファイルは、`next build` に静的ファイルにレンダリングされ、`{ name: 'Lee' }` を含む `data.json` を生成します。

受信リクエストから動的な値を読み取る必要がある場合、静的なエクスポートは使用できません。

### ブラウザ API

Client Components は `next build` 時に HTML にプリレンダリングされます。`window`、`localStorage`、`navigator` のような [Web API](https://developer.mozilla.org/docs/Web/API) はサーバー上では利用できないため、ブラウザで実行するときだけ、これらの API に安全にアクセスする必要があります。:

```jsx
'use client';

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    // You now have access to `window`
    console.log(window.innerHeight);
  }, [])

  return ...;
}
```

## サポートされていない機能

Node.js サーバーを必要とする機能や、ビルドプロセス中に計算できないダイナミックロジックはサポート**されていません**:

- `dynamicParams: true` を使った [Dynamic Routes](/docs/app-router/building-your-application/routing/dynamic-routes)
- `generateStaticParams()` が存在しない [Dynamic Routes](/docs/app-router/building-your-application/routing/dynamic-routes)
- リクエストに依存する [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers)
- [Cookies](/docs/app-router/api-reference/functions/cookies)
- [Rewrites](/docs/app-router/api-reference/next-config-js/rewrites)
- [Redirects](/docs/app-router/api-reference/next-config-js/redirects)
- [Headers](/docs/app-router/api-reference/next-config-js/headers)
- [Middleware](/docs/app-router/building-your-application/routing/middleware)
- [Incremental Static Regeneration](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)
- デフォルト `loader` による[画像最適化](/docs/app-router/building-your-application/optimizing/images)
- [Draft Mode](/docs/app-router/building-your-application/configuring/draft-mode)

これらの機能を `next dev` で使おうとすると、ルートレイアウトで [`dynamic`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamic) オプションを `error` に設定するのと同じように、エラーになります。

```jsx
export const dynamic = 'error'
```

## デプロイ

静的エクスポートにより、Next.js は、HTML/CSS/JS の静的アセットを提供できる任意の Web サーバーにデプロイしてホストできます。

`next build` を実行すると、Next.js は静的エクスポートを `out` フォルダに生成します。たとえば、次のようなルートがあるとします:

- `/`
- `/blog/[id]`

`next build` を実行すると、Next.js は次のファイルを生成します:

- `/out/index.html`
- `/out/404.html`
- `/out/blog/post-1.html`
- `/out/blog/post-2.html`

Nginx のような静的ホストを使用している場合、受信リクエストから正しいファイルへの書き換えを設定することができます:

```nginx title="nginx.conf"
server {
  listen 80;
  server_name acme.com;

  root /var/www/out;

  location / {
      try_files $uri $uri.html $uri/ =404;
  }

  # This is necessary when `trailingSlash: false`.
  # You can omit this when `trailingSlash: true`.
  location /blog/ {
      rewrite ^/blog/(.*)$ /blog/$1.html break;
  }

  error_page 404 /404.html;
  location = /404.html {
      internal;
  }
}
```

## Version History

| Version   | Changes                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `v14.0.0` | `next export` は削除され、`"output": "export"` に変更されました。                                                          |
| `v13.4.0` | App Router (Stable)では、React Server Components や Route Handler の使用など、静的エクスポートのサポートが強化されました。 |
| `v13.3.0` | `next export` は非推奨となり、`"output": "export"`に置き換えられました。                                                   |
