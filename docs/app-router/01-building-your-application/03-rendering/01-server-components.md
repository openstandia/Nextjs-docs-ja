---
title: Server Components
description: Learn how you can use React Server Components to render parts of your application on the server.
related:
  description: Learn how Next.js caches data and the result of static rendering.
  links:
    - app-router/building-your-application/caching
---

React Server Components を使用すると、サーバー上でレンダリングされ、オプションでキャッシュされる UI を記述できます。Next.js では、レンダリング作業がルート Segment によってさらに分割され、ストリーミングと部分レンダリングが可能になります：

- [静的レンダリング](#静的レンダリングデフォルト)
- [動的レンダリング](#動的レンダリング)
- [Streaming](#streaming)

このページでは、Server Components がどのように機能するのか、どのような場合に Server Components を使用するのか、さまざまなサーバーレンダリング戦略について説明します。

## サーバーレンダリングの利点

レンダリング作業をサーバーで行うことには、以下のような利点があります：

- **データ・フェッチ**：Server Components を使用すると、データのフェッチをデータソースに近いサーバーへ移すことができます。これにより、レンダリングに必要なデータのフェッチにかかる時間が短縮され、クライアントが行う必要のあるリクエストの量が減るため、パフォーマンスが向上します
- **セキュリティ**：Server Components を使用すると、トークンや API キーなどの機密データやロジックを、クライアントへ公開するリスクなしにサーバー上で保持できます
- **キャッシュ**：サーバー上でレンダリングすることで、結果をキャッシュし、後続のリクエストやユーザー間で再利用できます。これにより、各リクエストで実行されるレンダリングとデータ取得の量を減らすことで、パフォーマンスを向上させコストを削減できます
<!-- textlint-disable -->
- **バンドルサイズ**：Server Components を使用すると、以前はクライアント JavaScript のバンドルサイズに影響を及ぼしていた大きな依存関係をサーバーに残すことができます。クライアントが Server Components の JavaScript をダウンロード、解析、実行する必要がないため、インターネットの速度が遅いユーザーや性能の低いデバイスを使用しているユーザーにとって有益です
  <!-- textlint-enable -->
  <!-- textlint-disable -->
- **初期ページロードと[ファーストコンテンツペイント（FCP）](https://web.dev/fcp/)**：サーバー上で、ページのレンダリングに必要な JavaScript をクライアントがダウンロード、解析、実行するのを待つことなく、ユーザーがすぐにページを表示できるように HTML を生成できます
  <!-- textlint-enable -->
  <!-- textlint-disable -->
- **検索エンジン最適化とソーシャルネットワークの共有性**：レンダリングされた HTML は、検索エンジンの Bot がページをインデックスしたり、ソーシャルネットワークの Bot がページのソーシャルカードプレビューを生成するために使用できます
<!-- textlint-enable -->
- **Streaming**：Server Components を使用すると、レンダリング作業を分割して、準備ができ次第クライアントにストリーミングできます。これにより、ユーザーはページ全体がサーバーでレンダリングされるのを待つことなく、ページの一部を早めに見ることができます

## Next.js で Server Components を利用する

デフォルトでは、Next.js は Server Components を使用します。これにより、追加の設定なしで自動的にサーバーレンダリングを実装できます。必要に応じて、[Client Components](/docs/app-router/building-your-application/rendering/client-components)を使用できます。

## Server Components はどのようにレンダリングされるのか

サーバー上では、Next.js は React の API を使ってレンダリングをオーケストレーションします。レンダリング作業は、個々のルート Segment と[Suspense バウンダリ](https://ja.react.dev/reference/react/Suspense)に分割されます。

各チャンクは 2 段階でレンダリングされます：

1. React は、Server Components を**React Server Component Payload（RSC ペイロード）**と呼ばれる特殊なデータ形式にレンダリングします
2. Next.js は、RSC ペイロードと Client Components の JavaScript の処理を使用して、サーバー上で**HTML**をレンダリングします

次にクライアント上で：

1. HTML は、ルートの高速な非インタラクティブなプレビューを表示するために使用されます
2. React Server Components Payload は、クライアントとサーバーのコンポーネントツリーを一致させ、DOM を更新するために使用されます
<!-- textlint-disable -->
3. JavaScript の処理は、Client Components を[ハイドレート](https://ja.react.dev/reference/react-dom/client/hydrateRoot)し、アプリケーションをインタラクティブにするために使用されます
<!-- textlint-enable -->

> **React Server Component Payload（RSC）とは？**
>
> RSC ペイロードは、レンダリングされた React Server Components ツリーのコンパクトなバイナリ表現です。クライアントの React がブラウザの DOM を更新するために使用します。RSC ペイロードには以下が含まれます：
>
> - Server Components のレンダリング結果
> - Client Components がレンダリングされる場所のプレースホルダと、その JavaScript ファイルへの参照
> - Server Components から Client Components に渡されるすべての props

## サーバーレンダリングストラテジー

サーバーレンダリングには 3 つのサブセットがあります：静的レンダリング、動的レンダリング、Streaming です。

### 静的レンダリング（デフォルト）

静的レンダリングでは、ルートはビルド時、またはデータの[再検証](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating#データの再検証)後にバックグラウンドでレンダリングされます。結果はキャッシュされ、[Content Delivery Network(CDN)](https://developer.mozilla.org/docs/Glossary/CDN)にプッシュできます。この最適化により、ユーザーとサーバーリクエストの間でレンダリング作業の結果を共有できます。

静的レンダリングは、静的なブログ記事や製品ページなど、ルートがユーザーにパーソナライズされておらず、ビルド時に知ることができるデータを持つ場合に便利です。

### 動的レンダリング

静的レンダリングでは、ルートは**リクエスト時**、ユーザーごとにレンダリングされます。

動的レンダリングは、ルートがユーザーにパーソナライズされたデータを持つ場合や、Cookie や URL の検索パラメータなどリクエスト時にしかわからない情報を持つ場合に便利です。

> **キャッシュ・データを使った動的ルート**
>
> ほとんどのウェブサイトでは、ルートはすべてが静的または、すべてが動的なものではなく、入り混じっています。例えば、一定期間ごとに再検証されるキャッシュされた商品データを使用する e コマースページがありますが、同時にキャッシュされていないパーソナライズされた顧客データもあります。
>
> Next.js では、キャッシュされたデータとキャッシュされていないデータの両方を持つルートを動的にレンダリングできます。これは、RSC ペイロードとデータが別々にキャッシュされるためです。これにより、リクエスト時にすべてのデータをフェッチすることによるパフォーマンスへの影響を心配することなく、動的レンダリングを選択できます。
>
> [フルルートキャッシュ](/docs/app-router/building-your-application/caching#full-route-cache)と[データキャッシュ](/docs/app-router/building-your-application/caching#data-cache)の詳細については、こちらをご覧ください。

#### 動的レンダリングへの切り替え

レンダリング中に、[動的関数](#動的関数)または[キャッシュされていないデータ要求](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating#データのキャッシュを停止する)が検出されると、Next.js はルート全体を動的レンダリングに切り替えます。この表は、動的関数とデータキャッシュが、ルートを静的にレンダリングするか動的にレンダリングするかにどのように影響するかをまとめたものです：

| 動的関数 | データ     | ルート                   |
| :------- | :--------- | :----------------------- |
| No       | Cached     | 静的にレンダリングされる |
| Yes      | Cached     | 動的にレンダリングされる |
| No       | Not Cached | 動的にレンダリングされる |
| Yes      | Not Cached | 動的にレンダリングされる |

上の表では、ルートが完全に静的であるためには、すべてのデータがキャッシュされなければなりません。しかし、キャッシュされたデータとキャッシュされていないデータの両方を使用する動的にレンダリングされたルートを持つこともできます。

Next.js は、使用する機能と API に基づいて、各ルートに最適なレンダリング戦略を自動的に選択します。その代わりに、[特定のデータをキャッシュまたは再検証](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)するタイミングを選択し、UI の一部を[Stream](#streaming)配信できます。

#### 動的関数

動的関数はユーザーのクッキー、現在のリクエストヘッダ、URL の検索パラメータなど、リクエスト時にしかわからない情報に依存します。Next.js では、このような動的関数は次のものがあります：

- [`cookies()`](/docs/app-router/api-reference/functions/cookies)と[`headers()`](/docs/app-router/api-reference/functions/headers)を使用します：これらを Server Components で使用すると、リクエスト時にルート全体が動的レンダリングになります
- [`useSearchParams()`](/docs/app-router/api-reference/functions/use-search-params)：
  - Client Components では、静的レンダリングをスキップし、代わりにクライアント上でもっとも近い親サスペンス境界までのすべての Client Components をレンダリングします
  - `useSearchParams()`を使用する Client Components を`<Suspense/>`境界で囲むことをお勧めします。こうすることで、それ以上の Client Components を静的にレンダリングできます。[例](/docs/app-router/api-reference/functions/use-search-params#static-rendering)
- [`searchParams`](/docs/app-router/api-reference/file-conventions/page#searchparams任意)：[Pages](/docs/app-router/api-reference/file-conventions/page) props を使用すると、リクエスト時に動的レンダリングとなります

これらの関数のいずれかを使用すると、リクエスト時にルート全体が動的レンダリングになります。

### Streaming

![ストリーミング中のルートセグメントの並列化を示す図。データのフェッチ、レンダリング、インビディアル・チャンクのハイドレーションを示す。](../../assets/sequential-parallel-data-fetching.svg)

<!-- textlint-disable -->

Streaming は、サーバーから UI を徐々にレンダリングすることが可能です。作業はチャンクに分割され、準備ができ次第クライアントにストリーミングされます。これにより、ユーザーはコンテンツ全体のレンダリングが完了する前に、ページの一部をすぐに見ることができます。

<!-- textlint-enable -->

![クライアント上で部分的にレンダリングされたページを示す図。ストリーミングされているチャンクのローディングUIがある](../../assets/server-rendering-with-streaming.svg)

ストリーミングは、デフォルトで Next.js の App Router に組み込まれています。これは、初期ページの読み込みパフォーマンスと、ルート全体のレンダリングをブロックするような遅いデータフェッチに依存する UI の両方を改善するのに役立ちます。たとえば、商品ページのレビューなどです。

`loading.js`と UI コンポーネントを使用して、[React Suspense](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)でルート Segment のストリーミングを開始できます。詳しくは[UI の読み込みとストリーミング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)のセクションを参照してください。

## 次のステップ

Next.js がデータをキャッシュする仕組みと、静的レンダリングの結果を学びましょう。

- [Caching](/docs/app-router/building-your-application/caching)：Next.js のキャッシュ機構の概要
