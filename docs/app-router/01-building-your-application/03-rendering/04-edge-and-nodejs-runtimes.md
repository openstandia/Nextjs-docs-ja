---
title: Edge and Node.js Runtimes
description: Learn about the switchable runtimes (Edge and Node.js) in Next.js.
---

Next.js の文脈では、ランタイムとは、実行中のコードが利用できるライブラリ、API、および一般的な機能の集合を指します。

サーバーには、アプリケーションの一部がレンダリングされる 2 つのランタイムがあります。

- **Node.js Runtime**（デフォルト）は、エコシステムのすべての Node.js API と互換性のあるパッケージにアクセスできます
- **Edge Runtime**は[Web API](/docs/app-router/api-reference/edge)をベースとします

## ランタイムの違い

ランタイムを選択する際には多くの考慮するべき点があります。この表は、主な違いを一目で確認できます。違いについてより詳しく分析したい場合は、以下のセクションをチェックしてください。

|                                                                                                                                                     | Node   | Serverless | Edge             |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :--------- | :--------------- |
| [Cold Boot](https://vercel.com/docs/concepts/get-started/compute#cold-and-hot-boots?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) | /      | ~250ms     | Instant          |
| [HTTP Streaming](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)                                                       | Yes    | Yes        | Yes              |
| IO                                                                                                                                                  | All    | All        | `fetch`          |
| スケーラビリティ                                                                                                                                    | /      | High       | Highest          |
| セキュリティ                                                                                                                                        | Normal | High       | High             |
| レイテンシー                                                                                                                                        | Normal | Low        | Lowest           |
| npm パッケージ                                                                                                                                      | All    | All        | A smaller subset |
| [静的レンダリング](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)                               | Yes    | Yes        | No               |
| [動的レンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)                                         | Yes    | Yes        | Yes              |
| [`fetch`によるデータの再検証](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating#データの再検証)            | Yes    | Yes        | Yes              |

### Edge Runtime

Next.js では、軽量な Edge Runtime は Node.js API の一部を提供します。

Edge ランタイムは、小さくシンプルな関数を使って低レイテンシーで動的でパーソナライズされたコンテンツを提供する必要がある場合に理想的です。Edge Runtime の高速性は、リソースの使用が最小化されていることに由来しますが、多くのシナリオではそれが制約になる可能性があります。

例えば、Vercel 上の Edge Runtime で実行されるコードは、[1MB から 4MB を超えることはできません](https://vercel.com/docs/concepts/limits/overview#edge-middleware-and-edge-functions-size)。この制限には、インポートされたパッケージ、フォント、ファイルが含まれ、デプロイメントインフラストラクチャによって異なります。

### Node.js Runtime

Node.js Runtime を使用すると、すべての Node.js API と、それに依存するすべての npm パッケージにアクセスできます。ただし、Edge Runtime を使用するルートほど起動が速くありません。

Next.js アプリケーションを Node.js サーバーにデプロイするには、インフラの管理、スケーリング設定が必要です。あるいは、Vercel のようなサーバーレスプラットフォームに Next.js アプリケーションをデプロイできます。

### Serverless Node.js

サーバーレスは、Edge Runtime よりも複雑な計算負荷を処理できるスケーラブルなソリューションが必要な場合に最適です。例えば、Vercel 上の Serverless Functions では、インポートされたパッケージ、フォント、ファイルを含めて、コード全体のサイズは[50MB](https://vercel.com/docs/concepts/limits/overview#serverless-function-size)です。

[Edge](https://vercel.com/docs/concepts/functions/edge-functions)を使用するルートと比較した場合の欠点は、サーバーレスファンクションがリクエストの処理を開始するまでに、起動に数百ミリ秒かかる可能性があることです。サイトのトラフィック量によっては、ファンクションが頻繁に"warm"にならないため、この現象が頻繁に発生する可能性があります。

## 例

### Segment のランタイムオプション

Next.js アプリケーションでは、個々のルート Segment に対してランタイムを指定できます。そのためには、[`runtime`という変数を宣言してそれをエクスポート](/docs/app-router/api-reference/file-conventions/route-segment-config)します。この変数は文字列で、`'nodejs'` または `'edge'` ランタイムのどちらかの値でなければなりません。

次の例は、`edge`という値の`runtime`をエクスポートするページルート Segment を示しています。

```tsx title="app/page.tsx"
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

レイアウトレベルで`runtime`を定義すると、その場合、レイアウト配下のすべてのルートが edge ランタイムで実行されます：

```tsx title="app/layout.tsx"
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

Segment ランタイムが設定されていない場合、デフォルトの`nodejs`ランタイムが使用されます。Node.js ランタイムから変更する予定がない場合は、`runtime`オプションを使用する必要はありません。

> 利用可能な API の一覧は、[Node.js ドキュメント](https://nodejs.org/docs/latest/api/)と[Edge ドキュメント](/docs/app-router/api-reference/edge)を参照してください。どちらのランタイムも、デプロイのインフラに応じて[ストリーミング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)をサポートすることができます。
