---
title: useSearchParams
description: useSearchParams フックの API リファレンスです。
---

`useSearchParams`は、現在の URL の**クエリ文字列**を読み取るための**Client Component**のフックです。

`useSearchParams`は[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)インターフェースの**読み取り専用**バージョンを返します。

```tsx title="app/dashboard/search-bar.tsx"
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {search}</>
}
```

## Parameters

```tsx
const searchParams = useSearchParams()
```

`useSearchParams`はパラメータを受け取りません。

## Returns

`useSearchParams`は[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)インターフェースの**読み取り専用**バージョンを返し、これには、URL のクエリ文字列を読み取るためのユーティリティメソッドが含まれています。

- [`URLSearchParams.get()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get): クエリパラメータに関連付けられた最初の値を返します。例えば：

  | URL                  | `searchParams.get("a")`                                                                                                                |
  | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
  | `/dashboard?a=1`     | `'1'`                                                                                                                                  |
  | `/dashboard?a=`      | `''`                                                                                                                                   |
  | `/dashboard?b=3`     | `null`                                                                                                                                 |
  | `/dashboard?a=1&a=2` | `'1'` _- すべての値を取得するには [`getAll()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/getAll)を使用します。_ |

- [`URLSearchParams.has()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/has): 与えられたパラメータが存在するかどうかを示す真偽値を返します。例えば：

  | URL              | `searchParams.has("a")` |
  | ---------------- | ----------------------- |
  | `/dashboard?a=1` | `true`                  |
  | `/dashboard?b=3` | `false`                 |

- [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)のその他の**読み取り専用**メソッドについては、 [`getAll()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/getAll), [`keys()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/keys), [`values()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/values), [`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/entries), [`forEach()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/forEach) および [`toString()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/toString) を参照してください。

> **Good to know**:
>
> - `useSearchParams`は[Client Component](/docs/app-router/building-your-application/rendering/client-components)のフックであり、[部分レンダリング](/docs/app-router/building-your-application/routing#部分レンダリング)中に値が古くなるのを防ぐために、[Server Components](/docs/app-router/building-your-application/rendering/server-components)では**サポートされていません**。
> - アプリケーションが`/pages`ディレクトリを含む場合、`useSearchParams`は`ReadonlyURLSearchParams | null`を返します。`getServerSideProps`を使用していないページのプリレンダリング中にクエリパラメータを知ることができないためです。

## Behavior

### Static Rendering

ルートが[静的にレンダリング](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)される場合、`useSearchParams()`を呼び出すと、もっとも近い[サスペンス境界（Suspense boundary）](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#example)までのツリーがクライアント側でレンダリングされます。

これにより、ページの一部は静的にレンダリングされ、`searchParams`を使用する動的な部分はクライアント側でレンダリングされます。

`useSearchParams`を使用するコンポーネントを`サスペンス`境界（Suspense boundary）でラップすることで、クライアント側でレンダリングされるルート部分を減らすことができます。例えば：

```tsx title="app/dashboard/search-bar.tsx"
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // 静的レンダリングを使用している場合、これはサーバーで出力されません
  console.log(search)

  return <>Search: {search}</>
}
```

```tsx title="app/dashboard/page.tsx"
import { Suspense } from 'react'
import SearchBar from './search-bar'

// このコンポーネントは、サスペンス境界（Suspense boundary）にフォールバックとして渡され、初期HTMLでは検索バーの代わりにレンダリングされます
// Reactのハイドレーション中に値が利用可能になると、フォールバックは<SearchBar>コンポーネントに置き換えられます
function SearchBarFallback() {
  return <>placeholder</>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

### Dynamic Rendering

ルートが[動的にレンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)される場合、`useSearchParams`は Client Component の初回サーバーレンダリング時にサーバー上で利用可能になります。

> **Good to know**: [`動的ルートsegmentの設定オプション`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamic)を`force-dynamic`に設定することで、dynamic rendering を強制することができます。

例：

```tsx title="app/dashboard/search-bar.tsx"
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  // これは初回レンダリング時にサーバーでログとして出力され、その後のナビゲーションではクライアントで出力されます
  console.log(search)

  return <>Search: {search}</>
}
```

```tsx title="app/dashboard/page.tsx"
import SearchBar from './search-bar'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

### Server Components

#### Pages

[Pages](/docs/app-router/api-reference/file-conventions/page)（Server Components）でクエリパラメータにアクセスするには、[`searchParams`](/docs/app-router/api-reference/file-conventions/page#searchparams任意)プロップを使用します。

#### Layouts

Pages とは異なり、[Layouts](/docs/app-router/api-reference/file-conventions/layout)（Server Components）は`searchParams`プロップを**受け取りません**。これは、共有レイアウトが[ナビゲーション中に再レンダリングされない](/docs/app-router/building-your-application/routing#部分レンダリング)ため、ナビゲーション間で古い`searchParams`が表示される可能性があるためです。[詳しい説明](/docs/app-router/api-reference/file-conventions/layout#レイアウトはsearchparamsを受け取らない)を見る。

その代わりに、Page の[`searchParams`](/docs/app-router/api-reference/file-conventions/page)プロップ、または Client Component の[`useSearchParams`](/docs/app-router/api-reference/functions/use-search-params)フックを使用します。これらは、クライアント上で最新の`searchParams`と共に再レンダリングされます。

## 例

### `searchParams`の更新

新しい`searchParams`を設定するには、[`useRouter`](/docs/app-router/api-reference/functions/use-router)または[`Link`](/docs/app-router/api-reference/components/link)を使用します。ナビゲーションが実行された後、現在の[page.js](/docs/app-router/api-reference/file-conventions/page)は更新された[`searchParams` プロップ](/docs/app-router/api-reference/file-conventions/page#searchparams任意)を受け取ります。

```tsx title="app/example-client-component.tsx"
export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  // 現在のsearchParamsと提供されたキー/値のペアを結合して、新しいsearchParams文字列を取得します
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <p>Sort By</p>

      {/* useRouterを使用します */}
      <button
        onClick={() => {
          // <pathname>?sort=asc
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>

      {/* <Link>を使用します */}
      <Link
        href={
          // <pathname>?sort=desc
          pathname + '?' + createQueryString('sort', 'desc')
        }
      >
        DESC
      </Link>
    </>
  )
}
```

## Version 履歴

| Version   | Changes                |
| --------- | ---------------------- |
| `v13.0.0` | `useSearchParams` 導入 |
