---
title: OpenTelemetry
description: Learn how to instrument your Next.js app with OpenTelemetry.
---

> **Good to know**: この機能は**実験的**なものなので、`next.config.js`で`experimental.instrumentationHook = true;`を指定して、明示的にオプトインする必要があります。

Next.js アプリの動作とパフォーマンスを理解し、最適化するために、観測可能性（observability、オブザーバビリティ）は非常に重要です。

アプリケーションが複雑になればなるほど、発生する可能性のある問題を特定し、診断することはますます難しくなります。ロギングやメトリクスなどの観測可能性ツールを活用することで、開発者はアプリケーションの動作に関する洞察を得て、最適化すべき領域を特定できます。観測可能性によって、開発者は問題が大きくなる前に事前対処し、より良いユーザー・エクスペリエンスを提供できます。したがって、パフォーマンスの向上、リソースの最適化、ユーザー・エクスペリエンスの向上のために、Next.js アプリケーションで観測可能性を利用することを強く推奨します。

アプリケーションの計測には OpenTelemetry の使用を推奨します。OpenTelemetry はプラットフォームにとらわれないアプリケーションの計測方法で、コードを変更することなくプロバイダを変更できます。OpenTelemetry とその仕組みについての詳細は、[OpenTelemetry の公式ドキュメント](https://opentelemetry.io/docs/)をお読みください。

<!-- textlint-disable -->

このドキュメントでは、スパン（Span）、トレース（Trace）、エクスポーター（Exporter）などの用語を使用していますが、[OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)で解説されています。

<!-- textlint-enable -->

Next.js は OpenTelemetry による計測をサポートしており、これは Next.js 自体がすでに計測されていることを意味します。OpenTelemetry を有効にすると、`getStaticProps`のようなコードはすべて、有用な属性を持つ*spans*に自動的にラップされます。

> **Good to know**: 現在、OpenTelemetry バインディングはサーバーレス関数でのみサポートしています。`edge`やクライアント側のコードには提供していません。

## はじめに

OpenTelemetry は拡張可能ですが、適切にセットアップするのはかなり冗長です。そのため、私たちは手早く始めるためのパッケージ @vercel/otel を用意しました。拡張性はないので、セットアップをカスタマイズする必要があれば、手動で OpenTelemetry を設定してください。

### `@vercel/otel`を使用する

最初に`@vercel/otel`をインストールします。

```bash title="Terminal"
npm install @vercel/otel
```

次に、`instrumentation.ts`（または`.js`）ファイルをプロジェクトのルート・ディレクトリー（`src`フォルダを使用している場合は`src`フォルダー内）に作成します：

```ts title="your-project/instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

<!-- TODO: Fix link -->

> **Good to know**
>
> - `instrumentation`ファイルはプロジェクトのルートに置く必要があり、`app`や`pages`ディレクトリの中には置かないでください。`src`フォルダを使用している場合は、`src`の中に`pages`、`app`と同じ階層にファイルを置いてください
> - [`pageExtensions`コンフィグオプション](/docs/app-router/api-reference/next-config-js/pageExtensions)を使ってサフィックスを追加する場合、`instrumentation`のファイル名もそれに合わせて更新する必要があります
> - 基本的な使用方法の例として[with-opentelemetry](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry)を参照してください

### OpenTelemetry の手動設定

ラッパーである`@vercel/otel`がニーズに合わない場合、OpenTelemetry を手動で設定できます。

まず、OpenTelemetry パッケージをインストールします：

```bash title="Terminal"
npm install @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

<!-- textlint-disable -->

これで、`instrumentation.ts`で`NodeSDK`を初期化できます。OpenTelemetry の API はエッジ・ランタイムと互換性がないので、`process.env.NEXT_RUNTIME === 'nodejs'`の時だけインポートしていることを確認する必要があります。そのため、`instrumentation.node.ts`を作成し、Node.js を使用しているときだけインポートされるようにします：

<!-- textlint-enable -->

```ts title="instrumentation.ts"
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.ts')
  }
}
```

```ts title="instrumentation.node.ts"
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

<!-- textlint-disable -->

これは`@vercel/otel`を使う場合でも同様ですが、修正や拡張が可能です。例えば`@opentelemetry/exporter-trace-otlp-http`の代わりに`@opentelemetry/exporter-trace-otlp-grpc`を使用したり、より多くのリソース属性を指定できます。

<!-- textlint-enable -->

## 計測のテスト

OpenTelemetry のトレースをローカルでテストするには、互換性のあるバックエンドを持つ OpenTelemetry コレクターが必要です。Vercel の[OpenTelemetry 開発環境](https://github.com/vercel/opentelemetry-collector-dev-setup)を使うことをお勧めします。

すべてがうまくいっていれば、`GET /requested/pathname`とラベル付けされたルートサーバーのスパンを見ることができるはずです。その特定のトレースからのすべてのスパンは下にネストされます。

Next.js は、デフォルトで出力されるよりも多くのスパンをトレースします。より多くのスパンを表示するには、`NEXT_OTEL_VERBOSE=1`を設定する必要があります。

## デプロイ

### OpenTelemetry Collector を使用する

OpenTelemetry Collector でデプロイする場合、`@vercel/otel`を使うことができます。Vercel、セルフホスティングともに動作します。

#### Vecel へのデプロイ

OpenTelemetry が Vercel 上ですぐに動くことは説明しました。

[Vercel のドキュメント](https://vercel.com/docs/concepts/observability/otel-overview/quickstart)に従って、あなたのプロジェクトをプロバイダーに接続してください。

#### セルフホスティング

他のプラットフォームへのデプロイも簡単です。Next.js アプリからテレメトリーデータを受信して処理するために、独自の OpenTelemetry Collector を起動する必要があります。

<!-- textlint-disable -->

そのために[OpenTelemetry Collector Getting Started ガイド](https://opentelemetry.io/docs/collector/getting-started/)に従って、コレクターのセットアップと、Next.js アプリケーションからデータを受信するための設定をします。

<!-- textlint-enable -->

コレクターを立ち上げて実行したら、それぞれのデプロイメントガイドに従って、Next.js アプリケーションを選択したプラットフォームにデプロイできます。

### カスタムのエクスポーター

<!-- textlint-disable -->

OpenTelemetry Collector の使用を推奨しますが、利用しているプラットフォームで使用できない場合、カスタムの OpenTelemetry エクスポーターを使い、[OpenTelemetry の設定を手動で行う](#opentelemetry-の手動設定)ことができます。

<!-- textlint-enable -->

## カスタムのスパン

[OpenTelemetry API](https://opentelemetry.io/docs/instrumentation/js/instrumentation)を使ってカスタム・スパンを追加できます。

```bash title="Terminal"
npm install @opentelemetry/api
```

次の例は、GitHub の stars を取得する関数と、取得結果を追跡するための`fetchGithubStars`スパンを追加したものです：

```js
import { trace } from '@opentelemetry/api'

export async function fetchGithubStars() {
  return await trace
    .getTracer('nextjs-example')
    .startActiveSpan('fetchGithubStars', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
```

コードが新しい環境で実行される前に`register`関数が実行されます。新しいスパンの作成が開始され、それらはエクスポートされたトレースに正しく追加されるはずです。

## Next.js のデフォルトのスパン

Next.js は、アプリケーションのパフォーマンスに関する有用な洞察を提供するために、いくつかのスパンを自動的に計測します。

スパンの属性は[OpenTelemetry のセマンティック規約](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/)に従います。また`next`名前空間の下にいくつかのカスタム属性を追加します：

- `next.span_name` - スパン名の複製
- `next.span_type` - 各スパンタイプの一意の識別子
- `next.route` - リクエストのルートパターン（例： `/[param]/user`）
- `next.page`
  - App Router が使用する内部値
  - 特殊ファイル（`page.ts`、`layout.ts`、`loading.ts`などのような）へのルート
  - `/layout`は`/(groupA)/layout.ts`と`/(groupB)/layout.ts`を識別するために使用できるため、`next.route`と組み合わせた場合にのみ一意な識別子として使用できる

### `[http.method] [next.route]`

- `next.span_type`: `BaseServer.handleRequest`

このスパンは、Next.js アプリケーションへの各リクエストのルート・スパンを表します。リクエストの HTTP メソッド、ルート、ターゲット、ステータスコードを追跡します。

属性：

- [Common HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#common-attributes)
  - `http.method`
  - `http.status_code`
- [Server HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#http-server-semantic-conventions)
  - `http.route`
  - `http.target`
- `next.span_name`
- `next.span_type`
- `next.route`

### `render route (app) [next.route]`

- `next.span_type`: `AppRender.getBodyResult`.

このスパンは、App Router でルートをレンダリングするプロセスを表します。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `fetch [http.method] [http.url]`

- `next.span_type`: `AppRender.fetch`

このスパンは、コード上で実行されたフェッチリクエストを表します。

属性：

- [Common HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#common-attributes)
  - `http.method`
- [Client HTTP attributes](https://opentelemetry.io/docs/reference/specification/trace/semantic_conventions/http/#http-client)
  - `http.url`
  - `net.peer.name`
  - `net.peer.port` (only if specified)
- `next.span_name`
- `next.span_type`

### `executing api route (app) [next.route]`

- `next.span_type`: `AppRouteRouteHandlers.runHandler`.

このスパンは、App Router における API ルートハンドラの実行を表します。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `getServerSideProps [next.route]`

- `next.span_type`: `Render.getServerSideProps`.

このスパンは、特定のルートに対する`getServerSideProps`の実行を表します。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `getStaticProps [next.route]`

- `next.span_type`: `Render.getStaticProps`.

このスパンは、特定のルートに対する`getStaticProps`の実行を表します。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `render route (pages) [next.route]`

- `next.span_type`: `Render.renderDocument`.

このスパンは、特定のルートに対してドキュメントをレンダリングするプロセスを表します。

属性：

- `next.span_name`
- `next.span_type`
- `next.route`

### `generateMetadata [next.page]`

- `next.span_type`: `ResolveMetadata.generateMetadata`.

このスパンは、特定のページのメタデータを生成するプロセスを表します（1 つのルートは、このスパンを複数持つことができる）。

属性：

- `next.span_name`
- `next.span_type`
- `next.page`
