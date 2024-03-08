---
title: データのフェッチ、キャッシュ、再検証
description: Next.jsアプリケーションでデータを取得する方法を学びましょう。
---

データ取得は、あらゆるアプリケーションの中核をなす部分です。このページでは、React と Next.js でデータをフェッチ、キャッシュ、再検証する方法について説明します。

データをフェッチする方法は 4 つあります：

<!-- no toc -->

1. [`fetch`を使用したサーバー上でのデータフェッチ](#fetchを使用したサーバー上でのデータフェッチ)
2. [サードパーティライブラリを使用したサーバー上でのデータフェッチ](#サードパーティライブラリを使用したサーバー上でのデータフェッチ)
3. [ルートハンドラを介したクライアント上でのデータフェッチ](#ルートハンドラを介したクライアント上でのデータフェッチ)
4. [サードパーティライブラリを使用したクライアント上でのデータフェッチ](#サードパーティライブラリを使用したクライアント上でのデータフェッチ)

## `fetch`を使用したサーバー上でのデータフェッチ

Next.js はネイティブの[`fetch` Web API](https://developer.mozilla.org/docs/Web/API/Fetch_API)を拡張し、サーバー上の各 fetch リクエストに対する[キャッシュ](#データのキャッシュ)と[再検証](#データの再検証)の動作を設定できるようになりました。React は`fetch`を拡張して、React コンポーネントツリーのレンダリング中にフェッチリクエストを自動的に[メモ](/docs/app-router/building-your-application/data-fetching/patterns#必要な場所でデータをフェッチする)します。

`async/await`を使用した Server Components、[Route ハンドラ](/docs/app-router/building-your-application/routing/route-handlers)および[Server Actions](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations)で`fetch`を使用できます。

例：

```tsx title="app/page.tsx"
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // 返り値はシリアライズされない
  // Date, Map, Setを返すことができる

  if (!res.ok) {
    // 最も近い`error.js`エラーバウンダリが有効になる。
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <main></main>
}
```

> **Good to know**:
>
> - Next.js は、[`cookies`](/docs/app-router/api-reference/functions/cookies)や[`headers`](/docs/app-router/api-reference/functions/headers)など、サーバーコンポーネントのデータを取得する際に必要となる便利な関数を提供します。これらはリクエスト時刻の情報に依存するため、ルートが動的にレンダリングされます
> - Route ハンドラーは React コンポーネントツリーの一部ではないため、Route ハンドラーでは`fetch`リクエストはメモされません
> - TypeScript の Server Component で`async/await`を使用するには、TypeScript `5.1.3`以上と` @types/react` `18.2.8 `以上が必要です

### データのキャッシュ

キャッシュはデータを保存するので、リクエストのたびにデータソースから再フェッチする必要はありません。

デフォルトでは、Next.js は`fetch`で返された値をサーバー上の[データ・キャッシュ](/docs/app-router/building-your-application/caching)に自動的にキャッシュします。つまり、データはビルド時またはリクエスト時に`fetch`され、キャッシュされて各データリクエストで再利用されます。

```js
// 'force-cache'がデフォルトなので省略可能
fetch('https://...', { cache: 'force-cache' })
```

`POST`メソッドを使用する`fetch`リクエストも自動的にキャッシュされます。`POST`メソッドを使う[Route ハンドラ](/docs/app-router/building-your-application/routing/route-handlers)の内部でない限り、キャッシュされません。

> データ・キャッシュとは何ですか？
>
> データ・キャッシュは永続的な[HTTP キャッシュ](https://developer.mozilla.org/docs/Web/HTTP/Caching)です。プラットフォームによっては、キャッシュを自動的に拡張し、[複数のリージョンで共有する](https://vercel.com/docs/infrastructure/data-cache)ことができます。
>
> データ・キャッシュの詳細については、[こちら](/docs/app-router/building-your-application/caching#data-cache)を参照してください。

### データの再検証

再検証とは、データキャッシュを削除し、最新のデータを再取得するプロセスです。これは、データが変更され、最新の情報を確実に表示したい場合に使用します。

キャッシュされたデータは、2 つの方法で再検証できます：

- **時間ベースの再検証**：一定時間が経過したデータを自動的に再検証します。これは、変更頻度が低く、鮮度がそれほど重要でないデータに有効です
- **オンデマンドの再検証**：イベント（フォーム送信など）に基づいてデータを手動で再検証します。オンデマンド再検証では、タグベースまたはパスベースのアプローチを使用して、データのグループを一度に再検証できます。これは、最新のデータをできるだけ早く表示したい場合に便利です（ヘッドレス CMS のコンテンツが更新された場合など）

#### 時間ベースの再検証

時間間隔でデータを再検証するには、`fetch`の`next.revalidate`オプションを使用して、リソースのキャッシュ有効期間（秒）を設定します。

```js
fetch('https://...', { next: { revalidate: 3600 } })
```

あるいは、ルート Segment 内のすべての`fetch`リクエストを再検証するには、[セグメント設定オプション](/docs/app-router/api-reference/file-conventions/route-segment-config)を使用します。

```js title="layout.js / page.js"
export const revalidate = 3600 // １時間ごとに再検証
```

静的にレンダリングされたルートに複数の`fetch`リクエストがあり、それぞれに異なる再検証頻度が設定されている場合。もっとも低い時間がすべてのリクエストに使用されます。動的にレンダリングされるルートの場合、各`fetch`リクエストは個別に再検証されます。

時間ベースの再検証の詳細については、[こちら](/docs/app-router/building-your-application/caching#time-based-revalidation)を参照してください。

#### オンデマンドの再検証

データは、[Route Handler](/docs/app-router/building-your-application/routing/route-handlers) または [Server Actions](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations) 内のパス（[`revalidatePath`](/docs/app-router/api-reference/functions/revalidatePath)）またはキャッシュタグ（[`revalidateTag`](/docs/app-router/api-reference/functions/revalidateTag)）によってオンデマンドで再検証できます。

Next.js には、ルート間の`fetch`リクエストを無効にするためのキャッシュタグシステムがあります。

1. `fetch`を使用する場合、キャッシュエントリに 1 つ以上のタグを付けるオプションがあります
2. その後、`revalidateTag`を呼び出して、そのタグに関連付けられたすべてのエントリを再検証できます

たとえば、次の`fetch`リクエストはキャッシュ・タグ `collection`を追加します：

```tsx title="app/page.tsx"
export default async function Page() {
  const res = await fetch('https://...', { next: { tags: ['collection'] } })
  const data = await res.json()
  // ...
}
```

その後、Server Action で `revalidateTag` を呼び出すことで、`collection` でタグ付けされたこのフェッチ・コールを再検証できます：

```ts title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export default async function action() {
  revalidateTag('collection')
}
```

オンデマンドの再検証の詳細については、[こちら](/docs/app-router/building-your-application/caching#on-demand-revalidation)を参照してください。

#### エラーハンドリングと再検証

データの再検証を試みてエラーがスローされた場合、最後に正常に生成されたデータがキャッシュから引き続き提供されます。次のリクエストで、Next.js はデータの再検証を再試行します。

### データのキャッシュを停止する

`fetch`リクエストは以下のケースではキャッシュされません：

- `cache: 'no-store` が`fetch`リクエストに指定されている
- `revalidate: 0` オプションが個々の`fetch`リクエストに指定されている
- `fetch`リクエストがルートハンドラの`POST`メソッドで使用されている
- `fetch`リクエストが`header`または`cookies`の後で使用されている
- ルート Segment で`const dynamic = 'force-dynamic'`が指定されている
- ルート Segment の`fetchCache`オプションがデフォルトでキャッシュをしないように指定されている
- `fetch`リクエストで`Authorization`または`Cookie`ヘッダーが指定されていて、コンポーネントツリー上にキャッシュされていないリクエストがある

#### 個々の`fetch`リクエスト

個々の`fetch`リクエストに対してキャッシュを行わないようにするには、`fetch`のキャッシュ・オプションを`'no-store'`に設定します。これにより、リクエストごとに動的にデータがフェッチされます。

```ts title="layout.js | page.js"
fetch('https://...', { cache: 'no-store' })
```

利用可能なすべての`cache`オプションは、 [fetch API リファレンス](/docs/app-router/api-reference/functions/fetch)を参照してください。

#### 複数の`fetch`リクエスト

ルート Segment（Layout や Page など）に複数の`fetch`リクエストがある場合、[Segment 設定オプション](/docs/app-router/api-reference/file-conventions/route-segment-config)を使用して Segment 内のすべてのリクエストのキャッシュ動作を設定できます。

しかし、各取り込みリクエストのキャッシュ動作を個別に設定することをお勧めします。これにより、キャッシュ動作をより細かく制御することができます。

## サードパーティライブラリを使用したサーバー上でのデータフェッチ

<!-- textlint-disable -->

`fetch`をサポートまたは公開しないサードパーティライブラリ（データベース、CMS、ORM クライアントなど）を使用している場合は、[ルート Segment の設定オプション](/docs/app-router/api-reference/file-conventions/route-segment-config)と React の`cache`関数を使用して、これらのリクエストのキャッシュと再検証の動作を設定できます。

<!-- textlint-enable -->

データがキャッシュされるかどうかは、ルート Segment が静的にレンダリングされるか動的にレンダリングされるかに依存します。Segment が静的な場合（デフォルト）、リクエストの出力はキャッシュされ、ルート Segment の一部として再検証されます。Segment が動的な場合、リクエストの出力はキャッシュされず、Segment がレンダリングされる際、リクエストごとに再フェッチされます。

Experience 版の[unstable_cache API](/docs/app-router/api-reference/functions/unstable_cache)を使うこともできます。

### 例

下の例では

- React の`cache`関数は、データのリクエストを[メモ](/docs/app-router/building-your-application/caching#request-memoization)するために使用されます
- `revalidate`オプションは `layout.ts` と `page.ts` のセグメントで`3600`に設定されています。つまり、データはキャッシュされ、最大で 1 時間ごとに再検証されます

```ts title="app/utils.ts"
import { cache } from 'react'

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

`getItem`関数は 2 回呼び出されますが、データベースへの問い合わせは 1 回だけです。

```ts title="app/item/[id]/layout.tsx"
import { getItem } from '@/utils/get-item'

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Layout({
  params: { id },
}: {
  params: { id: string }
}) {
  const item = await getItem(id)
  // ...
}
```

```ts title="app/item/[id]/page.tsx"
import { getItem } from '@/utils/get-item'

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const item = await getItem(id)
  // ...
}
```

## ルートハンドラを介したクライアント上でのデータフェッチ

Client Components でデータを取得する必要がある場合、クライアントから[ルートハンドラ](/docs/app-router/building-your-application/routing/route-handlers)を呼び出すことができます。ルートハンドラはサーバー上で実行され、クライアントにデータを返します。これは、API トークンのような機密情報をクライアントへ公開したくない場合に便利です。

例については[ルート・ハンドラのドキュメント](/docs/app-router/building-your-application/routing/route-handlers)を参照してください。

> **Server Components とルートハンドラ**
>
> Server Components はサーバー上でレンダリングされるため、データを取得するために Server Component からルートハンドラを呼び出す必要はありません。代わりに、Server Component 内で直接データを取得できます。

## サードパーティライブラリを使用したクライアント上でのデータフェッチ

[SWR](https://swr.vercel.app/)や[React Query](https://tanstack.com/query/latest)のようなサードパーティ製のライブラリを使用して、クライアント上でデータをフェッチできます。これらのライブラリはリクエストをメモしたり、キャッシュしたり、再検証したり、データを変異させたりするための独自の API を提供しています。

> **将来の API**：
>
> `use`は React の関数で、関数から返されたプロミスを受け取って処理します。`fetch`を`use`でラップすることは、現在のところ Client Components では推奨されていません。`use`の詳細については[React RFC](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#usepromise)を参照してください。
