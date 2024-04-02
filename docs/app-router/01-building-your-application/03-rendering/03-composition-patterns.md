---
title: サーバーとクライアントの構成パターン
sidebar_label: 構成パターン
description: ServerとClientコンポーネントの使用のためのおすすめのパターン
---

React アプリケーションを構築する際には、アプリケーションのどの部分をサーバーとクライアントのどちらにレンダリングするかを検討する必要があります。このページでは、Server Component と Client Component を使用する際に推奨される構成パターンをいくつか取り上げます。

## Server Component と Client Component の使い分け

Server Component と Client Component の使用例を簡単にまとめました：

| 何をする必要があるか                                                                | Server Component | Client Component |
| :---------------------------------------------------------------------------------- | :--------------- | :--------------- |
| データフェッチ                                                                      | ✅               | ×                |
| バックエンドのリソースに（直接）アクセスする                                        | ✅               | ×                |
| 機密情報をサーバーに保管（アクセストークン、API キーなど）                          | ✅               | ×                |
| 大きな依存関係をサーバーに残す / クライアントサイドの JavaScript を減らす           | ✅               | ×                |
| インタラクティブ性とイベントリスナー（`onClick()`、`onChange()`など）を追加する     | ×                | ✅               |
| 状態とライフサイクル効果（`useState()`, `useReducer()`, `useEffect()`など）         | ×                | ✅               |
| ブラウザ専用の API を使用する                                                       | ×                | ✅               |
| 状態、エフェクト、またはブラウザ専用 API に依存するカスタムフックを使用する         | ×                | ✅               |
| [React クラス components](https://ja.react.dev/reference/react/Component)を使用する | ×                | ✅               |

## Server Component のパターン

クライアントサイド・レンダリングを選択する前に、データを取得したり、データベースやバックエンド・サービスにアクセスするなど、サーバー上で何らかの作業したい場合があります。

ここでは、Server Components を使用する際の一般的なパターンをいくつか紹介します：

### コンポーネント間のデータ共有

サーバーでデータを取得する際、異なるコンポーネント間でデータを共有したい場合があります。例えば、同じデータに依存するレイアウトとページがあるかもしれません。

<!-- textlint-disable -->

[React Context](https://ja.react.dev/learn/passing-data-deeply-with-context)（サーバーでは利用できない）を使用したり、props としてデータを渡す代わりに、[`fetch`](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating#fetchを使用したサーバー上でのデータフェッチ)や React の`cache`関数を使用することで、同じデータを必要とするコンポーネントで同じデータを取得でき、同じデータに対して重複したリクエストを行う心配はありません。これは、React が`fetch`を拡張してデータ要求を自動的にメモ化するようにしたためで、`fetch`が利用できない場合は`fetch`関数を使用できます。

<!-- textlint-enable -->

React のメモ化の詳細は[こちら](/docs/app-router/building-your-application/caching#request-memoization)を参照してください。

### サーバー専用のコードをクライアント環境に持ち込まない

JavaScript モジュールはサーバーとクライアントの両方のコンポーネントモジュールで共有できるため、サーバーだけで実行される予定のコードがクライアントにこっそり入り込む可能性があります。

例えば、次のようなデータ・フェッチ関数を考えてみましょう：

```ts title="lib/data.ts"
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

一見すると、`getData`はサーバーとクライアントの両方で動作するように見えます。しかし、この関数は`API_KEY`を含んでおり、サーバー上でのみ実行されることを想定して書かれています。

環境変数`API_KEY`は、`NEXT_PUBLIC`が先頭に付いていないため、サーバーでのみアクセス可能なプライベート変数です。環境変数がクライアントに漏れるのを防ぐため、Next.js はプライベート環境変数を空文字列に置き換えます。

その結果、`getData()`をインポートしてクライアント上で実行しても、期待通りに動作しません。また変数をパブリックにすればクライアント上で関数を動作させることができますが、機密情報をクライアントに公開したくない場合もあるでしょう。

<!-- textlint-disable -->

このような意図しないクライアントによるサーバーコードの利用を防ぐために、`server-only`パッケージを使用することで、他の開発者が誤ってこれらのモジュールを Client Component にインポートした場合、ビルド時にエラーを表示できます。

<!-- textlint-enable -->

`server-only`を使うには、まずパッケージをインストールします：

```bash title="Terminal"
npm install server-only
```

次に、サーバー専用のコードを含むモジュールに、このパッケージをインポートします：

```ts title="lib/data.ts"
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

これで、`getData()`をインポートした Client Component は、このモジュールはサーバー上でしか使用できないことを説明するビルド時エラーを受け取ることになります。

関連するパッケージとして`client-only`を使用すれば、クライアント専用のコード（例えば、`window`オブジェクトにアクセスするコード）を含むモジュールをマークするのに使うことができます。

### サードパーティーのパッケージとプロバイダーの使用

<!-- textlint-disable -->

Server Components は React の新機能であるため、エコシステム内のサードパーティのパッケージやプロバイダは、`useState`、`useEffect`、`createContext`のようなクライアントのみの機能を使用するコンポーネントに`"use client"`ディレクティブを追加し始めているところです。

<!-- textlint-enable -->

現在、クライアント専用の機能を使用する`npm`パッケージのコンポーネントの多くは、まだこのディレクティブを持っていません。これらのコンポーネントは、`"use client"`ディレクティブを持っていれば、Client Component 内では期待通りに動作しますが Server Component 内では動作しません。

例えば、`<Carousel />`コンポーネントを持つ架空の`acme-carousel`パッケージをインストールしたとします。このコンポーネントは`useState`を使いますが、まだ`"use client"`ディレクティブを持っていません。

このような場合、Client Component 内で`<Carousel />`を使用すれば、期待どおりに動作します：

```tsx title="app/gallery.tsx"
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>

      {/* Carousel は Client Component 内で使われているので動作する*/}
      {isOpen && <Carousel />}
    </div>
  )
}
```

しかし、これを Server Component 内で直接使用しようとすると、エラーが表示されます：

```tsx title="app/page.tsx"
import { Carousel } from 'acme-carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/* エラー： useState は Server Components で使用できない*/}
      <Carousel />
    </div>
  )
}
```

これは、Next.js は`<Carousel />`がクライアント専用の機能を使っていることを知らないためです。

この問題を解決するには、クライアント専用の機能に依存するサードパーティのコンポーネントを、独自の Client Component でラップします：

```tsx title="app/carousel.tsx"
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

これで、Server Component 内で`<Carousel />`を直接使用できるようになりました：

```tsx title="app/page.tsx"
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/* Carousel は Client Component なので動作する*/}
      <Carousel />
    </div>
  )
}
```

サードパーティのコンポーネントは Client Component の中で使うことが多いので、ラップする必要はないと考えています。しかしながら、プロバイダは例外です。というのも、React の状態とコンテキストに依存しており、通常はアプリケーションのルートで必要になるからです。[サードパーティのコンテキスト・プロバイダについては、以下を参照してください](#コンテキストプロバイダの使用)。

#### コンテキスト・プロバイダの使用

コンテキスト・プロバイダは通常、現在のテーマのようなグローバルな関心事を共有するために、アプリケーションのルート付近でレンダリングされます。[React コンテキスト](https://ja.react.dev/learn/passing-data-deeply-with-context)は Server Components ではサポートされていないため、アプリケーションのルートにコンテキストを作成しようとするとエラーになります：

```tsx title="app/layout.tsx"
import { createContext } from 'react'

// createContextはServer Componentsではサポートされていない
export const ThemeContext = createContext({})

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  )
}
```

これを解決するにはコンテキストを作成し、そのプロバイダを Client Component 内でレンダリングします：

```tsx title="app/theme-provider.tsx"
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

Server Component は、Client Component としてマークされているプロバイダを直接レンダリングできるようになります：

```tsx title="app/layout.tsx"
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

プロバイダがルートにレンダリングされると、アプリケーションの他のすべての Client Component がこのコンテキストを利用できるようになります。

> **Good to know**：プロバイダーは、ツリーのできるだけ深い部分にレンダリングしてください。`ThemeProvider`が`<html>`ドキュメント全体ではなく`{children}`だけをラップしていることに注目してください。これにより、Next.js は Server Component の静的な部分を最適化しやすくなります。

#### ライブラリ作者へのアドバイス

同様に、他の開発者が使用するパッケージを作成するライブラリの作者は、`"use client"`ディレクティブを使用して、パッケージのクライアント・エントリポイントをマークできます。これにより、パッケージの利用者は、ラッピング境界を作成することなく、パッケージのコンポーネントを直接 Server Component にインポートできます。

[ツリーの深い部分で`"use client"`を使用する](#クライアントのコンポーネントをツリーの下部に移動する)ことで、インポートしたモジュールを Server Components モジュールグラフの一部にでき、パッケージを最適化できます。

バンドラーによっては`"use client"`ディレクティブを削除する場合があります。`"use client"`ディレクティブを含めるように esbuild を設定する例は、[React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13)と[Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30)のリポジトリにあります。

## Client Components

### クライアントのコンポーネントをツリーの下部に移動する

クライアント JavaScript バンドルのサイズを小さくするには、Client Component をコンポーネントツリーの下部に移動することをお勧めします。

たとえば、静的な要素（ロゴ、リンクなど）を持つレイアウトと、状態を使用するインタラクティブな検索バーがあるとします。

<!-- textlint-disable -->

レイアウト全体を Client Component にするのではなく、インタラクティブなロジックを Client Component（例：`<SearchBar />`）へ移動しレイアウトは Server Component として維持します。これにより、レイアウトのすべてのコンポーネントの Javascript をクライアントへ送信する必要がなくなります。

<!-- textlint-enable -->

```tsx title="app/layout.tsx"
// SearchBarはClient Component
import SearchBar from './searchbar'
// LogoはServer Component
import Logo from './logo'

// LayoutはデフォルトでServer Component
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

### サーバーから Client Component への props の受け渡し（シリアライズ）

Server Component でデータを取得し、Client Component に prop としてデータを渡したい場合があります。Server から Client Component に渡される props は、React によって[シリアライズ可能](https://developer.mozilla.org/docs/Glossary/Serialization)である必要があります。

<!-- textlint-disable -->

Client Component がシリアライズ不可能なデータに依存している場合、[サードパーティライブラリを使用してクライアント上でデータを取得する](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating#サードパーティライブラリを使用したクライアント上でのデータフェッチ)か、[ルートハンドラー](/docs/app-router/building-your-application/routing/route-handlers)を使用してサーバー上でデータを取得できます。

<!-- textlint-enable -->

## Server Components と Client Components を混在させる

Client Components と Server Components を混在させる場合、UI をコンポーネントのツリーとして視覚化するとわかりやすいでしょう。Server Component である[ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)から始めて、`"use client"`ディレクティブを追加することで、コンポーネントの特定のサブツリーをクライアントでレンダリングできます。

これらクライアントのサブツリー内では、Server Components をネストしたり、Server Actions を呼び出したりできますが、以下の点に留意してください：

- リクエスト・レスポンスのライフサイクル中、コードはサーバーからクライアントへ移動します。クライアント上でサーバーのデータやリソースへアクセスする必要がある場合は、サーバーへ**新たに**リクエストすることになります
- 新しいリクエストがサーバーに送信されると、Client Component 内にネストされているものも含め、すべての Server Component が最初にレンダリングされます。レンダリング結果（RSC ペイロード）には、Client Component の位置への参照が含まれます。次に、クライアント上で React は RSC ペイロードを使用して、Server Components と Client Components を単一のツリーに調整します
<!-- textlint-disable -->
- Client Components は Server Components の後にレンダリングされるため、Server Component を Client Component モジュールにインポートできません（サーバーへの新しいリクエストが必要になるため）。その代わりに、Client Component に Server Component を props として渡すことができます。以下の[サポートされていないパターン](#未サポートのパターンserver-component-を-client-component-にインポートする)と[サポートされているパターン](#対応パターンserver-component-を-client-component-に-props-として渡す)のセクションを参照してください
<!-- textlint-enable -->

### 未サポートのパターン：Server Component を Client Component にインポートする

以下のパターンはサポートされていません。Server Component を Client Component にインポートできません：

```tsx title="app/client-component.tsx"
'use client'

// Server ComponentをClient Componentでインポートできない
// highlight-next-line
import ServerComponent from './Server-Component'

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      // highlight-next-line
      <ServerComponent />
    </>
  )
}
```

### 対応パターン：Server Component を Client Component に props として渡す

以下のパターンがサポートされています。Server Component を Client Component の prop として渡すことができます。

一般的なパターンは、React の`children` prop を使用して Client Component に「_スロット_」を作成することです。

以下の例では、`<ClientComponent>`は `children` prop を受け取ります：

```tsx title="app/client-component.tsx"
'use client'

import { useState } from 'react'

export default function ClientComponent({
  // highlight-next-line
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      // highlight-next-line
      {children}
    </>
  )
}
```

`<ClientComponent>`は、子コンポーネントが最終的に Server Component の結果によって埋められることを知りません。`<ClientComponent>`が負う唯一の責任は、最終的に子コンポーネントがどこに配置されるかを決定することです。

<!-- textlint-disable -->

親の Server Component では、`<ClientComponent>`と`<ServerComponent>`の両方をインポートして、`<ServerComponent>`を`<ClientComponent>`の子として渡すことができます：

<!-- textlint-enable -->

```tsx title="app/page.tsx"
// このパターンは動作する：
// Client ComponentのchildまたはpropとしてServer Componentを渡す
import ClientComponent from './client-component'
import ServerComponent from './server-component'

// Next.jsのPageはデフォルトでServer Components
export default function Page() {
  return (
    <ClientComponent>
      // highlight-next-line
      <ServerComponent />
    </ClientComponent>
  )
}
```

この方法では、`<ClientComponent>`と`<ServerComponent>`は切り離され、独立してレンダリングされます。この場合、子コンポーネントの`<ServerComponent>`は、`<ClientComponent>`がクライアントでレンダリングされる前に、サーバーでレンダリングされます。

> **Good to know**：
>
> - 親コンポーネントが再レンダリングする際に、ネストした子コンポーネントが再レンダリングされるのを避けるために「コンテンツを持ち上げる」パターンが使われていました
> - `children` prop に限定されるわけではありません。JSX を渡す、どのような prop でも使うことができます
