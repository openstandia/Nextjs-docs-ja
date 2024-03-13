---
title: 遅延ロード
description: アプリケーションの読み込みパフォーマンスを向上させるために、インポートされたライブラリとReactコンポーネントを遅延読み込みしてください。
---

Next.js の[遅延ロード](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)は、ルートのレンダリングに必要な JavaScript の量を減らすことで、アプリケーションの初期読み込みパフォーマンスを向上させます。

これにより、Client Component やインポートされたライブラリのロードを遅らせ、必要なときだけクライアントバンドルに含めることができます。たとえば、モーダルの読み込みをユーザーがクリックして開くまで遅らせたいとします。

Next.js で遅延ロードを実装するには 2 つの方法があります。

1. `next/dynamic`で[Dynamic Imports](#nextdynamic)を使用する
2. [Suspense](https://ja.react.dev/reference/react/Suspense)と[`React.lazy()`](https://ja.react.dev/reference/react/lazy)を使用する

デフォルトでは、Server Components は自動的に[コード分割](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting)され、[ストリーミング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)を使用してサーバーからクライアントに UI の断片を徐々に送信できます。遅延ロードは Client Components にも適用されます。

## `next/dynamic`

`next/dynamic`は`React.lazy()`と Suspense の合成です。`app`ディレクトリと`pages`ディレクトリで同じように動作し、インクリメンタルな移行を可能にします。

## 例

### Client Components のインポートする

```jsx title="app/page.js"
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Client Components:
const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })

export default function ClientComponentExample() {
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      {/* すぐにロードされるが、別にバンドルされる */}
      <ComponentA />

      {/* 条件に合致した場合のみ、オンデマンドでロードされる */}
      {showMore && <ComponentB />}
      <button onClick={() => setShowMore(!showMore)}>Toggle</button>

      {/* クライアントサイドのみでロードされる */}
      <ComponentC />
    </div>
  )
}
```

### SSR をスキップする

`React.lazy()`と Suspense を使用する場合、Client Components はデフォルトでプリレンダリング（SSR）されます。

Client Components のプリレンダリングを無効にしたい場合は、`ssr`オプションを`false`に設定してください：

```tsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

### Server Components をインポートする

Server Component を動的にインポートする場合、Server Component の子である Client Component のみが遅延ロードされます。

```jsx title="app/page.js"
import dynamic from 'next/dynamic'

// Server Component:
const ServerComponent = dynamic(() => import('../components/ServerComponent'))

export default function ServerComponentExample() {
  return (
    <div>
      <ServerComponent />
    </div>
  )
}
```

### 外部ライブラリを読み込む

外部ライブラリは、[`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)関数を使って必要に応じて読み込むことができます。この例では、ファジー検索に外部ライブラリ`fuse.js`を使用しています。このモジュールは、ユーザーが検索語句を入力した後にのみクライアントに読み込まれます。

```jsx title="app/page.js"
'use client'

import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // 動的にfuse.jsをロードする
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

### カスタムのローディング・コンポーネントを加える

```jsx title="app/page.js"
import dynamic from 'next/dynamic'

const WithCustomLoading = dynamic(
  () => import('../components/WithCustomLoading'),
  {
    loading: () => <p>Loading...</p>,
  }
)

export default function Page() {
  return (
    <div>
      {/* <WithCustomLoading/> をロードしている間、ローディング・コンポーネントがレンダリングされる */}
      <WithCustomLoading />
    </div>
  )
}
```

### named export をインポートする

named export を動的にインポートするには、[`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)関数が返す Promise からモジュールを返します：

```jsx title="components/hello.js"
'use client'

export function Hello() {
  return <p>Hello!</p>
}
```

```jsx title="app/page.js"
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```
