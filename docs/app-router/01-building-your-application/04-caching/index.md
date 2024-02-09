---
title: キャッシング
nav_title: キャッシング
description: Next.jsアプリケーションをキャッシュするさまざまな方法を紹介します。
---

## Next.js のキャッシング

Next.js は、レンダリングやデータリクエストをキャッシュすることで、アプリケーションのパフォーマンスを向上させ、コストを削減します。このページでは、Next.js のキャッシュの仕組み、設定に使用できる API、およびそれらの相互作用について詳しく説明します。

> **Good to know**: このページは、Next.js がどのように動作しているかを理解するのに役立ちますが、Next.js で生産性を上げるために必須の知識ではありません。Next.js がキャッシュをするかどうか判断する際は、ほとんどが API の使用状況によって決定され、ゼロまたは最小限の設定で最高のパフォーマンスが得られるようにデフォルトが設定されています。

---

## 概要

ここでは、さまざまなキャッシングの仕組みとその目的について大まかに説明します:

| 仕組み                                     | 何を                   | 場所   | 目的                                                   | キャッシュ期間                       |
| ------------------------------------------ | ---------------------- | ------ | ------------------------------------------------------ | ------------------------------------ |
| [Request Memoization](#リクエストのメモ化) | 関数の返り値           | Server | React Component のツリーでデータを再利用する           | リクエストごとのライフサイクル       |
| [Data Cache](#data-cache)                  | データ                 | Server | ユーザーリクエストとデプロイメントをまたぐデータの保存 | 永続的（再検証可能）                 |
| [Full Route Cache](#full-route-cache)      | HTML と RSC ペイロード | Server | レンダリングコストの削減とパフォーマンスの向上         | 永続的（再検証可能）                 |
| [Router Cache](#router-cache)              | RSC ペイロード         | Client | ナビゲーション時のサーバーリクエストを減らす           | ユーザー・セッションまたは時間ベース |

デフォルトでは、Next.js はパフォーマンス向上とコスト削減のため、可能な限りキャッシュします。つまり、オプトアウトしない限り、ルートは静的にレンダリングされ、データリクエストはキャッシュされます。下の図はビルド時にルートが静的にレンダリングされ、静的ルートが最初にアクセスされるときのデフォルトのキャッシュ動作を示しています。

![Next.jsの4つのメカニズムにおけるデフォルトのキャッシュ動作を示す図です。ビルド時とルートが最初に訪問されたとき、HIT、MISS、SETが表示されます。](../../assets/caching-overview.avif)

<!-- textlint-disable -->

キャッシュの動作は、ルートが静的にレンダリングされるか動的にレンダリングされるか、データがキャッシュされるかキャッシュされないか、リクエストが最初の訪問の一部であるか後続のナビゲーションであるかによって変わります。ユースケースに応じて、個々のルートとデータリクエストのキャッシュ動作を設定できます。

<!-- textlint-enable -->

---

## リクエストのメモ化

React は[`fetch` API](#fetch)を拡張し、同じ URL とオプションを持つリクエストを自動的に**メモ化**します。つまり、React Component ツリー内の複数の場所で、同じデータに対する `fetch` 関数を呼び出すことができますが、実行は 1 回だけ行われます。

![重複したフェッチリクエスト](../../assets/deduplicated-fetch-requests.avif)

例えば、ルート全体（レイアウト、ページ、複数のコンポーネントなど）で同じデータを使用する必要がある場合、ツリーの先頭でデータをフェッチし、コンポーネント間でプロップを転送する必要はありません。その代わりに、同じデータに対してネットワークを介して複数のリクエストを行うことによるパフォーマンスを懸念することなく、必要なコンポーネントでデータをフェッチできます。

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

- ルートをレンダリングしている間、特定のリクエストが最初に呼び出されたとき、その結果はメモリになくキャッシュ `MISS` となります。
- したがって、関数が実行され、データが外部ソースから取得され、結果がメモリに格納されます。
- 同じレンダリングパスのリクエストの後続の関数呼び出しはキャッシュ `HIT` となり、関数を実行せずにメモリからデータが返されます。
- ルートがレンダリングされ、レンダリングパスが完了すると、メモリは"リセット"され、すべてのリクエストのメモ化エントリはクリアされます。

> **Good to know**:
>
> - リクエストのメモ化は Next.js の機能ではなく、React のものだが、他のキャッシュ機構とどのように相互作用するかを示すために、ドキュメントに含めています。
> - メモ化は `fetch` リクエストの `GET` メソッドにのみ適用されます。
> - メモ化は React Component ツリーにのみ適用されます:
>   - `generateMetadata`、`generateStaticParams`、Layouts、Pages、その他の Server Component の `fetch` リクエストに適用されます。
>   - Route Handlers は React Component ツリーの一部ではないので、`fetch`リクエストには適用されません。
> - `fetch` を使用しない場合（データベースクライアント、CMS クライアント、GraphQL クライアントなど）には、[React `cache` function](#react-cache-関数) を使用して関数をメモすることができます。

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

## Data Cache

Next.js にはビルドインの Data Cache があり、**受信するサーバーリクエスト**や**デプロイメント**にまたがってデータフェッチの結果を**永続化**します。これは、Next.js がネイティブの`fetch`API を拡張して、サーバー上の各リクエストが独自の永続キャッシュセマンティクスを設定できるようにしたためです。

> **Good to know**: ブラウザでは、`fetch` の `cache` オプションは、リクエストがブラウザの HTTP キャッシュとどのようにやりとりするかを指定します。Next.js では、`cache` オプションは、サーバーサイドのリクエストがサーバー上の Data Cache とどのようにやりとりするかを指定します。

<!-- textlint-disable -->

**データ・キャッシュの仕組み**

<!-- textlint-enable -->

<!-- textlint-disable -->

![キャッシュされたfetchリクエストとキャッシュされていないfetchリクエストがData Cacheとどのように相互作用するかを示す図。キャッシュされたリクエストはData Cacheに保存され、メモ化されます。キャッシュされていないリクエストはデータソースからフェッチされ、Data Cacheには保存されず、メモ化されます。](../../assets/data-cache.avif)

<!-- textlint-enable -->

- レンダリング中に`fetch`リクエストが最初に呼び出されると、Next.js は Data Cache にキャッシュされたレスポンスがないかチェックします。
- キャッシュされたレスポンスが見つかれば、すぐに返され、メモ化されます。
- キャッシュされたレスポンスが見つからない場合は、データソースにリクエストが行われ、その結果が Data Cache に格納され、メモ化されます。
- キャッシュされていないデータ（例：`{ cache: 'no-store' }`）の場合、結果は常にデータソースから取得され、メモ化されます。
- データがキャッシュされていてもキャッシュされていなくても、リクエストは常にメモ化され、React レンダーパスの間に同じデータに対して重複したリクエストが行われるのを防ぎます。

> **Data Cache とリクエストのメモ化の違い**
>
> どちらのキャッシュ・メカニズムも、キャッシュされたデータを再利用することでパフォーマンスを向上させるのに役立ちますが、データ・キャッシュは、リクエストの受信とデプロイメントにわたって永続的であるのに対し、メモ化はリクエストの有効期間しか持続しません。
>
> メモ化では、レンダリングサーバーからデータキャッシュサーバー（CDN やエッジネットワークなど）やデータソース（データベースや CMS など）までのネットワーク境界を越えなければならない、同じレンダーパスの重複リクエストの数を減らすことができます。データキャッシュを使用することで、オリジンのデータソースへのリクエスト数を減らすことができます。

### キャッシュ期間

データ・キャッシュは、再検証またはオプトアウトを行わない限り、受信するリクエストとデプロイメントにわたって永続的です。

### 再検証

キャッシュされたデータは、以下の 2 つの方法で再検証できます

- **時間ベースの再検証**: 一定時間が経過し、新しいリクエストが行われた後にデータを再検証します。これは、変更頻度が低く、鮮度がそれほど重要でないデータに有効です。
- **オンデマンドの再検証**: イベント（フォーム送信など）に基づいてデータを再検証します。オンデマンドな再検証では、タグベースまたはパスベースのアプローチを使用して、データのグループを一度に再検証します。これは、最新のデータをできるだけ早く表示したい場合に有効（ヘッドレス CMS のコンテンツが更新された場合など）です。

**時間ベースの再検証**

一定間隔でデータを再検証するには、`fetch`の`next.revalidate`オプションを使用して、リソースのキャッシュ有効期間（秒）を設定します。

```ts
// 1時間ごとに再検証する
fetch('https://...', { next: { revalidate: 3600 } })
```

あるいは、[Route Segment Config](#segment-config-options)オプションを使用して、Segment 内すべての`fetch`リクエストを設定したり、`fetch`を使用できない場合に設定できます。

**時間ベースの再検証の仕組み**

![再検証期間の後、最初のリクエストに対して古いデータが返され、その後データが再検証される](../../assets/time-based-revalidation.avif)

- `revalidate` を伴う fetch リクエストが最初に呼び出されたとき、データは外部データ・ソースから fetch され、データ・キャッシュに保存されます。
- 指定された時間（例: 60 秒）内に呼び出されたリクエストは、キャッシュされたデータを返します。
- 時間が過ぎても、次のリクエストはキャッシュされた（現在は古い）データを返します。
  - Next.js はバックグラウンドでデータを再検証します。
  - データの取得に成功すると、Next.js は Data Cache を新しいデータで更新します。
  - バックグラウンドでの再検証が失敗した場合、以前のデータは変更されずに保持されます。

これは[**stale-while-revalidate**](https://web.dev/stale-while-revalidate/)の動作に似ています。

#### オンデマンドの再検証

データは、パス（[`revalidatePath`](#revalidatepath)）またはキャッシュタグ（[`revalidateTag`](#fetch-optionsnexttags-and-revalidatetag)）によってオンデマンドで再検証できます。

**オンデマンドの再検証の仕組み**

![オンデマンド再バリデーションの仕組みを示す図。再バリデーション要求の後、データキャッシュは新鮮なデータで更新される](../../assets/on-demand-revalidation.avif)

- `fetch`リクエストが最初に呼び出されたとき、データは外部データ・ソースから fetch され、データ・キャッシュに格納されます。
- オンデマンドの再検証がトリガされると、適切なキャッシュ・エントリがキャッシュから削除されます。
  - これは、最新のデータが fetch されるまで古いデータをキャッシュに保持する時間ベースの再検証とは異なります。
- 次にリクエストが行われたとき、それは再びキャッシュ`MISS`となり、データは外部データソースから fetch され、Data Cache に格納されます。

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

> **関連用語**:
>
> **Automatic Static Optimization（自動静的最適化）**、**Static Site Generation（静的サイト生成）**、または **Static Rendering（静的レンダリング）**という用語は、ビルド時にアプリケーションのルートをレンダリングおよびキャッシュするプロセスを指すために、互換的に使用されることがあります。

Next.js はビルド時にルートを自動的にレンダリングしてキャッシュします。これは、リクエストごとにサーバーでレンダリングする代わりに、キャッシュされたルートを提供できるようにする最適化で、ページロードの高速化をもたらします。

Full Route Cache がどのように機能するのかを理解するには、React がどのようにレンダリングを処理し、Next.js がどのように結果をキャッシュするのかを見るのが役に立ちます:

### 1. サーバー上での React レンダリング

サーバー上では、Next.js は React の API を使ってレンダリングを管理します。レンダリング作業は、個々の Route Segment と Suspense 境界に分割されます。

各チャンクは 2 つのステップでレンダリングされます:

1. React は、Server Component を、React Server Component Payload と呼ばれる、ストリーミング用に最適化された特殊なデータ形式としてレンダリングします
2. Next.js は React Server Component Payload と Client Component の JavaScript を使用し、サーバー上で HTML をレンダリングします

つまり、作業をキャッシュしたりレスポンスを送信したりする前に、すべてがレンダリングされるのを待つ代わりに、作業が完了した時点でレスポンスをストリームできます。

> **React Server Component Payload とは？**
>
> React Server Component Payload は、レンダリングされた React Server Components ツリーのコンパクトなバイナリ表現です。これは、ブラウザの DOM を更新するために、クライアントの React によって使用されます。React Server Component Payload には以下が含まれます:
>
> - Server Components のレンダリング結果
> - Client Components がレンダリングされる場所のプレースホルダと、その JavaScript ファイルへの参照
> - Server Components から Client Components に渡されるすべての Props
>
> 詳しくは、[Server Components](/docs/app-router/building-your-application/rendering/server-components)のドキュメントを参照してください。

### 2. サーバー上での Next.js によるキャッシュ（Full Route Cache）

<!-- textlint-disable -->

![Full Route Cacheのデフォルトの動作。静的にレンダリングされたルートに対して、React Server Component PayloadとHTMLがどのようにサーバーにキャッシュされるかを示しています](../../assets/full-route-cache.avif)

<!-- textlint-enable -->

Next.js のデフォルトの動作は、ルートのレンダリング結果（React Server Component Payload と HTML）をサーバーにキャッシュすることです。これは、ビルド時や再検証時に静的にレンダリングされたルートに適用されます。

### 3. クライアント上での React による ハイドレーション（Hydration） と 差分検出処理（Reconciliation）

リクエスト時に、クライアント上では以下のことが行われます:

1. HTML は、Client Components と Server Components の高速で非インタラクティブな初期プレビューを表示するために使用される
<!-- textlint-disable -->
2. React Server Component Payload は、Client Component の差分検出処理とレンダリングされた Server Components のツリーを調整し、DOM を更新するために使用される
   <!-- textlint-enable -->
   <!-- textlint-disable -->
3. JavaScript の処理は Client Components を[ハイドレート](https://ja.react.dev/reference/react-dom/client/hydrateRoot)し、アプリケーションをインタラクティブにするために使用される
<!-- textlint-enable -->

### 4. クライアントでの Next.js によるキャッシュ（Router Cache）

<!-- textlint-disable -->

React Server Component Payload は、クライアントサイドの[Router Cache](#router-cache)（個々の Route Segment ごとに分割された個別のメモリ内キャッシュ）に保存されます。この Router Cache は、以前に訪問したルートを保存し、将来のルートをプリフェッチすることで、ナビゲーション体験を向上させるために使用されます。

<!-- textlint-enable -->

### 5. その後のナビゲーション

その後のナビゲーションの際やプリフェッチの際に、Next.js は React Server Components Payload が Router Cache に保存されているかどうかを確認します。キャッシュされていれば、サーバーへの新しいリクエストの送信をスキップします。

Route Segment がキャッシュにない場合、サーバーから React Server Components Payload を取得し、クライアントの Router Cache に入力します。

### 静的、動的なレンダリング

ビルド時にルートがキャッシュされるかどうかは、静的にレンダリングされるか動的にレンダリングされるかに依存します。静的ルートはデフォルトでキャッシュされますが、動的ルートはリクエスト時にレンダリングされ、キャッシュされません。

この図は静的にレンダリングされるルートと動的にレンダリングされるルートの違いを、キャッシュされるデータとキャッシュされないデータで表しています:

![静的レンダリングと動的レンダリングがFull Route Cacheに与える影響。静的ルートはビルド時またはデータの再検証後にキャッシュされますが、動的ルートはキャッシュされません](../../assets/static-and-dynamic-routes.avif)

詳細は[静的レンダリングと動的レンダリングの詳細](/docs/app-router/building-your-application/rendering/server-components#サーバーレンダリングストラテジー)を参照してください。

### 期間

デフォルトでは、Full Route Cache は永続的です。これは、レンダリング出力がユーザーリクエストにまたがってキャッシュされることを意味します。

### キャッシュを無効にする

Full Route Cache を無効にする方法は 2 つあります:

- [データの再検証](#再検証): [Data Cache](/docs/app-router/building-your-application/caching/#data-cache) を再有効化すると、サーバー上でコンポーネントを再レンダリングし、新しいレンダー出力をキャッシュすることで、Router Cache が無効になります。
- **再デプロイ**: デプロイメントをまたいで持続する Data Cache とは異なり、Full Route Cache は新しいデプロイメントでクリアされます。

### オプトアウト

Full Route Cache をオプトアウトする、つまり、受信リクエストごとにコンポーネントを動的にレンダリングするには、次のようにします：

- **[動的関数](#動的関数)**を使用する: Full Route Cache からルートを除外し、リクエスト時に動的にレンダリングします。Data Cache は引き続き使用できます。
<!-- textlint-disable -->
- **Route Segment 設定オプション `dynamic = 'force-dynamic'` または `revalidate = 0`を使用する**: これは Full Route Cache と Data Cache をスキップします。つまり、コンポーネントはレンダリングされ、サーバーへのリクエストごとにデータが取得されます。Router Cache はクライアント側のキャッシュなので、まだ適用されます。
<!-- textlint-enable -->
- **[Data Cache](#data-cache)のオプトアウト**: ルートにキャッシュされない`fetch`リクエストがある場合、これは Full Route Cache からルートを除外します。特定の`fetch`リクエストのデータは、受信するリクエストごとにフェッチされます。キャッシュをオプトアウトしない他の`fetch`リクエストは、Data Cache にキャッシュされます。これにより、キャッシュされたデータとキャッシュされていないデータのハイブリッドが可能になります。

## Router Cache

> **関連用語:**
>
> Router Cache が**クライアントサイドキャッシュ**や**プリフェッチキャッシュ**と呼ばれるのを目にすることがあるかもしれません。**プリフェッチキャッシュ**がプリフェッチされたルートセグメントを指すのに対し、**クライアントサイドキャッシュ**は訪問済みセグメントとプリフェッチされたセグメントの両方を含むルーターキャッシュ全体を指します。このキャッシュは特に Next.js とサーバーコンポーネントに適用され、ブラウザの[bfcache](https://web.dev/bfcache/)とは異なります。

<!-- textlint-disable -->

Next.js では、React Server Component Payload を個々の Route Segment に分割し、セッションの間保存するインメモリのクライアントサイドキャッシュを Router Cache と呼びます。

<!-- textlint-enable -->

**Router Cache の仕組み**

![Router Cacheが静的ルートと動的ルートでどのように機能するか](../../assets/router-cache.avif)

ユーザーがルート間を移動すると、訪問した Route Segment をキャッシュし、（ビューポート内の`<Link>`コンポーネントに基づいて）ユーザーが移動しそうなルートを[プリフェッチ](/docs/app-router/building-your-application/routing/linking-and-navigating#2-プリフェッチ)します。

その結果、ユーザーのナビゲーション体験が向上します:

<!-- TODO: fix link -->

- 訪問したルートがキャッシュされるため、すぐに戻る/進むナビゲーションができ、プリフェッチと[部分レンダリング](/docs/app-router/building-your-application/routing/linking-and-navigating#4-部分レンダリング)により、新しいルートへのナビゲーションが高速になります
- ナビゲーションの間に全ページをリロードする必要がなく、React の状態とブラウザの状態が保持されます

> **Router Cache と Full Route Cache の違い**:
>
> Router Cache は、ユーザーセッションの間、React Server Component Payload をブラウザに一時的に保存するのに対し、Full Route Cache は、複数のユーザーリクエストにわたって React Server Component Payload と HTML をサーバーに永続的に保存します。
>
> Full Route Cache が静的にレンダリングされたルートのみをキャッシュするのに対し、Router Cache は静的にレンダリングされたルートと動的にレンダリングされたルートの両方に適用されます。

### 期間

キャッシュはブラウザの一時メモリに保存されます。Router Cache の持続時間は 2 つの要因によって決まります:

- **セッション**: キャッシュはナビゲーションの間持続します。ただし、ページ更新時にクリアされます。
- **自動無効期間**: 個々の Segment のキャッシュは特定の時間が経過すると自動的に無効になります。期間はルートが[静的](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)にレンダリングされるか、[動的](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)にレンダリングされるかに依存します。

ページを更新すると、キャッシュされた Segment は**すべて**消去されますが、自動無効化期間は、最後にアクセスまたは作成された時点から個々の Segment にのみ影響します。

`prefetch={true}` を追加するか、動的にレンダリングされるルートに対して `router.prefetch` をコールすることで、5 分間のキャッシュを選択できます。

### キャッシュを無効にする

Router Cache を無効にする方法は 2 つあります:

- **Server Action**で:
  - [`revalidatePath`](/docs/app-router/api-reference/functions/revalidatePath)によるパス、または[`revalidateTag`](/docs/app-router/api-reference/functions/revalidateTag)によるタグで、データをオンデマンドで再検証します
  - [`cookies.set`](/docs/app-router/api-reference/functions/cookies#cookiessetname-value-options)または[`cookies.delete`](/docs/app-router/api-reference/functions/cookies#cookie-を削除する)を使用すると、Router Cache が無効になり、cookie を使用するルートが古くなるのを防ぎます（認証など）
- [`router.refresh`](/docs/app-router/api-reference/functions/use-router)は Router Cache を無効にし、現在のルートに対してサーバーに新しいリクエストを行います

### オプトアウト

Router Cache は無効にできません。[`router.refresh`](/docs/app-router/api-reference/functions/use-router)、[`revalidatePath`](/docs/app-router/api-reference/functions/revalidatePath)、または[`revalidateTag`](/docs/app-router/api-reference/functions/revalidateTag)（上記参照）を呼び出すことで、キャッシュを無効にします。これによりキャッシュがクリアされ、サーバーへの新しいリクエストが行われ、最新のデータが表示されるようになります。

`<Link>`コンポーネントの `prefetch` prop を `false` に設定することで、**プリフェッチ**を無効にできます。しかし、タブバーや戻る/進むナビゲーションのようなネストされた Segment 間の即時ナビゲーションを可能にするため、Route Segment は 30 秒間一時的に保存されます。訪問されたルートは依然としてキャッシュされます。

## キャッシュ・インタラクション

異なるキャッシング・メカニズムを設定する場合、それらが互いにどのように影響しあうかを理解することが重要です:

### Data Cache と Full Route Cache

- レンダリング出力がデータに依存するため、Data Cache を無効化またはオプトアウトすると、Full Route Cache が無効に**なります**
- Full Route Cache の無効化またはオプトアウトは、Data Cache には影響**しません**。キャッシュされたデータとキャッシュされていないデータの両方を持つルートを動的にレンダリングできます。これは、ページの大部分がキャッシュされたデータを使用しているが、リクエスト時にフェッチする必要があるデータに依存しているコンポーネントがいくつかある場合に便利です。すべてのデータを再フェッチすることによるパフォーマンスへの影響を気にすることなく、動的にレンダリングできます

### Data Cache と クライアントサイドの Router Cache

- [Route Handler](/docs/app-router/building-your-application/routing/route-handlers)の Data Cache を再有効化しても、Route Handler は特定のルートに結びついていないので、Router Cache はすぐには無効化**されません**。つまり、Router Cache はハードリフレッシュされるか、自動無効化期間が経過するまで、以前のペイロードを提供し続けます
<!-- TODO: fix link -->
- Data Cache と Router Cache を直ちに無効にするには、[Sevrer Action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) で [`revalidatePath`](#revalidatepath) または [`revalidateTag`](#fetch-optionsnexttags-と-revalidatetag) を使用します

## API

次の表は、さまざまな Next.js API がキャッシュに与える影響の概要を示しています:

| API                                                                         | Router Cache               | Full Route Cache      | Data Cache            | React Cache |
| --------------------------------------------------------------------------- | -------------------------- | --------------------- | --------------------- | ----------- |
| [`<Link prefetch>`](#link)                                                  | Cache                      |                       |                       |             |
| [`router.prefetch`](#routerprefetch)                                        | Cache                      |                       |                       |             |
| [`router.refresh`](#routerrefresh)                                          | Revalidate                 |                       |                       |             |
| [`fetch`](#fetch)                                                           |                            |                       | Cache                 | Cache       |
| [`fetch` `options.cache`](#fetch-optionscache)                              |                            |                       | Cache or Opt out      |             |
| [`fetch` `options.next.revalidate`](#fetch-optionsnextrevalidate)           |                            | Revalidate            | Revalidate            |             |
| [`fetch` `options.next.tags`](#fetch-optionsnexttags-と-revalidatetag)      |                            | Cache                 | Cache                 |             |
| [`revalidateTag`](#fetch-optionsnexttags-と-revalidatetag)                  | Revalidate (Server Action) | Revalidate            | Revalidate            |             |
| [`revalidatePath`](#revalidatepath)                                         | Revalidate (Server Action) | Revalidate            | Revalidate            |             |
| [`const revalidate`](#segment-config-options)                               |                            | Revalidate or Opt out | Revalidate or Opt out |             |
| [`const dynamic`](#segment-config-options)                                  |                            | Cache or Opt out      | Cache or Opt out      |             |
| [`cookies`](#cookies)                                                       | Revalidate (Server Action) | Opt out               |                       |             |
| [`headers`, `searchParams`](#動的関数)                                      |                            | Opt out               |                       |             |
| [`generateStaticParams`](#generatestaticparams)                             |                            | Cache                 |                       |             |
| [`React.cache`](#react-cache-関数)                                          |                            |                       |                       | Cache       |
| [`unstable_cache`](/docs/app-router/api-reference/functions/unstable_cache) |                            |                       |                       |             |

### `<Link>`

<!-- textlint-disable -->

デフォルトでは`<Link>`コンポーネントは自動的に Full Route Cache からルートをプリフェッチし、React Server Component Payload を Router Cache に追加します。

<!-- textlint-enable -->

プリフェッチを無効にするには、`prefetch` prop を`false`に設定します。しかし、これは永久にキャッシュをスキップするわけではなく、ユーザーがルートにアクセスしたとき Route Segment はクライアントサイドでキャッシュされます。

`<Link>` コンポーネントの詳細は[こちら](/docs/app-router/api-reference/components/link)を参照してください。

### `router.prefetch`

`useRouter` hook の `prefetch` オプションを使うと、ルートを手動でプリフェッチできます。これにより、React Server Component Payload が Router Cache に追加されます。

`useRouter` hook の詳細は[API リファレンス](/docs/app-router/api-reference/functions/use-router) を参照ください。

### `router.refresh`

`useRouter` hook の`refresh`オプションを使うと、ルートを手動で更新できます。これは Router Cache を完全にクリアし、現在のルートに対してサーバーへ新しいリクエストを行います。

レンダリング結果は、React の状態とブラウザの状態を保持したまま、クライアント上で調整されます。

`useRouter` hook の詳細は[API リファレンス](/docs/app-router/api-reference/functions/use-router)を参照してください。

### `fetch`

`fetch`から返されたデータは、自動的に Data Cache にキャッシュされます。

```jsx
// デフォルトでキャッシュされる。`force-cache` はデフォルトのオプションであり、省略可能。
fetch(`https://...`, { cache: 'force-cache' })
```

その他のオプションは [`fetch` API リファレンス](/docs/app-router/api-reference/functions/fetch) を参照してください。

### `fetch options.cache`

キャッシュ・オプションを`no-store`に設定することで、個々の`fetch`リクエストに対してデータのキャッシュを行わないようにできます:

```jsx
// キャッシュをオプトアウトする
fetch(`https://...`, { cache: 'no-store' })
```

レンダリング出力はデータに依存するので、`cache: 'no-store'` を使用すると、`fetch`リクエストが使用されるルートの Full Route Cache もスキップされます。つまり、ルートはリクエストごとに動的にレンダリングされますが、同じルート内に他のキャッシュされたデータリクエストを持つことができます。

その他のオプションは [`fetch` API リファレンス](/docs/app-router/api-reference/functions/fetch) を参照ください。

### `fetch options.next.revalidate`

`fetch`の`next.revalidate`オプションを使用すると、個々の`fetch`リクエストの再検証期間（秒）を設定できます。これにより Data Cache が再検証され、Full Route Cache も再検証されます。新しいデータがフェッチされ、コンポーネントがサーバー上で再レンダリングされます。

```jsx
// 最大1時間後に再検証する
fetch(`https://...`, { next: { revalidate: 3600 } })
```

その他のオプションは [fetch API リファレンス](/docs/app-router/api-reference/functions/fetch) を参照ください。

### `fetch options.next.tags` と `revalidateTag`

Next.js には、きめ細かなデータのキャッシュと再検証のためにキャッシュのタグ付けの仕組みがあります。

1. `fetch`または[`unstable_cache`](/docs/app-router/api-reference/functions/unstable_cache)を使用する場合、キャッシュのエントリに 1 つ以上のタグを付けるオプションがあります
2. その後、`revalidateTag`を呼び出して、そのタグに関連するキャッシュ・エントリーをパージできます

例えば、データ取得時にタグを設定できます:

```jsx
// タグをつけてデータをキャッシュする
fetch(`https://...`, { next: { tags: ['a', 'b', 'c'] } })
```

次に、タグを指定して`revalidateTag`を呼び出し、キャッシュ・エントリーをパージします:

```jsx
// タグを指定してキャッシュ・エントリーを再検証する
revalidateTag('a')
```

何を行いたいかによって `revalidateTag`を使用できる場所は 2 つあります:

1. [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) - サードパーティのイベント（webhook など）に応答してデータを再検証します。Route Handlers は特定のルートに紐づいていないので、Router Cache をすぐに無効にはできません
<!-- TODO: fix link -->
2. [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - ユーザーのアクション（フォーム送信など）の後にデータを再検証します。これは関連するルートの Router Cache を無効にします

### `revalidatePath`

`revalidatePath`を使用すると、1 回の操作でデータを手動で再検証し、**さらに**特定のパス以下の Route Segment を再レンダリングできます。`revalidatePath` メソッドを呼び出すと、Data Cache が再検証され、Full Route Cache が無効になります。

```jsx
revalidatePath('/')
```

何を行いたいかによって `revalidatePath`を使用できる場所は 2 つあります:

1. [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) - サードパーティのイベント（例:webhook）に応答してデータを再検証します
<!-- TODO: fix link -->
2. [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - ユーザーとの対話（フォームの送信やボタンのクリックなど）の後にデータを再検証します

詳細は [`revalidatePath` API リファレンス](/docs/app-router/api-reference/functions/revalidatePath)を参照してください。

> **`revalidatePath`** vs. **`router.refresh`**:
>
> `router.refresh`を呼び出すと、Router Cache がクリアされ、Data Cache や Full Route Cache を無効にすることなく、サーバー上の Route Segment が再レンダリングされます。
>
> `revalidatePath`が Data Cache と Full Route Cache を消去するのに対し、`router.refresh()`はクライアント側の API であるため、Data Cache と Full Route Cache を変更しないという違いがあります。

### 動的関数

`cookies`や`headers`、Pages の`searchParams` prop などの動的な関数は、ランタイムのリクエスト情報に依存します。これらを使用すると、Full Route Cache からルートが除外され、言い換えると、ルートは動的にレンダリングされます。

#### `cookies`

<!-- textlint-disable -->

Server Actions で `cookies.set` または `cookies.delete` を使用すると、Router Cache が無効になり、`cookies` を使用するルートが古くなるのを防ぎます（認証の変更を反映するなど）。

<!-- textlint-enable -->

[`cookies` API リファレンス](/docs/app-router/api-reference/functions/cookies)を参照してください。

### Segment Config Options

<!-- textlint-disable -->

Route Segment Config オプションは、Route Segment のデフォルトを上書きしたり、`fetch` API を使用できない場合（データベースクライアントやサードパーティライブラリなど）に使用できます。

<!-- textlint-enable -->

以下の Route Segment Config オプションは、Data Cache と Full Route Cache を無効にします:

- `const dynamic = 'force-dynamic'`
- `const revalidate = 0`

その他のオプションについては、[Route Segment Config のドキュメント](/docs/app-router/api-reference/file-conventions/route-segment-config)を参照してください。

### `generateStaticParams`

<!-- textlint-disable -->

[動的なセグメント](/docs/app-router/building-your-application/routing/dynamic-routes)（例:`app/blog/[slug]/page.js`）の場合、`generateStaticParams`によって提供されたパスは、ビルド時に Full Route Cache へキャッシュされます。リクエスト時に Next.js はビルド時にわからなかったパスも、最初にアクセスされたときにキャッシュします。

<!-- textlint-enable -->

Route Segment で`export const dynamicParams = false`オプションを使うことで、リクエスト時のキャッシュを無効にできます。この設定オプションが使われるとき、`generateStaticParams`によって提供されるパスだけが提供され、ほかのルートは 404 もしくはマッチします（[catch-all ルート](/docs/app-router/building-your-application/routing/dynamic-routes#キャッチオール-segment)の場合）。

詳細は[`generateStaticParams` API リファレンス](/docs/app-router/api-reference/functions/generate-static-params)を参照してください。

### React `cache` 関数

React の`cache`関数を使えば、関数の戻り値をメモ化できるので、同じ関数を複数回呼び出しても実行は 1 回で済みます。

`fetch` リクエストは自動的にメモ化されるので、React `cache`でラップする必要はありません。しかし、`fetch` API が適していないユースケースのために、キャッシュを使ってデータリクエストを手動でメモ化できます。例えば、データベースクライアント、CMS クライアント、GraphQL クライアントなどです。

```tsx title="utils/get-item.ts"
import { cache } from 'react'
import db from '@/lib/db'

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```
