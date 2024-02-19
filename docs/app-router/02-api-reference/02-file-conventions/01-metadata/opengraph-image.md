---
title: opengraph-image and twitter-image
description: API Reference for the Open Graph Image and Twitter Image file conventions.
sidebar_position: 3
---

`opengraph-image`と`twitter-image`ファイル規約では、ルート Segment に Open Graph と Twitter の画像を設定できます。

ソーシャルネットワークやメッセージングアプリで、ユーザーがあなたのサイトへのリンクを共有したときに表示される画像を設定するのに便利です。

オープングラフとツイッターの画像を設定するには、2 つの方法があります：

<!-- no toc -->

- [画像ファイル（.jpg、.png、.gif）](#画像ファイルjpgpnggif)
- [アイコンを生成するコードを使用する（.js、.ts、.tsx）](#アイコンを生成するコードを使用するjststsx)

## 画像ファイル（.jpg、.png、.gif）

`opengraph-image`または`twitter-image`画像ファイルを Segment 内に配置することで、ルート Segment の共有画像を設定するために画像ファイルを使用します。

Next.js はそのファイルを評価し、アプリの`<head>`要素に適切なタグを自動的に追加します。

| ファイル規約                                    | サポートするファイル形式        |
| :---------------------------------------------- | :------------------------------ |
| [`opengraph-image`](#opengraph-image)           | `.jpg`, `.jpeg`, `.png`, `.gif` |
| [`twitter-image`](#twitter-image)               | `.jpg`, `.jpeg`, `.png`, `.gif` |
| [`opengraph-image.alt`](#opengraph-imagealttxt) | `.txt`                          |
| [`twitter-image.alt`](#twitter-imagealttxt)     | `.txt`                          |

### `opengraph-image`

`opengraph-image.(jpg|jpeg|png|gif)`という名前の画像ファイルをルート Segment に配置します。

```html title="<head>の出力"
<meta property="og:image" content="<generated>" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
```

### `twitter-image`

`twitter-image.(jpg|jpeg|png|gif)`という名前の画像ファイルをルート Segment に配置します。

```html title="<head>の出力"
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:type" content="<generated>" />
<meta name="twitter:image:width" content="<generated>" />
<meta name="twitter:image:height" content="<generated>" />
```

### `opengraph-image.alt.txt`

`opengraph-image.alt.txt`ファイルを`opengraph-image.(jpg|jpeg|png|gif)`イメージと同じルート Segment に配置し、alt テキストとして使用します。

```txt title="opengraph-image.alt.txt"
About Acme
```

```html title="<head>の出力"
<meta property="og:image:alt" content="About Acme" />
```

### `twitter-image.alt.txt`

`twitter-image.alt.txt`ファイルを`twitter-image.(jpg|jpeg|png|gif)`イメージと同じルート Segment に配置し、alt テキストとして使用します。

```txt title="twitter-image.alt.txt"
About Acme
```

```html title="<head>の出力"
<meta property="twitter:image:alt" content="About Acme" />
```

## アイコンを生成するコードを使用する（.js、.ts、.tsx）

[リテラルの画像ファイル](#画像ファイルjpgpnggif)を使うだけでなく、コードを使ってプログラムで画像を生成できます。

デフォルト関数をエクスポートする`opengraph-image`または`twitter-image`ルートを作成して、ルート segment の共有画像を生成します。

| ファイル規約      | サポートするファイル形式 |
| ----------------- | ------------------------ |
| `opengraph-image` | `.js`, `.ts`, `.tsx`     |
| `twitter-image`   | `.js`, `.ts`, `.tsx`     |

> **Good to know**
>
> - デフォルトでは、生成されたアイコンは、[動的関数](/docs/app-router/building-your-application/rendering/server-components#動的関数)またはキャッシュされていないデータを使用しない限り、[静的に最適化](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)されます（ビルド時に生成され、キャッシュされます）
> - [`generateImageMetadata`](/docs/app-router/api-reference/functions/generate-image-metadata)を使用して、同じファイルに複数のアイコンを生成できます

画像を生成するもっとも簡単な方法は、`next/server`の[ImageResponse API](/docs/app-router/api-reference/functions/image-response)を使用することです。

```tsx title="app/about/opengraph-image.tsx"
import { ImageResponse } from 'next/server'

// ルートSegmentの設定
export const runtime = 'edge'

// 画像のmetadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// 画像生成
export default async function Image() {
  // フォント
  const interSemiBold = fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    // ImageResponse options
    {
      // 便宜上、エクスポートされたopengraph-imageを再利用することができます
      // size設定を再利用して、ImageResponseの幅と高さを設定することができます。
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```html title="<head>の出力"
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Props

デフォルトのエクスポート関数は以下の引数を受け取ります：

#### `params`（任意）

`opengraph-image`または`twitter-image`がコロケートされているルート Segment から Segment の[動的なルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)オブジェクトを含むオブジェクトです。

```tsx title="app/shop/[slug]/opengraph-image.tsx"
export default function Image({ params }: { params: { slug: string } }) {
  // ...
}
```

| ルート                                     | URL         | `params`                  |
| :----------------------------------------- | :---------- | :------------------------ |
| `app/shop/opengraph-image.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/opengraph-image.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/opengraph-image.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/opengraph-image.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

### Returns

デフォルトのエクスポート関数は `Blob` | `ArrayBuffer` | `TypedArray` | `DataView` | `ReadableStream` | `Response`を返す必要があります。

> **Good to know**: `ImageResponse`は戻り値の型を満たします。

### 設定のエクスポート

`opengraph-image`または`twitter-image`ルートから`alt`、`size`と`contentType`変数をエクスポートすることで、オプションでアイコンのメタデータを設定できます。

| オプション                    | 型                                                                                                                    |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| [`alt`](#alt)                 | `string`                                                                                                              |
| [`size`](#size)               | `{ width: number; height: number }`                                                                                   |
| [`contentType`](#contenttype) | `string` - [image MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `alt`

```tsx title="opengraph-image.tsx / twitter-image.tsx"
export const alt = 'My images alt text'

export default function Image() {}
```

```html title="<head>の出力"
<meta property="og:image:alt" content="My images alt text" />
```

#### `size`

```tsx title="opengraph-image.tsx / twitter-image.tsx"
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```html title="<head>の出力"
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

#### `contentType`

```tsx title="opengraph-image.tsx / twitter-image.tsx"
export const contentType = 'image/png'

export default function Image() {}
```

```html title="<head>の出力"
<meta property="og:image:type" content="image/png" />
```

#### Route Segment の設定

`opengraph-image`と`twitter-image`は、ページやレイアウトと同じ[ルート Segment の設定オプション](/docs/app-router/api-reference/file-conventions/route-segment-config)を使用できる、特殊な[ルートハンドラ](/docs/app-router/building-your-application/routing/route-handlers)です。

| オプション                                                                                                | 型                                                       | デフォルト値 |
| :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- | :----------- |
| [`dynamic`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamic)                 | `'auto' \| 'force-dynamic' \| 'error' \| 'force-static'` | `'auto'`     |
| [`revalidate`](/docs/app-router/api-reference/file-conventions/route-segment-config#revalidate)           | `false \| 'force-cache' \| 0 \| number`                  | `false`      |
| [`runtime`](/docs/app-router/api-reference/file-conventions/route-segment-config#runtime)                 | `'nodejs' \| 'edge'`                                     | `'nodejs'`   |
| [`preferredRegion`](/docs/app-router/api-reference/file-conventions/route-segment-config#preferredregion) | `'auto' \| 'global' \| 'home' \| string \| string[]`     | `'auto'`     |

```tsx title="app/opengraph-image.tsx"
export const runtime = 'edge'

export default function Image() {}
```

### 例

#### 外部データの使用

この例では、`params`オブジェクトと外部データを使って画像を生成します。

> **Good to know**:
> デフォルトでは、生成された画像は[静的に最適化](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)されます。個々の`fetch`[オプション](/docs/app-router/api-reference/functions/fetch)やルートセグメント[オプション](/docs/app-router/api-reference/file-conventions/route-segment-config#revalidate)を設定することで、この挙動を変更できます。

```tsx title="app/posts/[slug]/opengraph-image.tsx"
import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://.../posts/${params.slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

## バージョン履歴

| Version   | Changes                                |
| :-------- | :------------------------------------- |
| `v13.3.0` | `opengraph-image` `twitter-image` 導入 |
