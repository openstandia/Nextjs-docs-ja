---
title: usePathname
description: API Reference for the usePathname hook.
---

`usePathname`は、現在の URL のパス名を読み取るための**Client Component**のフックです。

```tsx title="app/example-client-component.tsx"
'use client'

import { usePathname } from 'next/navigation'

export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>Current pathname: {pathname}</p>
}
```

`usePathname`は、[Client Component](/docs/app-router/building-your-application/rendering/client-components)の使用を必要としています。重要なことですが、Client Components は非最適化ではないことを強調しておきたいです。Client Components は、[Server Components](/docs/app-router/building-your-application/rendering/server-components)アーキテクチャの不可欠な要素です。

例えば、`usePathname`を持つ Client Component は、初回のページ読み込み時に HTML としてレンダリングされます。新しいルートに移動するとき、このコンポーネントを再度取得する必要はありません。代わりに、コンポーネントは一度だけダウンロードされ（クライアントの JavaScript バンドル内）、現在の状態に基づいて再レンダリングされます。

> **Good to know**:
>
> - [Server Component](/docs/app-router/building-your-application/rendering/server-components)から現在の URL を読み取ることはサポートされていません。この設計は、ページナビゲーションをまたいでもレイアウト状態が保持されるようにするための意図的なものです。
> - 互換モード：
>   - `usePathname`は、[fallback route](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true)がレンダリングされている場合、または Next.js によって`pages`ディレクトリのページが[automatically statically optimized](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)されており、Router が準備できていない場合に`null`を返すことがあります。
>   - Next.js は、プロジェクトに`app`と`pages`の両方のディレクトリがあることを検出すると、自動的にタイプを更新します。

## Parameters

```tsx
const pathname = usePathname()
```

`usePathname`はパラメータを受け取りません。

## Returns

`usePathname`は、現在の URL のパス名の文字列を返す。例えば：

| URL                 | Returned value        |
| ------------------- | --------------------- |
| `/`                 | `'/'`                 |
| `/dashboard`        | `'/dashboard'`        |
| `/dashboard?v=2`    | `'/dashboard'`        |
| `/blog/hello-world` | `'/blog/hello-world'` |

## 例

### ルート変更に応じて処理を実施する

```tsx title="app/example-client-component.tsx"
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // Do something here...
  }, [pathname, searchParams])
}
```

| Version   | Changes            |
| --------- | ------------------ |
| `v13.0.0` | `usePathname` 導入 |
