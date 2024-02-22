---
title: メタデータ
description: メタデータ API を使用して、任意のレイアウトやページでメタデータを定義します。
related:
  description: メタデータ API オプションをすべて表示します。
  links:
    - app-router/api-reference/functions/generate-metadata
    - app-router/api-reference/file-conventions/metadata
    - app-router/api-reference/functions/generate-viewport
---

Next.js には メタデータ API があり、アプリケーションのメタデータ（HTML `head`要素内の`meta`タグや`link`タグなど）を定義して、SEOやウェブ共有性を向上させることができます。

アプリケーションにメタデータを追加する方法は2つあります:

- **設定ベースメタデータ**: [静的なメタデータオブジェクト](/docs/app-router/api-reference/functions/generate-metadata#metadata-object)または動的な [generateMetadata 関数](/docs/app-router/api-reference/functions/generate-metadata#generatemetadata-function)を `layout.js` または `page.js` ファイルにエクスポートします。
- **ファイルベースのメタデータ**: ルートセグメントに静的または動的に生成された特殊ファイルを追加します。

これらのオプションを使用すると、Next.js はページの関連する `<head>` 要素を自動的に生成します。
また、[`ImageResponse`](/docs/app-router/api-reference/functions/image-response) コンストラクタを使って動的な OG 画像を作成することもできます。

## 静的メタデータ

静的メタデータを定義するには、`layout.js` または 静的な `page.js` ファイルから [メタデータオブジェクト](/docs/app-router/api-reference/functions/generate-metadata#metadata-object)をエクスポートします。

```tsx title="layout.tsx | page.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

利用可能なすべてのオプションについては、[API リファレンス](/docs/app-router/api-reference/functions/generate-metadata)を参照してください。

## 動的メタデータ

`generateMetadata` 関数を使用すると、動的な値を必要とするメタデータを `fetch` できます。

```tsx title="app/products/[id]/page.tsx"
import type { Metadata, ResolvingMetadata } from 'next'

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

利用可能なすべてのパラメータについては、[API リファレンス](/docs/app-router/api-reference/functions/generate-metadata)を参照してください。

> **Good to know**:
>
> - `generateMetadata` による静的および動的メタデータは、**Server Components でのみ** サポートされます。
> - `fetch` リクエストは、`generateMetadata`、`generateStaticParams`、Layouts、Pages、および Server Components 全体で同じデータに対して自動的に[メモ](/docs/app-router/building-your-application/caching#request-memoization)されます。`fetch` が利用できない場合は、React [キャッシュ](/docs/app-router/building-your-application/caching#request-memoization)を使用できます。
> - Next.js は、`generateMetadata` 内のデータ取得が完了するまで待ってから、UIをクライアントにストリーミングします。これにより、[ストリームされたレスポンス](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)の最初の部分に `<head>` タグが含まれることが保証されます。

## ファイルベースのメタデータ

これらの特別なファイルはメタデータに利用することができます:

- [favicon.ico, apple-icon.jpg, and icon.jpg](/docs/app-router/api-reference/file-conventions/metadata/app-icons)
- [opengraph-image.jpg and twitter-image.jpg](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image)
- [robots.txt](/docs/app-router/api-reference/file-conventions/metadata/robots)
- [sitemap.xml](/docs/app-router/api-reference/file-conventions/metadata/sitemap)

これらのファイルは静的なメタデータとして使用することもでき、コードを使ってプログラムで生成することもできます。

実装と例については、[メタデータファイル](/docs/app-router/api-reference/file-conventions/metadata) API リファレンス と [動的な画像生成](#動的な画像生成) を参照してください。

## Behavior

ファイルベースのメタデータの方が優先順位が高く、設定ベースのメタデータよりも優先されます。

### デフォルトフィールド

ルートがメタデータを定義していない場合でも、常に追加されるデフォルトの `meta` タグが 2 つあります:

- [meta charset タグ](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset)は、ウェブサイトの文字エンコーディングを設定します。
- [meta viewport タグ](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)は、ウェブサイトのビューポート幅とスケールを設定し、異なるデバイス用に調整します。

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

> **Good to know**: デフォルトの [`viewport`](/docs/app-router/api-reference/functions/generate-metadata#viewport) meta タグを上書きすることができます。

### 順序

メタデータは、ルートセグメントから最後の `page.js` セグメントに最も近いセグメントまで、順番に評価されます。例えば以下の通りです。

1. `app/layout.tsx` (ルートレイアウト)
2. `app/blog/layout.tsx` (ネストされたブログレイアウト)
3. `app/blog/[slug]/page.tsx` (ブログページ)

### マージ

[評価順序](#順序)に従って、同じルート内の複数のセグメントからエクスポートされたメタデータオブジェクトが **浅く** マージされ、ルートの最終的なメタデータ出力が形成されます。重複するキーは、その順序に基づいて **置き換えられます**。

つまり、以前のセグメントで定義された　[`openGraph`](/docs/app-router/api-reference/functions/generate-metadata#opengraph) や [`robots`](/docs/app-router/api-reference/functions/generate-metadata#robots) のようなネストしたフィールドを持つメタデータは、それらを定義した最後のセグメントによって **上書き** されます。

#### フィールドの上書き

```jsx title="app/layout.js"
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx title="app/blog/page.js"
export const metadata = {
  title: 'Blog',
  openGraph: {
    title: 'Blog',
  },
}

// Output:
// <title>Blog</title>
// <meta property="og:title" content="Blog" />
```

上の例では:

- `app/layout.js` の `title` は、`app/blog/page.js` の `title` に **置き換えられます**。
- `app/layout.js` の `openGraph` フィールドはすべて `app/blog/page.js` で**置き換えられます**。なぜなら、`app/blog/page.js` は `openGraph` メタデータを設定するためです。`openGraph.description` がないことに注意してください。

ネストしたフィールドをセグメント間で共有し、一部のフィールドは上書きしたい場合は、別の変数に取り出します:

```jsx title="app/shared-metadata.js"
export const openGraphImage = { images: ['http://...'] }
```

```jsx title="app/page.js"
import { openGraphImage } from './shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'Home',
  },
}
```

```jsx title="app/about/page.js"
import { openGraphImage } from '../shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'About',
  },
}
```

上の例では、OG 画像は `app/layout.js` と `app/about/page.js` で共有されているが、タイトルは異なっています。

#### フィールドの継承

```jsx title="app/layout.js"
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx title="app/about/page.js"
export const metadata = {
  title: 'About',
}

// Output:
// <title>About</title>
// <meta property="og:title" content="Acme" />
// <meta property="og:description" content="Acme is a..." />
```

**注**

- `app/layout.js` の `title` は、`app/about/page.js` の `title` に **置き換えられます**。
- `app/about/page.js` は `openGraph` メタデータを設定しないため、`app/layout.js` の `openGraph` フィールドはすべて `app/about/page.js` に **継承されます**。

## 動的な画像生成

`ImageResponse` コンストラクタを使用すると、JSX と CSS を使用して動的な画像を生成できます。
これは、Open Graph 画像や Twitter カードなどのソーシャルメディア画像を作成する際に便利です。

`ImageResponse` は [Edge Runtime](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes#edge-runtime) を使用しており、Next.js はエッジでキャッシュされた画像に正しいヘッダーを自動的に追加するため、パフォーマンスの向上と再計算の削減に役立ちます。

これを使用するには、`next/og` から `ImageResponse` をインポートします:

```jsx title="app/about/route.js"
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  )
}
```

`ImageResponse` は、[Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) やファイルベースのメタデータなど、他の Next.js API とうまく統合できます。たとえば、`opengraph-image.tsx` ファイルで `ImageResponse` を使用すると、ビルド時にOpen Graph画像を生成したり、リクエスト時に動的に生成したりできます。

`ImageResponse` は、フレックスボックスや絶対配置、カスタムフォント、テキストラッピング、センタリング、ネストされた画像など、一般的なCSSプロパティをサポートしています。[サポートされているCSSプロパティの完全なリスト](/docs/app-router/api-reference/functions/image-response)を参照してください。

> **Good to know**:
>
> - [Vercel OG Playground](https://og-playground.vercel.app/)に例があります。
> - `ImageResponse` は [@vercel/og](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation) や [Satori](https://github.com/vercel/satori)、Resvg を使ってHTMLとCSSをPNGに変換します。
> - Edge Runtime のみがサポートされています。デフォルトのNode.js Runtime は動作しません。
> - フレックスボックスとCSSプロパティのサブセットのみがサポートされています。高度なレイアウト（`display: grid`など）は動作しません。
> - 最大バンドルサイズは `500KB` です。バンドルサイズには、JSX、CSS、フォント、画像、その他のアセットが含まれます。制限を超える場合は、アセットのサイズを小さくするか、実行時に取得することを検討してください。
> - `ttf`、`otf`、`woff` フォント形式のみに対応しています。フォントの解析速度を最大にするため、`woff` よりも `ttf` または `otf` が優先されます。

## JSON-LD

[JSON-LD](https://json-ld.org/) は、検索エンジンがコンテンツを理解するために使用できる構造化データのフォーマットです。例えば、人、イベント、組織、映画、本、レシピ、その他多くのタイプのエンティティを記述するために使用することができます。

JSON-LD に関して、`layout.js` または `page.js` コンポーネントの`<script>`タグとして構造化データをレンダリングすることを推奨します。例えば:

```tsx title="app/products/[id]/page.tsx"
export default async function Page({ params }) {
  const product = await getProduct(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... */}
    </section>
  )
}
```

Google の[リッチリザルトテスト](https://search.google.com/test/rich-results)や一般的な [Schema Markup Validator](https://validator.schema.org/) で構造化データを検証し、テストすることができます。

[`Schema-dts`](https://www.npmjs.com/package/schema-dts) のようなコミュニティパッケージを使えば、TypeScript で JSON-LD をタイプすることができます:

```tsx
import { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Next.js Sticker',
  image: 'https://nextjs.org/imgs/sticker.png',
  description: 'Dynamic at the speed of static.',
}
```
