---
title: useSelectedLayoutSegments
description: API Reference for the useSelectedLayoutSegments hook.
---

`useSelectedLayoutSegments`は**Client Component**のフックであり、呼び出されたレイアウト**以下**にあるアクティブなルート Segments を読み取ることができます。

これはパンくずリストのような、アクティブな子 Segments の情報が必要な親レイアウトの UI を作成するのに役立ちます。

```tsx title="app/example-client-component.tsx"
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()

  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

<!-- TODO: Fix link -->

> **Good to know**:
>
> - `useSelectedLayoutSegments`は[Client Component](/docs/app-router/building-your-application/rendering/client-components)のフックであり、レイアウトはデフォルトで[Server Components](/docs/app-router/building-your-application/rendering/server-components)であるため、`useSelectedLayoutSegments`は通常、レイアウトにインポートされた Client Component から呼び出されます。
> - 返される Segments には、UI に含めたくない[ルートグループ](/docs/app-router/building-your-application/routing/route-groups)が含まれる場合もあります。Segments から項目を削除するには、`filter()`メソッドを使用できます。

## Parameters

```tsx
const segments = useSelectedLayoutSegments(parallelRoutesKey?: string)
```

`useSelectedLayoutSegments`は*オプション*で[`parallelRoutesKey`](/docs/app-router/building-your-application/routing/parallel-routes#useselectedlayoutsegments)を受け取り、そのスロット内のアクティブなルート Segment を読み取ることができます。

## Returns

`useSelectedLayoutSegments`は、フックが呼び出されたレイアウトから 1 階層下のアクティブな Segments を含む文字列の配列を返します。存在しない場合は空の配列となります。

例えば、以下のレイアウトと URL が与えられた場合、返される Segments は次のとおりになります。

| Layout                    | Visited URL           | Returned Segments           |
| ------------------------- | --------------------- | --------------------------- |
| `app/layout.js`           | `/`                   | `[]`                        |
| `app/layout.js`           | `/dashboard`          | `['dashboard']`             |
| `app/layout.js`           | `/dashboard/settings` | `['dashboard', 'settings']` |
| `app/dashboard/layout.js` | `/dashboard`          | `[]`                        |
| `app/dashboard/layout.js` | `/dashboard/settings` | `['settings']`              |

## Version 履歴

| Version   | Changes                          |
| --------- | -------------------------------- |
| `v13.0.0` | `useSelectedLayoutSegments` 導入 |
