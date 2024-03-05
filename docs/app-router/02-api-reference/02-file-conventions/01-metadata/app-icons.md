---
title: favicon, icon, and apple-icon
description: Favicon、icon、および Apple icon ファイルの規則に関するAPIリファレンス。
sidebar_position: 1
---

`favicon`、`icon`、または`apple-icon`ファイル規約により、アプリケーションのアイコンを設定できます。

これらは、ウェブブラウザのタブ、電話のホーム画面、検索エンジンの検索結果のような場所に表示されるアプリアイコンを追加するのに便利です。

アプリアイコンを設定するには 2 つの方法があります：

<!-- no toc -->

- [画像ファイル（.ico、.jpg、.png）](#画像ファイルicojpgpng)
- [アイコンを生成するコードを使用する（.js、.ts、.tsx）](#アイコンを生成するコードを使用するjststsx)

## 画像ファイル（.ico、.jpg、.png）

画像ファイルを使ってアプリアイコンを設定するには、`/app`ディレクトリ内に`favicon`、`icon`、`apple-icon`の画像ファイルを配置します。`favicon`画像は`app/`のトップレベルにのみ配置できます。

Next.js はファイルを評価し、アプリの`<head>`要素に適切なタグを自動的に追加します。

| ファイル規約                | サポートするファイル形式                | 有効な場所 |
| --------------------------- | --------------------------------------- | ---------- |
| [`favicon`](#favicon)       | `.ico`                                  | `app/`     |
| [`icon`](#icon)             | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | `app/**/*` |
| [`apple-icon`](#apple-icon) | `.jpg`, `.jpeg`, `.png`                 | `app/**/*` |

### `favicon`

ルートの`/app`ルート Segment に`favicon.ico`画像ファイルを配置します。

```html title="<head>の出力"
<link rel="icon" href="/favicon.ico" sizes="any" />
```

### `icon`

`icon.(ico|jpg|jpeg|png|svg)`画像ファイルを配置します。

```html title="<head>の出力"
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

### `apple-icon`

`apple-icon.(jpg|jpeg|png)`画像ファイルを配置します。

```html title="<head>の出力"
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

> **Good to know**:
>
> - ファイル名に数字の接尾辞を付けることで、複数のアイコンを設定することができます。例えば、`icon1.png`、`icon2.png`など、番号の付いたファイルは辞書順にソートされます
> - Favicon は、ルートの`/app`セグメントにのみ設定できます。より詳細な設定が必要な場合は、[`icon`](#icon)を使うことができます
> - 適切な`<link>`タグと`rel`、`href`、`type`、`sizes`などの属性は、アイコンの種類と評価されたファイルのメタデータによって決まります
>   - 例えば、32×32px の`.png`ファイルは`type="image/png"`と`sizes="32x32"`の属性を持ちます
> - `sizes="any"`は、`.ico`アイコンが`.svg`よりも優先されるブラウザのバグを避けるために、`favicon.ico`の出力に追加されます

## アイコンを生成するコードを使用する（.js、.ts、.tsx）

[リテラル画像ファイル](#画像ファイルicojpgpng)を使用するだけでなく、コードからプログラムでアイコンを生成できます。

デフォルト関数をエクスポートする`icon`または`apple-icon`ルートを作成して、アプリアイコンを生成します。

| ファイル規約 | サポートするファイル形式 |
| :----------- | :----------------------- |
| `icon`       | `.js`, `.ts`, `.tsx`     |
| `apple-icon` | `.js`, `.ts`, `.tsx`     |

アイコンを生成するもっとも簡単な方法は、`next/server`の[ImageResponse API](/docs/app-router/api-reference/functions/image-response)を使用することです。

```tsx title="app/icon.tsx"
import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 画像生成
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponseのオプション
    {
      // 便宜上、エクスポートしたアイコンサイズのメタデータ設定を再利用して
      // ImageResponse の幅と高さも設定できます。
      ...size,
    }
  )
}
```

```html title="<head>の出力"
<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
```

> **Good to know**:
>
> - デフォルトでは、生成されたアイコンは、[動的関数](/docs/app-router/building-your-application/rendering/server-components#動的関数)またはキャッシュされていないデータを使用しない限り、[静的に最適化](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)されます（ビルド時に生成され、キャッシュされます）
> - [`generateImageMetadata`](/docs/app-router/api-reference/functions/generate-image-metadata)を使用して、同じファイルに複数のアイコンを生成できます
> - `favicon`アイコンは生成できません。代わりに[icon](#icon)または[favicon.ico](#favicon)ファイルを使用してください

## Props

デフォルトのエクスポート関数は、以下の props を受け取ります：

### `params`（任意）

`icon`または`apple-icon`がコロケートされているルート Segment から Segment の[動的なルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)オブジェクトを含むオブジェクトです。

```tsx title="app/shop/[slug]/icon.tsx"
export default function Icon({ params }: { params: { slug: string } }) {
  // ...
}
```

| ルート                          | URL         | `params`                  |
| :------------------------------ | :---------- | :------------------------ |
| `app/shop/icon.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/icon.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

## Returns

デフォルトのエクスポート関数は`Blob` | `ArrayBuffer` | `TypedArray` | `DataView` | `ReadableStream` | `Response`を返す必要があります。

> **Good to know**: `ImageResponse`は戻り値の型を満たします。

## 設定のエクスポート

`icon`または`apple-icon`ルートから`size`と`contentType`変数をエクスポートすることで、オプションでアイコンのメタデータを設定できます。

| オプション                    | 型                                                                                                                    |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| [`size`](#size)               | `{ width: number; height: number }`                                                                                   |
| [`contentType`](#contenttype) | `string` - [image MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

### `size`

```tsx title="icon.tsx / apple-icon.tsx"
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```html title="<head>の出力"
<link rel="icon" sizes="32x32" />
```

### `contentType`

```tsx title="icon.tsx / apple-icon.tsx"
export const contentType = 'image/png'

export default function Icon() {}
```

```html title="<head>の出力"
<link rel="icon" type="image/png" />
```

### Route Segment の設定

`icon`と`apple-icon`は、ページやレイアウトと同じ[ルート Segment の設定オプション](/docs/app-router/api-reference/file-conventions/route-segment-config)を使用できる、特殊な[ルートハンドラ](/docs/app-router/building-your-application/routing/route-handlers)です。

<!-- Todo: Fix links -->

| オプション                                                                                                | 型                                                                              | デフォルト |
| :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ | :--------- |
| [`dynamic`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamic)                 | <code>'auto' &#124; 'force-dynamic' &#124; 'error' &#124; 'force-static'</code> | `'auto'`   |
| [`revalidate`](/docs/app-router/api-reference/file-conventions/route-segment-config#revalidate)           | <code>false &#124; 'force-cache' &#124; 0 &#124; number</code>                  | `false`    |
| [`runtime`](/docs/app-router/api-reference/file-conventions/route-segment-config#runtime)                 | <code>'nodejs' &#124; 'edge'</code>                                             | `'nodejs'` |
| [`preferredRegion`](/docs/app-router/api-reference/file-conventions/route-segment-config#preferredregion) | <code>'auto' &#124; 'global' &#124; 'home' &#124; string &#124; string[]</code> | `'auto'`   |

```tsx title="app/icon.tsx"
export const runtime = 'edge'

export default function Icon() {}
```

## バージョン履歴

| Version   | Changes                            |
| :-------- | :--------------------------------- |
| `v13.3.0` | `favicon` `icon` `apple-icon` 導入 |
