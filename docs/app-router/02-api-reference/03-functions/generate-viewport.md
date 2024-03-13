---
title: generateViewport
description: generateViewport 関数の API リファレンスです。
related:
  title: 次のステップ
  description: Metadata APIオプションをすべて表示する
  links:
    - app-router/api-reference/file-conventions/metadata
    - app-router/building-your-application/optimizing/metadata
---

ページの初期ビューポートは、静的な `viewport` オブジェクトか、動的な `generateViewport` 関数でカスタマイズできます。

> **Good to know**:
>
> - `viewport` オブジェクトと `generateViewport` 関数のエクスポートは、**Server Components でのみ** サポートされています。
> - 同じルートセグメントから `viewport` オブジェクトと `generateViewport` 関数の両方をエクスポートすることはできません。
> - `metadata` のエクスポートを移行している場合は、[metadata-to-viewport-export codemod](/docs/app-router/building-your-application/upgrading/codemods#metadata-to-viewport-export)を使用して変更を更新できます。

## `viewport` オブジェクト

ビューポートのオプションを定義するには、`layout.jsx` または `page.jsx` ファイルから `viewport` オブジェクトをエクスポートします。

```tsx title="layout.tsx | page.tsx"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function Page() {}
```

## `generateViewport` 関数

`generateViewport` は 1 つ以上のビューポートフィールドを含む [`Viewport` オブジェクト](#ビューポートフィールド)を返すべきです。

```tsx title="layout.tsx | page.tsx"
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  }
}
```

> **Good to know**:
>
> - ビューポートがランタイム情報に依存しない場合は、`generateMetadata` ではなく、静的な [`viewport` オブジェクト](#viewport-オブジェクト)を使用して定義する必要があります。

## ビューポートフィールド

### `themeColor`

`theme-color` についてもっと知りたい場合は[こちら](https://developer.mozilla.org/docs/Web/HTML/Element/meta/name/theme-color)です。

**シンプルなテーマカラー**

```tsx title="layout.tsx | page.tsx"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

```html title="<head> output" hideLineNumbers
<meta name="theme-color" content="black" />
```

**メディア属性付き**

```tsx title="layout.tsx | page.tsx"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

```html title="<head> output" hideLineNumbers
<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

### `width`、`initialScale`、`maximumScale` と `userScalable`

> **Good to know**: `viewport` metaタグは、以下のデフォルト値で自動的に設定されます。通常、デフォルト値で十分であるため、手動で設定する必要はありません。しかし、完全を期すために情報を提供します。

```tsx title="layout.tsx | page.tsx"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}
```

```html title="<head> output" hideLineNumbers
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>
```

### `colorScheme`

`color-scheme` についてもっと知りたい場合は[こちら](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#:~:text=color%2Dscheme%3A%20specifies,of%20the%20following%3A)です。

```tsx title="layout.tsx | page.tsx"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  colorScheme: 'dark',
}
```

```html title="<head> output" hideLineNumbers
<meta name="color-scheme" content="dark" />
```

## 型

`Viewport` 型を使用することで、ビューポートオブジェクトに型安全性を追加できます。
IDEに[組み込まれている TypeScript プラグイン](/docs/app-router/building-your-application/configuring/typescript)を使用している場合は、手動で型を追加する必要はありませんが、必要であれば明示的に追加することもできます。

### `viewport` オブジェクト

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

### `generateViewport` 関数

#### 基本的な使い方

```tsx
import type { Viewport } from 'next'

export function generateViewport(): Viewport {
  return {
    themeColor: 'black',
  }
}
```

#### segment props 付き

```tsx
import type { Viewport } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateViewport({ params, searchParams }: Props): Viewport {
  return {
    themeColor: 'black',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

#### JavaScript プロジェクト

JavaScript プロジェクトでは、JSDoc を使って型安全性を追加することができます。

```js
/** @type {import("next").Viewport} */
export const viewport = {
  themeColor: 'black',
}
```

## バージョン履歴

| Version   | Changes                                             |
| --------- | --------------------------------------------------- |
| `v14.0.0` | `viewport` と `generateViewport` が導入されました。 |
