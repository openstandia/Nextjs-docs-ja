---
title: デプロイ
description: Next.jsアプリをプロダクション環境にデプロイする方法を学びましょう。管理された環境またはセルフホスト環境のいずれかを選択することができます。
---

おめでとうございます！Next.js アプリケーションをデプロイする準備が整いました。このページでは、[Next.js Build API](#nextjs-build-api) を使ってマネージドまたはセルフホストでデプロイする方法を説明します。

## プロダクションビルド

`next build`を実行すると本番環境用に最適化されたバージョンのアプリケーションが生成されます。HTML、CSS、JavaScript ファイルは、お客様のページに基づいて作成されます。
JavaScript コードは**コンパイル**され、ブラウザバンドルは最高のパフォーマンスを達成し、[すべてのモダンブラウザ](https://nextjs.org/docs/architecture/supported-browsers)をサポートするために最小化されています。

Next.js は、マネージド Next.js とセルフホスト Next.js で使用される標準のデプロイメント出力を生成します。これにより、両方のデプロイ方法ですべての機能がサポートされます。次のメジャーバージョンでは、この出力を[ビルド出力 API 仕様](https://vercel.com/docs/build-output-api/v3?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)に変換する予定です。

## Vercel によるマネージドな Next.js

Next.js の開発・保守を行う [Vercel](https://vercel.com) は、Next.js アプリケーションのためのマネージドインフラストラクチャと開発者体験プラットフォームを提供します。

Vercel へのデプロイはゼロコンフィギュレーションで、スケーラビリティ、可用性、パフォーマンスがグローバルに強化されます。ただし、セルフホストでも Next.js の機能はすべてサポートされます。

[Vercel で Next.js の詳細](https://vercel.com/docs/frameworks/nextjs?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)をご覧いただくか、[無料でテンプレート](https://vercel.com/templates/next.js?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)をデプロイしてお試しください。

## セルフホスティング

Next.js をセルフホスティングするには、3 つの方法があります：

- [Node.js サーバー](/docs/app-router/building-your-application/deploying#nodejs-サーバー)
- [Docker コンテナ](/docs/app-router/building-your-application/deploying#docker-image)
- [静的エクスポート](/docs/app-router/building-your-application/deploying#静的な-html-のエクスポート)

### Node.js サーバー

Next.js は、Node.js をサポートしているホスティングプロバイダーにデプロイできます。
この場合は、`package.json`に `"build"`と `"start"` スクリプトがあることを確認してください：

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

次に、`npm run build`を実行してアプリケーションをビルドします。最後に、`npm run start`を実行して Node.js サーバーを起動します。このサーバーは Next.js のすべての機能をサポートしています。

### Docker Image

Next.js は、[Docker](https://www.docker.com/)コンテナをサポートするホスティングプロバイダにデプロイできます。[Kubernetes](https://kubernetes.io/)や[HashiCorp Nomad](https://www.nomadproject.io/)のようなコンテナ・オーケストレータにデプロイする場合にも、任意のクラウドプロバイダの単一ノード内で実行する場合にも、この方法を使用できます。

1. あなたのマシンに[Docker をインストール](https://docs.docker.com/get-docker/)する
1. [with-docker のサンプル](https://github.com/vercel/next.js/tree/canary/examples/with-docker)をクローンする
1. コンテナをビルドする： `docker build -t nextjs-docker .`
1. コンテナを実行する： `docker run -p 3000:3000 nextjs-docker`

複数の環境で異なる環境変数を使用する必要がある場合は、[with-docker-multi-env](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env)の例を参照してください。

### 静的な HTML のエクスポート

Next.js は、静的サイトまたはシングルページアプリケーション（SPA）として開始し、その後オプションでサーバーを必要とする機能を使用するようにアップグレードすることができます。

Next.js はこの[静的エクスポート](/docs/app-router/building-your-application/deploying/static-exports)をサポートしているので、HTML/CSS/JS の静的アセットを提供できるウェブサーバーであれば、どこにでもデプロイしてホストできます。これには、AWS S3、Nginx、Apache などのツールが含まれます。

[静的エクスポート](/docs/app-router/building-your-application/deploying/static-exports)として実行すると、サーバーを必要とする Next.js の機能はサポートされません。詳細は[こちら](/docs/app-router/building-your-application/deploying/static-exports#unsupported-features)。

> **Good to know**
>
> - [Server Component](/docs/app-router/building-your-application/rendering/server-components) は静的エクスポートでサポートされています。

## Features

### 画像最適化

`next/image` を使用した[画像最適化](/docs/app-router/building-your-application/optimizing/images)は、`next start` を使用してデプロイする場合、設定なしでセルフホストで動作します。画像の最適化を別のサービスで行いたい場合は、[イメージローダーを設定](/docs/app-router/building-your-application/optimizing/images#loaders)できます。

画像の最適化は、`next.config.js` でカスタム画像ローダーを定義することで、[静的エクスポート](/docs/app-router/building-your-application/deploying/static-exports#image-optimization)で使用できます。画像の最適化は、ビルド時ではなく、実行時に行われることに注意してください。

> **Good to konw**:
>
> - セルフホスティングの場合は、プロジェクトディレクトリで `npm install sharp` を実行して、本番環境でよりパフォーマンスの高い[画像最適化](/docs/app-router/building-your-application/optimizing/images)のために sharp をインストールすることを検討してください。Linux プラットフォームでは、過剰なメモリ使用を防ぐために `sharp` の[追加設定](https://sharp.pixelplumbing.com/install#linux-memory-allocator)が必要になる場合があります。
> - [最適化された画像のキャッシュ動作](/docs/app-router/api-reference/components/image#キャッシュの制御)と、TTL の設定方法について詳しく説明します。
> - [画像最適化を無効](/docs/app-router/api-reference/components/image#unoptimized)にしても、`next/image` を使用する他の利点を維持することもできます。例えば、自分で画像を個別に最適化する場合などです。

### Middleware

`next start` を使用してデプロイする場合、[Middleware](/docs/app-router/building-your-application/routing/middleware) は設定なしでセルフホストで動作します。着信リクエストにアクセスする必要があるため、[静的エクスポート](/docs/app-router/building-your-application/deploying/static-exports)を使用する場合はサポートされません。

Middleware は、利用可能なすべての Node.js API のサブセットである[ランタイム](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes)を使用し、アプリケーション内のすべてのルートまたはアセットの前で実行される可能性があるため、低レイテンシを確保するのに役立ちます。このランタイムは "エッジで "実行する必要はなく、単一領域のサーバーで動作する。複数のリージョンでミドルウェアを実行するには、追加の設定とインフラストラクチャが必要です。

すべての Node.js API を必要とするロジックを追加する（または外部パッケージを使用する）場合は、このロジックを [Server Component](/docs/app-router/building-your-application/rendering/server-components) として[レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト)に移動することができます。例えば、[ヘッダ](/docs/app-router/api-reference/functions/headers)のチェックや[リダイレクト](/docs/app-router/api-reference/functions/redirect)などです。`next.config.js` を通して、ヘッダ、クッキー、クエリパラメータを使って[リダイレクト](/docs/app-router/api-reference/next-config-js/redirects#header-cookie-and-query-matching)や[書き換え](/docs/app-router/api-reference/next-config-js/rewrites#header-cookie-and-query-matching)を行うこともできます。それでもうまくいかない場合は、[カスタムサーバー](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)を使うこともできます。

### 環境変数

Next.js は、ビルド時と実行時の両方の環境変数をサポートできる。

デフォルトでは、環境変数はサーバーでのみ利用可能です。環境変数をブラウザに公開するには、`NEXT_PUBLIC`を先頭につける必要があります。ただし、これらの公開環境変数は `next build` 時に JavaScript バンドルにインライン化されます。

実行時環境変数を読み込むには、`getServerSideProps` を使用するか、[App Router を段階的に採用する](/docs/app-router/building-your-application/upgrading/app-router-migration)ことをお勧めします。App Router を使えば、動的レンダリング中にサーバー上の環境変数を安全に読み取ることができる。これにより、異なる値を持つ複数の環境を通して昇格させることができる単一の Docker イメージを使用することができます。

```js
import { unstable_noStore as noStore } from 'next/cache';

export default function Component() {
  noStore();
  // cookies(), headers(), and other dynamic functions
  // will also opt into dynamic rendering, making
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  ...
}
```

> **Good to know**:
> [`register` 関数](/docs/app-router/building-your-application/optimizing/instrumentation)を使えば、サーバー起動時にコードを実行できる。
> [runtimeConfig](https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration) オプションは、スタンドアロン出力モードでは動作しないため、使用は推奨しない。代わりに、App Router を[段階的に採用する](/docs/app-router/building-your-application/upgrading/app-router-migration)ことを推奨する。

### キャッシュと ISR

Next.js は、レスポンス、生成された静的ページ、ビルド出力、画像、フォント、スクリプトなどの静的アセットをキャッシュできます。

ページのキャッシュと再検証（ISR（Incremental Static Regeneration）または App Router の新しい関数を使用）は、同じ共有キャッシュを使用します。デフォルトでは、このキャッシュは Next.js サーバーのファイルシステム（ディスク）に保存されます。これは、Pages と App Router の両方を使用してセルフホストする場合に自動的に機能します。

キャッシュされたページやデータを耐久性のあるストレージに永続化したい場合や、Next.js アプリケーションの複数のコンテナやインスタンスでキャッシュを共有したい場合は、Next.js キャッシュの場所を設定できます。

#### 自動キャッシュ

- Next.js は、本当にイミュータブルなアセットには、`Cache-Control` ヘッダーに `public, max-age=31536000, immutable` を設定します。これは上書きできません。これらのイミュータブル ファイルは、ファイル名に SHA ハッシュが含まれているため、安全に無期限にキャッシュできます。例えば、[静的画像のインポート](/docs/app-router/building-your-application/optimizing/images)です。画像の [TTL を設定](/docs/app-router/api-reference/components/image)できます。
- Incremental Static Regeneration (ISR)は `s-maxage: <revalidate in getStaticProps>, stale-while-revalidate`の `Cache-Control` ヘッダを設定します。この再バリデーション時間は、[`getStaticProps` 関数](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props)で秒単位で定義されます。`revalidate:false` を設定すると、デフォルトで 1 年間のキャッシュ期間が設定されます。
- 動的にレンダリングされるページでは、ユーザ固有のデータがキャッシュされないように、`private, no-cache, no-store, max-age=0, must-revalidate` の `Cache-Control` ヘッダが設定されます。これは、App Router と Pages Router の両方に適用されます。これには[ドラフトモード](/docs/app-router/building-your-application/configuring/draft-mode)も含まれます。

#### 静的アセット

静的アセットを別のドメインまたは CDN でホストしたい場合は、`next.config.js` で `assetPrefix` [設定](/docs/app-router/api-reference/next-config-js/assetPrefix)を使用できます。Next.js は、JavaScript や CSS ファイルを取得するときに、このアセット接頭辞を使用します。アセットを別のドメインに分離すると、DNS と TLS の解決に余分な時間がかかるという欠点があります。

assetPrefix の詳細は[こちら](/docs/app-router/api-reference/next-config-js/assetPrefix)。

#### キャッシュ設定

デフォルトでは、生成されたキャッシュアセットはメモリ（デフォルトは 50MB）とディスクに保存されます。Kubernetes のようなコンテナオーケストレーションプラットフォームを使って Next.js をホスティングしている場合、各 Pod はキャッシュのコピーを持ちます。デフォルトではキャッシュが Pod 間で共有されないため、古いデータが表示されるのを防ぐには、Next.js キャッシュを設定してキャッシュハンドラを提供し、メモリ内キャッシュを無効にします。

セルフホスト時に ISR/Data Cache の場所を設定するには、`next.config.js` ファイルにカスタムハンドラを設定します：

```js title="next.config.js"
module.exports = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
    isrMemoryCacheSize: 0, // disable default in-memory caching
  },
}
```

次に、例えばプロジェクトのルートに cache-handler.js を作成します：

```js title="cache-handler.js"
const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    // This could be stored anywhere, like durable storage
    return cache.get(key)
  }

  async set(key, data, ctx) {
    // This could be stored anywhere, like durable storage
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    })
  }

  async revalidateTag(tag) {
    // Iterate over all entries in the cache
    for (let [key, value] of cache) {
      // If the value's tags include the specified tag, delete this entry
      if (value.tags.includes(tag)) {
        cache.delete(key)
      }
    }
  }
}
```

カスタムキャッシュハンドラを使用すると、Next.js アプリケーションをホストするすべての Pod で一貫性を確保できます。たとえば、[Redis](https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis) や AWS S3 など、任意の場所にキャッシュ値を保存できます。

> **Good to know**:
>
> - `revalidatePath` はキャッシュ・タグの上にある便利なレイヤーです。`revalidatePath` を呼び出すと、提供されたページのための特別なデフォルトタグで `revalidateTag` 関数が呼び出されます。

### ビルドキャッシュ

Next.js は `next build` 時に ID を生成し、どのバージョンのアプリケーションが提供されるかを識別します。同じビルドを使用して、複数のコンテナを起動する必要があります。

環境のステージごとに再構築する場合は、コンテナ間で使用する一貫したビルド ID を生成する必要があります。`next.config.js` の `generateBuildId` コマンドを使用します：

```js title="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // This could be anything, using the latest git hash
    return process.env.GIT_HASH
  },
}
```

### Version Skew

Next.js は、[version Skew](https://www.industrialempathy.com/posts/version-skew/)のほとんどのインスタンスを自動的に軽減し、検出されると自動的にアプリケーションをリロードして新しいアセットを取得します。たとえば、ビルド ID に不一致がある場合、ページ間の遷移は、プリフェッチされた値を使用するのではなく、ハードナビゲーションを実行します。

アプリケーションがリロードされるとき、ページナビゲーション間で永続するように設計されていない場合、アプリケーションの状態が失われる可能性があります。例えば、URL ステートやローカルストレージを使用すると、ページ更新後もステートが持続します。しかし、`useState` のようなコンポーネントの状態は、そのようなナビゲーションの際に失われます。

Vercel は、Next.js アプリケーションに追加の[skew protection](https://vercel.com/docs/deployments/skew-protection?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)を提供し、新しいビルドがデプロイされている間も、以前のビルドのアセットと関数が利用可能であることを保証します。
