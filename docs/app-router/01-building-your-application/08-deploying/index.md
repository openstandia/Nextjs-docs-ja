---
title: デプロイ
description: Learn how to deploy your Next.js app to production, either managed or self-hosted.
---

おめでとうございます！Next.js アプリケーションをデプロイする準備が整いました。このページでは、[Next.js Build API](#nextjs-build-api) を使ってマネージドまたはセルフホストでデプロイする方法を説明します。

## Next.js Build API

`next build`を実行すると本番環境用に最適化されたバージョンのアプリケーションが生成されます。この標準出力には以下が含まれます：

- `getStaticProps`または[Automatic Static Optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)を用いた HTML ファイル
- グローバルスタイルまたは個別にスコープされたスタイル用の CSS ファイル
- Next.js サーバーから動的コンテンツをプリレンダリングする JavaScript
- React によるクライアントサイドでのインタラクティブ性を実現する JavaScript

この出力は`.next`フォルダ内に生成されます：

<!-- TODO: Fix link -->

- `.next/static/chunks/pages` – このフォルダ内の各 JavaScript ファイルは、同じ名前のルートに対応しています。たとえば、`.next/static/chunks/pages/about.js`は、アプリケーションで`/about`ルートを表示するときに読み込まれる JavaScript ファイルです
- `.next/static/media` – `next/image`から静的にインポートされた画像はハッシュ化され、ここにコピーされます
- `.next/static/css` – アプリケーションの全ページのグローバル CSS ファイル
- `.next/server/pages` – HTML と JavaScript のエントリーポイントは、サーバーからプリレンダリングされます。`.nft.json`ファイルは、[Output File Tracing](https://nextjs.org/docs/pages/api-reference/next-config-js/output)が有効な場合に作成され、指定されたページに依存するすべてのファイルパスを含んでいます
- `.next/server/chunks` – アプリケーション内の複数の場所で共有され、使用される JavaScript のチャンク
- `.next/cache` – Next.js サーバーからビルドキャッシュとキャッシュされた画像、レスポンス、ページを出力します。キャッシュを使用すると、ビルド時間が短縮され、画像の読み込みパフォーマンスが向上します

<!-- TODO: Fix link -->

`.next`内のすべての JavaScript コードは**コンパイル**され、ブラウザバンドルは最高のパフォーマンスを達成し、[すべてのモダンブラウザ](https://nextjs.org/docs/architecture/supported-browsers)をサポートするために最小化されています。

## Vercel によるマネージドな Next.js

[Vercel](https://vercel.com)は、設定なしで Next.js アプリケーションをデプロイする最速の方法です。

Vercel にデプロイする際、プラットフォームは[自動的に Next.js を検出](https://vercel.com/solutions/nextjs)し、`next build`を実行、ビルド結果を以下のように最適化します：

<!-- TODO: Fix links -->

- 変更がない場合、デプロイメントをまたいでキャッシュされたアセットを永続化する
- コミットごとに一意の URL を持つ[Immutable deployments](https://vercel.com/features/previews)
- 可能であれば[Pages](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)は自動で静的に最適化される
- アセット（JavaScript、CSS、画像、フォント）は圧縮され、[グローバルエッジネットワーク](https://vercel.com/features/infrastructure)から提供される
- [API ルート](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)は、無限にスケール可能な独立した[Serverless Functions](https://vercel.com/features/infrastructure)として自動的に最適化される
- [ミドルウェア](https://nextjs.org/docs/pages/building-your-application/routing/middleware)は、コールドスタートがなく、即座に起動する[Edge Functions](https://vercel.com/features/edge-functions)として自動的に最適化される

加えて、Vercel は次のような機能を提供しています：

<!-- TODO: Fix links -->

- [Next.js Speed Insights](https://vercel.com/analytics)によるパフォーマンスの自動監視
- HTTPS および SSL 証明書の自動適用
- 自動 CI/CD（GitHub、GitLab、Bitbucket などを通じて）
- [環境変数](https://vercel.com/docs/concepts/projects/environment-variables)のサポート
- [カスタムドメイン](https://vercel.com/docs/custom-domains)のサポート
- `next/image`による[イメージ最適化](https://nextjs.org/docs/pages/building-your-application/optimizing/images)のサポート
- `git push`による即時グローバルデプロイメント

[Vercel への Next.js アプリケーションのデプロイ](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/hello-world&project-name=hello-world&repository-name=hello-world)は無料で試すことができます。

## セルフホスティング

<!-- TODO: Fix links -->

Node.js または Docker を使用して、すべての機能をサポートした Next.js をセルフホストできます。静的 HTML エクスポートも可能ですが、これにはいくつかの[制限](/docs/app-router/building-your-application/deploying/#静的な-html-のエクスポート)があります。

### Node.js サーバー

Next.js は、Node.js をサポートしているホスティングプロバイダーにデプロイできます。たとえば、[AWS EC2](https://aws.amazon.com/ec2/)や[DigitalOcean Droplet](https://www.digitalocean.com/products/droplets/)などです。

この場合は、`package.json`に `"build"`と `"start"` スクリプトがあることを確認してください：

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

次に、`npm run build`を実行してアプリケーションをビルドします。最後に、`npm run start`を実行して Node.js サーバーを起動します。このサーバーは Next.js のすべての機能をサポートしています。

> [`next/image`](/docs/app-router/building-your-application/optimizing/images)を使用している場合は、プロジェクトディレクトリで`npm install sharp`を実行して、本番環境でよりパフォーマンスの高い[画像最適化](/docs/app-router/building-your-application/optimizing/images)のために`sharp`を追加することを検討してください。Linux プラットフォームでは、メモリの過剰使用を防ぐために sharp の[追加設定](https://sharp.pixelplumbing.com/install#linux-memory-allocator)が必要になる場合があります。

### Docker Image

Next.js は、[Docker](https://www.docker.com/)コンテナをサポートするホスティングプロバイダにデプロイできます。[Kubernetes](https://kubernetes.io/)や[HashiCorp Nomad](https://www.nomadproject.io/)のようなコンテナ・オーケストレータにデプロイする場合にも、任意のクラウドプロバイダの単一ノード内で実行する場合にも、この方法を使用できます。

1. あなたのマシンに[Docker をインストール](https://docs.docker.com/get-docker/)する
1. [with-docker のサンプル](https://github.com/vercel/next.js/tree/canary/examples/with-docker)をクローンする
1. コンテナをビルドする： `docker build -t nextjs-docker .`
1. コンテナを実行する： `docker run -p 3000:3000 nextjs-docker`

複数の環境で異なる環境変数を使用する必要がある場合は、[with-docker-multi-env](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env)の例を参照してください。

### 静的な HTML のエクスポート

Next.js アプリを静的な HTML にエクスポートを行いたい場合は、[静的 HTML エクスポートのドキュメント](/docs/app-router/building-your-application/deploying/static-exports)を参照してください。

## その他のサービス

以下のサービスは Next.js `v12+`に対応しています。以下に、各サービスへの Next.js のデプロイ例やガイドを示します。

### マネージド・サーバー

- [AWS Copilot](https://aws.github.io/copilot-cli/)
- [Digital Ocean App Platform](https://docs.digitalocean.com/tutorials/app-nextjs-deploy/)
- [Google Cloud Run](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Heroku](https://elements.heroku.com/buildpacks/mars/heroku-nextjs)
- [Railway](https://docs.railway.app/getting-started)
- [Render](https://render.com/docs/deploy-nextjs-app)

> **Good to know**: [上記の例](#docker-image)のように、Dockerfile を使用できるマネージド・プラットフォームもあります。

### 静的サイト

<!-- TODO: Fix link -->

[`output: 'export'`](/docs/app-router/building-your-application/deploying/static-exports)を使用した Next.js のデプロイは、以下のサービスでのみサポートしています。

- [GitHub Pages](https://github.com/vercel/next.js/tree/canary/examples/github-pages)

<!-- TODO: Fix link -->

また[`output：'export'`](/docs/app-router/building-your-application/deploying/static-exports)から任意の静的ホスティング・プロバイダにデプロイも可能です。GitHub Actions、Jenkins、AWS CodeBuild、Circle CI、Azure Pipelines などの CI/CD パイプラインを通してデプロイできます。

### Serverless

- [AWS Amplify](https://aws.amazon.com/blogs/mobile/amplify-next-js-13/)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/nextjs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Firebase](https://firebase.google.com/docs/hosting/nextjs)
- [Netlify](https://docs.netlify.com/integrations/frameworks/next-js)
- [Terraform](https://github.com/milliHQ/terraform-aws-next-js)
- [SST](https://docs.sst.dev/start/nextjs)

> **Good to know**: すべてのサーバーレス・プロバイダーが`next start`の[Next.js Build API](#nextjs-build-api)を実装しているわけではありません。どのような機能がサポートされているかは、プロバイダに確認してください。

## 自動アップデート

Next.js アプリケーションをデプロイするとき、リロードすることなく最新バージョンを表示したいでしょう。

Next.js は、ルーティング時にバックグラウンドでアプリケーションの最新バージョンを自動的に読み込みます。クライアントサイドのナビゲーションの場合、`next/link`は一時的に通常の`<a>`タグとして機能します。

> **Good to know**: 新しいページ（古いバージョン）がすでに`next/link`によってプリフェッチされている場合、Next.js は古いバージョンを使用します。プリフェッチ*されていない*（かつ CDN レベルでキャッシュされていない）ページに移動すると、最新バージョンがロードされます。

## 手動によるグレースフル・シャットダウン

セルフホスティングの場合、`SIGTERM`や`SIGINT`シグナルでサーバーがシャットダウンしたときにコードを実行したい場合があります。

この場合、環境変数`NEXT_MANUAL_SIG_HANDLE`を`true`に設定し、`_document.js`ファイル内にそのシグナル用のハンドラを登録します。`.env`ファイルではなく、`package.json`スクリプトに直接、環境変数を登録する必要があります。

> **Good to know**: 手動によるシグナルの処理は`next dev`ではできません。

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "NEXT_MANUAL_SIG_HANDLE=true next start"
  }
}
```

```js title="pages/_document.js"
if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  // カスタムの _document に追加してください
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM: ', 'cleaning up')
    process.exit(0)
  })

  process.on('SIGINT', () => {
    console.log('Received SIGINT: ', 'cleaning up')
    process.exit(0)
  })
}
```
