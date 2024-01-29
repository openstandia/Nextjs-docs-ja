---
title: Next.jsのキャッシング
nav_title: Next.jsのキャッシング
description: Next.jsアプリケーションをキャッシュするさまざまな方法を紹介します。
---

Next.js は、レンダリングやデータリクエストをキャッシュすることで、アプリケーションのパフォーマンスを向上させ、コストを削減します。このページでは、Next.js のキャッシュの仕組み、設定に使用できる API、およびそれらの相互作用について詳しく説明します。

> **Good to know**: このページは、Next.js がどのように動作しているかを理解するのに役立ちますが、Next.js で生産性を上げるために必須の知識ではありません。Next.js がキャッシュをするかどうか判断する際は、ほとんどが API の使用状況によって決定され、ゼロまたは最小限の設定で最高のパフォーマンスが得られるようにデフォルトが設定されています。

---

## 概要

ここでは、さまざまなキャッシングの仕組みとその目的について大まかに説明します：

| 仕組み                                      | 何を                   | 場所   | 目的                                                   | キャッシュ期間                       |
| ------------------------------------------- | ---------------------- | ------ | ------------------------------------------------------ | ------------------------------------ |
| [Request Memoization](#request-memoization) | 関数の返り値           | Server | React Component のツリーでデータを再利用する           | リクエストごとのライフサイクル       |
| [Data Cache](#data-cache)                   | データ                 | Server | ユーザーリクエストとデプロイメントをまたぐデータの保存 | 永続的（再検証可能）                 |
| [Full Route Cache](#full-route-cache)       | HTML と RSC ペイロード | Server | レンダリングコストの削減とパフォーマンスの向上         | 永続的（再検証可能）                 |
| [Router Cache](#router-cache)               | RSC ペイロード         | Client | ナビゲーション時のサーバーリクエストを減らす           | ユーザー・セッションまたは時間ベース |

デフォルトでは、Next.js はパフォーマンス向上とコスト削減のため、可能な限りキャッシュします。つまり、オプトアウトしない限り、ルートは静的にレンダリングされ、データリクエストはキャッシュされます。下の図はデフォルトのキャッシュ動作を示しています。ビルド時にルートが静的にレンダリングされるときと、静的ルートが最初にアクセスされるときです。

![Next.jsの4つのメカニズムにおけるデフォルトのキャッシュ動作を示す図です。ビルド時とルートが最初に訪問されたとき、HIT、MISS、SETが表示されます。](../../assets/caching-overview.avif)

キャッシュの動作は、ルートが静的にレンダリングされるか動的にレンダリングされるか、データがキャッシュされるかキャッシュされないか、リクエストが最初の訪問の一部であるか後続のナビゲーションであるかによって変わります。ユースケースに応じて、個々のルートとデータリクエストのキャッシュ動作を設定できます。

---

## リクエストのメモ化

React は[`fetch` API](#fetch)を拡張し、同じ URL とオプションを持つリクエストを自動的に**メモ化**します。つまり、React Component ツリー内の複数の場所で、同じデータに対する `fetch` 関数を呼び出すことができます。

![重複したフェッチリクエスト](../../assets/deduplicated-fetch-requests.avif)

例えば、ルート全体（レイアウト、ページ、複数のコンポーネントなど）で同じデータを使用する必要がある場合、ツリーの先頭でデータをフェッチし、コンポーネント間でプロップを転送する必要はありません。その代わりに、同じデータに対してネットワークを介して複数のリクエストを行うことによるパフォーマンスへの影響を心配することなく、それを必要とするコンポーネントでデータをフェッチできます。

```tsx title="app/example.tsx"
async function getItem() {
  // fetch 関数は自動的にメモ化され、結果はキャッシュされる
  const res = await fetch('https://.../item/1')
  return res.json()
}

// この関数は2回呼び出されるが、実行されるのは最初の1回だけである。
const item = await getItem() // cache MISS

// 2回目の呼び出しは、ルート上のどこでも可能である
const item = await getItem() // cache HIT
```

**リクエストのメモ化の仕組み**

![Reactのレンダリング中にフェッチのメモ化がどのように機能するかを示す図](../../assets/request-memoization.avif)

- ルートをレンダリングしている間、特定のリクエストが最初に呼び出されたとき、その結果はメモリになくキャッシュ `MISS` となる
- したがって、関数が実行され、データが外部ソースから取得され、結果がメモリに格納される
- 同じレンダリングパスのリクエストの後続の関数呼び出しはキャッシュ `HIT` となり、関数を実行せずにメモリからデータが返される
- ルートがレンダリングされ、レンダリングパスが完了すると、メモリは"リセット"され、すべてのリクエストのメモ化エントリはクリアされる

> **Good to know**:
>
> - リクエストのメモ化は React の機能であり、Next.js の機能ではない。他のキャッシュ機構とどのように相互作用するかを示すために、ここに含まれている
> - メモ化は `fetch` リクエストの `GET` メソッドにのみ適用される
>   - メモ化は React Component ツリーにのみ適用される：
>   - `generateMetadata`、`generateStaticParams`、Layouts、Pages、その他の Server Component の `fetch` リクエストに適用される。ルートハンドラは React コンポーネントツリーの一部ではないので、`fetch`リクエストには適用されない
> - `fetch`が適切でない場合（データベースクライアント、CMS クライアント、GraphQL クライアントなど）には、[React `cache` function](#react-cache-function) を使用して関数をメモすることができます

### キャッシュ期間

キャッシュは、サーバーリクエストの寿命と同様に React Component ツリーのレンダリングが完了するまで保持されます。

### 再検証

メモ化はサーバーリクエスト間で共有されることはなく、レンダリング中にのみ適用されるので再検証する必要はありません。

### オプトアウト

`fetch` リクエストのメモ化を無効にするには、 `AbortController` `signal` をリクエストに渡します。

```ts title="app/example.js"
const { signal } = new AbortController()
fetch(url, { signal })
```

## データ・キャッシュ

Next.js にはビルドインのデータ・キャッシュがあり、**受信するサーバーリクエスト**や**デプロイメント**にまたがってデータフェッチの結果を**永続化**します。これは、Next.js がネイティブの`fetch`API を拡張して、サーバー上の各リクエストが独自の永続キャッシュセマンティクスを設定できるようにしたためです。

> **Good to know**: ブラウザでは、`fetch`の`cache`オプションは、リクエストがブラウザの HTTP キャッシュとどのようにやりとりするかを示します。Next.js では、cache オプションは、サーバーサイドのリクエストがサーバー上のデータキャッシュとどのようにやりとりするかを示します。

**データ・キャッシュの仕組み**

![キャッシュされたfetchリクエストとキャッシュされていないfetchリクエストがデータ・キャッシュとどのように相互作用するかを示す図。キャッシュされたリクエストはデータ・キャッシュに保存され、メモ化されます。キャッシュされていないリクエストはデータソースからフェッチされ、データ・キャッシュには保存されず、メモ化されます。](../../assets/data-cache.avif)

- レンダリング中に`fetch`リクエストが最初に呼び出されると、Next.js はデータ・キャッシュにキャッシュされたレスポンスがないかチェックする
- キャッシュされたレスポンスが見つかれば、すぐに返され、メモ化される
- キャッシュされたレスポンスが見つからない場合は、データソースにリクエストが行われ、その結果がデータキャッシュに格納され、メモ化される
- キャッシュされていないデータ（例：`{ cache: 'no-store' }`）の場合、結果は常にデータソースから取得され、メモ化される
- データがキャッシュされていてもキャッシュされていなくても、リクエストは常にメモ化され、React レンダーパスの間に同じデータに対して重複したリクエストが行われるのを防ぐ

> **データ・キャッシュとリクエストのメモ化の違い**
>
> どちらのキャッシュ・メカニズムも、キャッシュされたデータを再利用することでパフォーマンスを向上させるのに役立ちますが、データ・キャッシュは、リクエストの受信とデプロイメントにわたって永続的であるのに対し、メモ化はリクエストの有効期間しか持続しません。
>
> メモ化では、レンダリングサーバーからデータキャッシュサーバー（CDN やエッジネットワークなど）やデータソース（データベースや CMS など）までのネットワーク境界を越えなければならない、同じレンダーパスの重複リクエストの数を減らすことができます。データキャッシュを使用することで、オリジンのデータソースへのリクエスト数を減らすことができます。

### キャッシュ期間

データ・キャッシュは、再検証またはオプトアウトを行わない限り、受信したリクエストとデプロイメントにわたって永続的です。

### 再検証

キャッシュされたデータは、以下の 2 つの方法で再検証できます：

- **時間ベースの再検証**： 一定時間が経過し、新しいリクエストが行われた後にデータを再検証する。これは、変更頻度が低く、鮮度がそれほど重要でないデータに有効
- **オンデマンドの再検証**： イベント（フォーム送信など）に基づいてデータを再検証する。オンデマンドな再検証では、タグベースまたはパスベースのアプローチを使用して、データのグループを一度に再検証する。これは、最新のデータをできるだけ早く表示したい場合に有効（ヘッドレス CMS のコンテンツが更新された場合など）

**時間ベースの再検証**

一定間隔でデータを再検証するには、`fetch`の`next.revalidate`オプションを使用して、リソースのキャッシュ有効期間（秒）を設定します。

```ts
// 1時間ごとに再検証する
fetch('https://...', { next: { revalidate: 3600 } })
```

あるいは、[Route Segment Config](#segment-config-options)オプションを使用して、Segment 内すべての`fetch`リクエストを設定したり、`fetch`を使用できない場合に設定できます。

**時間ベースの再検証の仕組み**

![再検証期間の後、最初のリクエストに対して古いデータが返され、その後データが再検証される](../../assets/time-based-revalidation.avif)

- `revalidate` を伴う fetch リクエストが最初に呼び出されたとき、データは外部データ・ソースから fetch され、データ・キャッシュに保存される
- 指定された時間（例：60 秒）内に呼び出されたリクエストは、キャッシュされたデータを返す
- 時間が過ぎても、次のリクエストはキャッシュされた（現在は古い）データを返す
  - Next.js はバックグラウンドでデータを再検証する
  - データの取得に成功すると、Next.js はデータキャッシュを新しいデータで更新する
  - バックグラウンドでの再検証が失敗した場合、以前のデータは変更されずに保持される

これは[**stale-while-revalidate**](https://web.dev/stale-while-revalidate/)の動作に似ています。

#### オンデマンドの再検証

データは、パス（[`revalidatePath`](#revalidatepath)）またはキャッシュタグ（[`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)）によってオンデマンドで再検証できます。

**オンデマンドの再検証の仕組み**

![オンデマンド再バリデーションの仕組みを示す図。再バリデーション要求の後、データキャッシュは新鮮なデータで更新される](../../assets/on-demand-revalidation.avif)

- `fetch`リクエストが最初に呼び出されたとき、データは外部データ・ソースから fetch され、データ・キャッシュに格納される
- オンデマンドの再検証がトリガされると、適切なキャッシュ・エントリがキャッシュから削除される
  - これは、最新のデータが fetch されるまで古いデータをキャッシュに保持する時間ベースの再検証とは異なる
- 次にリクエストが行われたとき、それは再びキャッシュ`MISS`となり、データは外部データソースから fetch され、データキャッシュに格納される

### オプトアウト

個々のデータ fetch については、[`cache`](#fetch-optionscache)オプションを`no-store`に設定することで、キャッシュをオプトアウトできます。これは、`fetch`が呼ばれるたびにデータが fetch されることを意味します。

```jsx
// 個々の `fetch` リクエストに対するキャッシュをオプトアウトする。
fetch(`https://...`, { cache: 'no-store' })
```

また[Route Segment Config オプション](#segment-config-options)を使用して、特定の Route Segment のキャッシュを無効にできます。これは、サードパーティライブラリを含む、Route Segment 内のすべてのデータリクエストに影響します。

```jsx
// ルートセグメント内のすべてのデータリクエストのキャッシュをオプトアウトする
export const dynamic = 'force-dynamic'
```

> **Vercel Data Cache**
>
> Next.js アプリケーションを Vercel にデプロイしている場合は、[Vercel Data Cache](https://vercel.com/docs/infrastructure/data-cache)のドキュメントを読んで、Vercel 固有の機能を理解することをお勧めします。

## Full Route Cache

> **Related terms**:
>
> You may see the terms **Automatic Static Optimization**, **Static Site Generation**, or **Static Rendering** being used interchangeably to refer to the process of rendering and caching routes of your application at build time.

Next.js automatically renders and caches routes at build time. This is an optimization that allows you to serve the cached route instead of rendering on the server for every request, resulting in faster page loads.

To understand how the Full Route Cache works, it's helpful to look at how React handles rendering, and how Next.js caches the result:

### 1. React Rendering on the Server

On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks: by individual routes segments and Suspense boundaries.

Each chunk is rendered in two steps:

1. React renders Server Components into a special data format, optimized for streaming, called the **React Server Component Payload**.
2. Next.js uses the React Server Component Payload and Client Component JavaScript instructions to render **HTML** on the server.

This means we don't have to wait for everything to render before caching the work or sending a response. Instead, we can stream a response as work is completed.

> **What is the React Server Component Payload?**
>
> The React Server Component Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The React Server Component Payload contains:
>
> - The rendered result of Server Components
> - Placeholders for where Client Components should be rendered and references to their JavaScript files
> - Any props passed from a Server Component to a Client Component
>
> To learn more, see the [Server Components](/docs/app/building-your-application/rendering/server-components) documentation.

### 2. Next.js Caching on the Server (Full Route Cache)

<Image
  alt="Default behavior of the Full Route Cache, showing how the React Server Component Payload and HTML are cached on the server for statically rendered routes."
  srcLight="/docs/light/full-route-cache.png"
  srcDark="/docs/dark/full-route-cache.png"
  width="1600"
  height="888"
/>

The default behavior of Next.js is to cache the rendered result (React Server Component Payload and HTML) of a route on the server. This applies to statically rendered routes at build time, or during revalidation.

### 3. React Hydration and Reconciliation on the Client

At request time, on the client:

1. The HTML is used to immediately show a fast non-interactive initial preview of the Client and Server Components.
2. The React Server Components Payload is used to reconcile the Client and rendered Server Component trees, and update the DOM.
3. The JavaScript instructions are used to [hydrate](https://react.dev/reference/react-dom/client/hydrateRoot) Client Components and make the application interactive.

### 4. Next.js Caching on the Client (Router Cache)

The React Server Component Payload is stored in the client-side [Router Cache](#router-cache) - a separate in-memory cache, split by individual route segment. This Router Cache is used to improve the navigation experience by storing previously visited routes and prefetching future routes.

### 5. Subsequent Navigations

On subsequent navigations or during prefetching, Next.js will check if the React Server Components Payload is stored in the Router Cache. If so, it will skip sending a new request to the server.

If the route segments are not in the cache, Next.js will fetch the React Server Components Payload from the server, and populate the Router Cache on the client.

### Static and Dynamic Rendering

Whether a route is cached or not at build time depends on whether it's statically or dynamically rendered. Static routes are cached by default, whereas dynamic routes are rendered at request time, and not cached.

This diagram shows the difference between statically and dynamically rendered routes, with cached and uncached data:

<Image
  alt="How static and dynamic rendering affects the Full Route Cache. Static routes are cached at build time or after data revalidation, whereas dynamic routes are never cached"
  srcLight="/docs/light/static-and-dynamic-routes.png"
  srcDark="/docs/dark/static-and-dynamic-routes.png"
  width="1600"
  height="1314"
/>

Learn more about [static and dynamic rendering](/docs/app/building-your-application/rendering/server-components#server-rendering-strategies).

### Duration

By default, the Full Route Cache is persistent. This means that the render output is cached across user requests.

### Invalidation

There are two ways you can invalidate the Full Route Cache:

- **[Revalidating Data](/docs/app/building-your-application/caching#revalidating)**: Revalidating the [Data Cache](#data-cache), will in turn invalidate the Router Cache by re-rendering components on the server and caching the new render output.
- **Redeploying**: Unlike the Data Cache, which persists across deployments, the Full Route Cache is cleared on new deployments.

### Opting out

You can opt out of the Full Route Cache, or in other words, dynamically render components for every incoming request, by:

- **Using a [Dynamic Function](#dynamic-functions)**: This will opt the route out from the Full Route Cache and dynamically render it at request time. The Data Cache can still be used.
- **Using the `dynamic = 'force-dynamic'` or `revalidate = 0` route segment config options**: This will skip the Full Route Cache and the Data Cache. Meaning components will be rendered and data fetched on every incoming request to the server. The Router Cache will still apply as it's a client-side cache.
- **Opting out of the [Data Cache](#data-cache)**: If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache. The data for the specific `fetch` request will be fetched for every incoming request. Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache. This allows for a hybrid of cached and uncached data.

## Router Cache

> **Related Terms:**
>
> You may see the Router Cache being referred to as **Client-side Cache** or **Prefetch Cache**. While **Prefetch Cache** refers to the prefetched route segments, **Client-side Cache** refers to the whole Router cache, which includes both visited and prefetched segments.
> This cache specifically applies to Next.js and Server Components, and is different to the browser's [bfcache](https://web.dev/bfcache/), though it has a similar result.

Next.js has an in-memory client-side cache that stores the React Server Component Payload, split by individual route segments, for the duration of a user session. This is called the Router Cache.

**How the Router Cache Works**

<Image
  alt="How the Router cache works for static and dynamic routes, showing MISS and HIT for initial and subsequent navigations."
  srcLight="/docs/light/router-cache.png"
  srcDark="/docs/dark/router-cache.png"
  width="1600"
  height="1375"
/>

As a user navigates between routes, Next.js caches visited route segments and [prefetches](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching) the routes the user is likely to navigate to (based on `<Link>` components in their viewport).

This results in an improved navigation experience for the user:

- Instant backward/forward navigation because visited routes are cached and fast navigation to new routes because of prefetching and [partial rendering](/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering).
- No full-page reload between navigations, and React state and browser state are preserved.

> **Difference between the Router Cache and Full Route Cache**:
>
> The Router Cache temporarily stores the React Server Component Payload in the browser for the duration of a user session, whereas the Full Route Cache persistently stores the React Server Component Payload and HTML on the server across multiple user requests.
>
> While the Full Route Cache only caches statically rendered routes, the Router Cache applies to both statically and dynamically rendered routes.

### Duration

The cache is stored in the browser's temporary memory. Two factors determine how long the router cache lasts:

- **Session**: The cache persists across navigation. However, it's cleared on page refresh.
- **Automatic Invalidation Period**: The cache of an individual segment is automatically invalidated after a specific time. The duration depends on whether the route is [statically](/docs/app/building-your-application/rendering/server-components#static-rendering-default) or [dynamically](/docs/app/building-your-application/rendering/server-components#dynamic-rendering) rendered:
  - **Dynamically Rendered**: 30 seconds
  - **Statically Rendered**: 5 minutes

While a page refresh will clear **all** cached segments, the automatic invalidation period only affects the individual segment from the time it was last accessed or created.

By adding `prefetch={true}` or calling `router.prefetch` for a dynamically rendered route, you can opt into caching for 5 minutes.

### Invalidation

There are two ways you can invalidate the Router Cache:

- In a **Server Action**:
  - Revalidating data on-demand by path with ([`revalidatePath`](/docs/app/api-reference/functions/revalidatePath)) or by cache tag with ([`revalidateTag`](/docs/app/api-reference/functions/revalidateTag))
  - Using [`cookies.set`](/docs/app/api-reference/functions/cookies#cookiessetname-value-options) or [`cookies.delete`](/docs/app/api-reference/functions/cookies#deleting-cookies) invalidates the Router Cache to prevent routes that use cookies from becoming stale (e.g. authentication).
- Calling [`router.refresh`](/docs/app/api-reference/functions/use-router) will invalidate the Router Cache and make a new request to the server for the current route.

### Opting out

It's not possible to opt out of the Router Cache. However, you can invalidate it by calling [`router.refresh`](/docs/app/api-reference/functions/use-router), [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath), or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) (see above). This will clear the cache and make a new request to the server, ensuring the latest data is shown.

You can also opt out of **prefetching** by setting the `prefetch` prop of the `<Link>` component to `false`. However, this will still temporarily store the route segments for 30s to allow instant navigation between nested segments, such as tab bars, or back and forward navigation. Visited routes will still be cached.

## Cache Interactions

When configuring the different caching mechanisms, it's important to understand how they interact with each other:

### Data Cache and Full Route Cache

- Revalidating or opting out of the Data Cache **will** invalidate the Full Route Cache, as the render output depends on data.
- Invalidating or opting out of the Full Route Cache **does not** affect the Data Cache. You can dynamically render a route that has both cached and uncached data. This is useful when most of your page uses cached data, but you have a few components that rely on data that needs to be fetched at request time. You can dynamically render without worrying about the performance impact of re-fetching all the data.

### Data Cache and Client-side Router cache

- Revalidating the Data Cache in a [Route Handler](/docs/app/building-your-application/routing/route-handlers) **will not** immediately invalidate the Router Cache as the Route Handler isn't tied to a specific route. This means Router Cache will continue to serve the previous payload until a hard refresh, or the automatic invalidation period has elapsed.
- To immediately invalidate the Data Cache and Router cache, you can use [`revalidatePath`](#revalidatepath) or [`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag) in a [Server Action](/docs/app/building-your-application/data-fetching/server-actions-and-mutations).

## APIs

The following table provides an overview of how different Next.js APIs affect caching:

| API                                                                     | Router Cache               | Full Route Cache      | Data Cache            | React Cache |
| ----------------------------------------------------------------------- | -------------------------- | --------------------- | --------------------- | ----------- |
| [`<Link prefetch>`](#link)                                              | Cache                      |                       |                       |             |
| [`router.prefetch`](#routerprefetch)                                    | Cache                      |                       |                       |             |
| [`router.refresh`](#routerrefresh)                                      | Revalidate                 |                       |                       |             |
| [`fetch`](#fetch)                                                       |                            |                       | Cache                 | Cache       |
| [`fetch` `options.cache`](#fetch-optionscache)                          |                            |                       | Cache or Opt out      |             |
| [`fetch` `options.next.revalidate`](#fetch-optionsnextrevalidate)       |                            | Revalidate            | Revalidate            |             |
| [`fetch` `options.next.tags`](#fetch-optionsnexttags-and-revalidatetag) |                            | Cache                 | Cache                 |             |
| [`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)             | Revalidate (Server Action) | Revalidate            | Revalidate            |             |
| [`revalidatePath`](#revalidatepath)                                     | Revalidate (Server Action) | Revalidate            | Revalidate            |             |
| [`const revalidate`](#segment-config-options)                           |                            | Revalidate or Opt out | Revalidate or Opt out |             |
| [`const dynamic`](#segment-config-options)                              |                            | Cache or Opt out      | Cache or Opt out      |             |
| [`cookies`](#cookies)                                                   | Revalidate (Server Action) | Opt out               |                       |             |
| [`headers`, `searchParams`](#dynamic-functions)                         |                            | Opt out               |                       |             |
| [`generateStaticParams`](#generatestaticparams)                         |                            | Cache                 |                       |             |
| [`React.cache`](#react-cache-function)                                  |                            |                       |                       | Cache       |
| [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache)    |                            |                       |                       |             |

### `<Link>`

By default, the `<Link>` component automatically prefetches routes from the Full Route Cache and adds the React Server Component Payload to the Router Cache.

To disable prefetching, you can set the `prefetch` prop to `false`. But this will not skip the cache permanently, the route segment will still be cached client-side when the user visits the route.

Learn more about the [`<Link>` component](/docs/app/api-reference/components/link).

### `router.prefetch`

The `prefetch` option of the `useRouter` hook can be used to manually prefetch a route. This adds the React Server Component Payload to the Router Cache.

See the [`useRouter` hook](/docs/app/api-reference/functions/use-router) API reference.

### `router.refresh`

The `refresh` option of the `useRouter` hook can be used to manually refresh a route. This completely clears the Router Cache, and makes a new request to the server for the current route. `refresh` does not affect the Data or Full Route Cache.

The rendered result will be reconciled on the client while preserving React state and browser state.

See the [`useRouter` hook](/docs/app/api-reference/functions/use-router) API reference.

### `fetch`

Data returned from `fetch` is automatically cached in the Data Cache.

```jsx
// Cached by default. `force-cache` is the default option and can be omitted.
fetch(`https://...`, { cache: 'force-cache' })
```

See the [`fetch` API Reference](/docs/app/api-reference/functions/fetch) for more options.

### `fetch options.cache`

You can opt out individual `fetch` requests of data caching by setting the `cache` option to `no-store`:

```jsx
// Opt out of caching
fetch(`https://...`, { cache: 'no-store' })
```

Since the render output depends on data, using `cache: 'no-store'` will also skip the Full Route Cache for the route where the `fetch` request is used. That is, the route will be dynamically rendered every request, but you can still have other cached data requests in the same route.

See the [`fetch` API Reference](/docs/app/api-reference/functions/fetch) for more options.

### `fetch options.next.revalidate`

You can use the `next.revalidate` option of `fetch` to set the revalidation period (in seconds) of an individual `fetch` request. This will revalidate the Data Cache, which in turn will revalidate the Full Route Cache. Fresh data will be fetched, and components will be re-rendered on the server.

```jsx
// Revalidate at most after 1 hour
fetch(`https://...`, { next: { revalidate: 3600 } })
```

See the [`fetch` API reference](/docs/app/api-reference/functions/fetch) for more options.

### `fetch options.next.tags` and `revalidateTag`

Next.js has a cache tagging system for fine-grained data caching and revalidation.

1. When using `fetch` or [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache), you have the option to tag cache entries with one or more tags.
2. Then, you can call `revalidateTag` to purge the cache entries associated with that tag.

For example, you can set a tag when fetching data:

```jsx
// Cache data with a tag
fetch(`https://...`, { next: { tags: ['a', 'b', 'c'] } })
```

Then, call `revalidateTag` with a tag to purge the cache entry:

```jsx
// Revalidate entries with a specific tag
revalidateTag('a')
```

There are two places you can use `revalidateTag`, depending on what you're trying to achieve:

1. [Route Handlers](/docs/app/building-your-application/routing/route-handlers) - to revalidate data in response of a third party event (e.g. webhook). This will not invalidate the Router Cache immediately as the Router Handler isn't tied to a specific route.
2. [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - to revalidate data after a user action (e.g. form submission). This will invalidate the Router Cache for the associated route.

### `revalidatePath`

`revalidatePath` allows you manually revalidate data **and** re-render the route segments below a specific path in a single operation. Calling the `revalidatePath` method revalidates the Data Cache, which in turn invalidates the Full Route Cache.

```jsx
revalidatePath('/')
```

There are two places you can use `revalidatePath`, depending on what you're trying to achieve:

1. [Route Handlers](/docs/app/building-your-application/routing/route-handlers) - to revalidate data in response to a third party event (e.g. webhook).
2. [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - to revalidate data after a user interaction (e.g. form submission, clicking a button).

See the [`revalidatePath` API reference](/docs/app/api-reference/functions/revalidatePath) for more information.

> **`revalidatePath`** vs. **`router.refresh`**:
>
> Calling `router.refresh` will clear the Router cache, and re-render route segments on the server without invalidating the Data Cache or the Full Route Cache.
>
> The difference is that `revalidatePath` purges the Data Cache and Full Route Cache, whereas `router.refresh()` does not change the Data Cache and Full Route Cache, as it is a client-side API.

### Dynamic Functions

Dynamic functions like `cookies` and `headers`, and the `searchParams` prop in Pages depend on runtime incoming request information. Using them will opt a route out of the Full Route Cache, in other words, the route will be dynamically rendered.

#### `cookies`

Using `cookies.set` or `cookies.delete` in a Server Action invalidates the Router Cache to prevent routes that use cookies from becoming stale (e.g. to reflect authentication changes).

See the [`cookies`](/docs/app/api-reference/functions/cookies) API reference.

### Segment Config Options

The Route Segment Config options can be used to override the route segment defaults or when you're not able to use the `fetch` API (e.g. database client or 3rd party libraries).

The following Route Segment Config options will opt out of the Data Cache and Full Route Cache:

- `const dynamic = 'force-dynamic'`
- `const revalidate = 0`

See the [Route Segment Config](/docs/app/api-reference/file-conventions/route-segment-config) documentation for more options.

### `generateStaticParams`

For [dynamic segments](/docs/app/building-your-application/routing/dynamic-routes) (e.g. `app/blog/[slug]/page.js`), paths provided by `generateStaticParams` are cached in the Full Route Cache at build time. At request time, Next.js will also cache paths that weren't known at build time the first time they're visited.

You can disable caching at request time by using `export const dynamicParams = false` option in a route segment. When this config option is used, only paths provided by `generateStaticParams` will be served, and other routes will 404 or match (in the case of [catch-all routes](/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments)).

See the [`generateStaticParams` API reference](/docs/app/api-reference/functions/generate-static-params).

### React `cache` function

The React `cache` function allows you to memoize the return value of a function, allowing you to call the same function multiple times while only executing it once.

Since `fetch` requests are automatically memoized, you do not need to wrap it in React `cache`. However, you can use `cache` to manually memoize data requests for use cases when the `fetch` API is not suitable. For example, some database clients, CMS clients, or GraphQL clients.

```tsx filename="utils/get-item.ts" switcher
import { cache } from 'react'
import db from '@/lib/db'

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

```jsx filename="utils/get-item.js" switcher
import { cache } from 'react'
import db from '@/lib/db'

export const getItem = cache(async (id) => {
  const item = await db.item.findUnique({ id })
  return item
})
```
