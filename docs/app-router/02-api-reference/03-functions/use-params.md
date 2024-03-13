---
title: useParams
description: useParams フックのAPIリファレンスです。
---

`useParams`は**Client Component**のフックであり、現在の URL の[動的パラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)を読み取ることができます。

```tsx title="app/example-client-component.tsx"
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams()

  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return <></>
}
```

## Parameters

```tsx
const params = useParams()
```

`useParams`はパラメータを受け取りません。

## Returns

`useParams`は、現在のルートの[動的パラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)を含むオブジェクトを返します。

- オブジェクトの各プロパティはアクティブな動的 Segment です。
- プロパティ名は Segment の名前を示し、プロパティの値は該当の Segment に割り当てられた内容となります。
- プロパティの値は、[動的 Segment のタイプ](/docs/app-router/building-your-application/routing/dynamic-routes)に応じて、文字列か文字列の配列になります。
- ルートに動的パラメータが含まれていない場合、`useParams`は空のオブジェクトを返します。
- `pages`で使用された場合、`useParams`は`null`を返します。

例えば：

| Route                           | URL         | `useParams()`             |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/page.js`              | `/shop`     | `null`                    |
| `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

## Version 履歴

| Version   | Changes          |
| --------- | ---------------- |
| `v13.3.0` | `useParams` 導入 |
