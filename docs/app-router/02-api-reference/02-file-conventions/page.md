---
title: page.js
description: page.js ファイルの API リファレンスです。
sidebar_position: 8
---

**page**はルートに対して一意な UI です。

```tsx title="app/blog/[slug]/page.tsx"
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <h1>My Page</h1>
}
```

## Props

### `params`（任意）

ルート Segment からそのページまでの[動的なルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)を含むオブジェクト。例えば：

| 例                                   | URL         | `params`                       |
| ------------------------------------ | ----------- | ------------------------------ |
| `app/shop/[slug]/page.js`            | `/shop/1`   | `{ slug: '1' }`                |
| `app/shop/[category]/[item]/page.js` | `/shop/1/2` | `{ category: '1', item: '2' }` |
| `app/shop/[...slug]/page.js`         | `/shop/1/2` | `{ slug: ['1', '2'] }`         |

### `searchParams`（任意）

現在の URL の[検索パラメータ](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#parameters)を含むオブジェクト。例えば：

| URL             | `searchParams`       |
| --------------- | -------------------- |
| `/shop?a=1`     | `{ a: '1' }`         |
| `/shop?a=1&b=2` | `{ a: '1', b: '2' }` |
| `/shop?a=1&a=2` | `{ a: ['1', '2'] }`  |

> **Good to know**:

<!-- TODO: Fix links -->

> - `searchParams`は、事前に値を知ることができない[動的 API](/docs/app-router/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)です。これを使用すると、リクエスト時にページが[動的レンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)に移行します
> - `searchParams`は、`URLSearchParams`インスタンスではなく、プレーンな JavaScript オブジェクトを返します

## Version 履歴

| Version   | Changes     |
| --------- | ----------- |
| `v13.0.0` | `page` 導入 |
