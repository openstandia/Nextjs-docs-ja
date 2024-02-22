---
title: Production Checklist
description: Next.jsアプリケーションを本番環境に導入する前に、最高のパフォーマンスとユーザーエクスペリエンスを確保するための推奨事項です。
---

Next.js アプリケーションを本番環境に導入する前に、最高のユーザーエクスペリエンス、パフォーマンス、セキュリティのために実装を検討すべき最適化とパターンがいくつかあります。

このページでは、[アプリケーションのビルド時](#開発中)、[本番移行前](#本番移行前)、[デプロイ後](#デプロイ後)に参照できるベストプラクティスと、注意すべき Next.js の[自動最適化](#自動最適化)について説明します。

## 自動最適化

これらの Next.js の最適化はデフォルトで有効になっており、設定は不要です:

- **[Server Components](/docs/app-router/building-your-application/rendering/server-components):** Next.js はデフォルトで Server Components を使用します。Server Components はサーバー上で動作し、クライアント上で JavaScript をレンダリングする必要はありません。そのため、クライアントサイドの JavaScript バンドルサイズに影響を与えません。必要に応じて [Client Components](/docs/app-router/building-your-application/rendering/client-components) を使用し、インタラクティブな処理を行うことができます。
- **[コード分割](/docs/app-router/building-your-application/routing/linking-and-navigating#1-コード分割):** Server Components は、ルートセグメントによる自動的なコード分割を可能にします。また、必要に応じて、Client Components とサードパーティライブラリの[遅延ロード](/docs/app-router/building-your-application/optimizing/lazy-loading)を検討することもできます。
- **[プリフェッチ](/docs/app-router/building-your-application/routing/linking-and-navigating#2-プリフェッチ):** 新しいルートへのリンクがユーザーのビューポートに入ると、Next.js はバックグラウンドでルートをプリフェッチします。これにより、新しいルートへのナビゲーションがほとんど瞬時になります。必要に応じて、プリフェッチを無効化できます。
- **[静的レンダリング](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト):** Next.js では、ビルド時に Server Components と Client Components を静的にレンダリングし、レンダリング結果をキャッシュしてアプリケーションのパフォーマンスを向上させます。必要に応じて、特定のルートに対して[動的レンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)を有効化できます。
- **[キャッシュ](/docs/app-router/building-your-application/caching):** Next.js は、サーバー、データベース、バックエンドサービスへのネットワークリクエスト数を減らすために、データリクエスト、Server Components と Client Components のレンダリング結果、静的アセットなどをキャッシュします。必要に応じて、キャッシュを無効にすることもできます。

これらのデフォルトは、アプリケーションのパフォーマンスを向上させ、各ネットワークリクエストで転送されるコストとデータ量を削減することを目的としています。

## 開発中

アプリケーションを構築する際には、最高のパフォーマンスとユーザーエクスペリエンスを保証するために、以下の機能を使用することをお勧めします:

### ルーティングとレンダリング

- **[レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト):** レイアウトを使用して、ページ間で UI を共有し、ナビゲーションの[部分レンダリング](/docs/app-router/building-your-application/routing/linking-and-navigating#4-部分レンダリング)を有効にします。
- **[`<Link>` コンポーネント](/docs/app-router/building-your-application/routing/linking-and-navigating#link-コンポーネント):** [クライアントサイドのナビゲーションとプリフェッチ](/docs/app-router/building-your-application/routing/linking-and-navigating#ナビゲーションの仕組み)には `<Link>` コンポーネントを使用します。
- **[Error Handling](/docs/app-router/building-your-application/routing/error-handling):** カスタムエラーページを作成することで、[catch-all errors](/docs/app-router/building-your-application/routing/error-handling)や [404 errors](/docs/app-router/api-reference/file-conventions/not-found) を適切に処理できます。
- **[構成パターン](/docs/app-router/building-your-application/rendering/composition-patterns):** Server Components と Client Components の推奨される構成パターンに従い、クライアント側の JavaScript バンドルが不必要に増えないように、 [`"use client"` 境界](/docs/app-router/building-your-application/rendering/composition-patterns#クライアントのコンポーネントをツリーの下部に移動する) の場所を確認してください。
- **[動的関数](/docs/app-router/building-your-application/rendering/server-components#動的関数):** [`cookies()`](/docs/app-router/api-reference/functions/cookies) や [`searchParams`](/docs/app-router/api-reference/file-conventions/page#searchparams任意) prop のような動的な関数は、ルート全体 ([ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)で使用する場合はアプリケーション全体) を[動的レンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)することに注意してください。動的関数の使用が意図的であることを確認し、適切な場合は `<Suspense>` 境界でラップしてください。

> **Good to know**: [部分プリレンダリング (プレビュー)](https://nextjs.org/blog/next-14#partial-prerendering-preview) は、ルート全体をダイナミックレンダリングにすることなく、ルートの一部をダイナミックレンダリングにします。

### データのフェッチとキャッシュ

- **[Server Components](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating#fetchを使用したサーバー上でのデータフェッチ):** Server Components を使用してサーバー上でデータを取得するメリットを活用します。
- **[Route Handlers](/docs/app-router/building-your-application/routing/route-handlers):** Client Components からバックエンドリソースにアクセスするには、Route Handler を使用します。追加のサーバーリクエストを避けるため、Server Components から Route Handler を呼び出さないでください。
- **[Streaming](/docs/app-router/building-your-application/routing/loading-ui-and-streaming):** Loading UI と React Suspense を使用して、UI をサーバーからクライアントに徐々に送信し、データの取得中にルート全体がブロックされるのを防ぎます。
- **[パラレルなデータフェッチ](/docs/app-router/building-your-application/data-fetching/patterns#パラレルなデータフェッチとシーケンシャルなデータフェッチ):** パラレルにデータをフェッチすることで、ネットワークのウォーターフォールを減らします。また、必要に応じて[データのプリロード](/docs/app-router/building-your-application/data-fetching/patterns#データのプリロード)も検討してください。
- **[データのキャッシュ](/docs/app-router/building-your-application/caching#data-cache):** データリクエストがキャッシュされているかどうかを確認し、必要に応じてキャッシュを選択します。`フェッチ`を使用しないリクエストが[キャッシュ](/docs/app-router/api-reference/functions/unstable_cache)されていることを確認してください。
- **[静的画像](/docs/app-router/building-your-application/optimizing/static-assets):** アプリケーションの静的アセット（画像など）を自動的にキャッシュするには、`public` ディレクトリを使用します。

### UI とアクセシビリティ

- **[Server Actionsとミューテーション](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations):** Server Actions を使用して、フォーム送信、サーバーサイドの検証、エラーハンドリングを行います。
- **[フォントモジュール](/docs/app-router/building-your-application/optimizing/fonts):** フォントモジュールを使用すれば、フォントを最適化できます。フォントファイルを他の静的アセットと一緒に自動的にホストし、外部ネットワークへのリクエストを削除して、[レイアウトのずれ](https://web.dev/articles/cls)を軽減します。
- **[`<Image>` コンポーネント](/docs/app-router/building-your-application/optimizing/images):** レイアウトのずれを防ぎ、WebP や AVIF のような最新のフォーマットで提供する Image コンポーネントを使用することで画像を自動的に最適化します。
- **[`<Script>` コンポーネント](/docs/app-router/building-your-application/optimizing/scripts):** スクリプトを自動的に遅延させ、メインスレッドをブロックしないようにする Script コンポーネントを使用することでサードパーティのスクリプトを最適化します。
- **[ESLint](/docs/app-router/architecture/accessibility#linting):** 組み込みの `eslint-plugin-jsx-a11y` プラグインを使用して、アクセシビリティの問題を早期に発見してください。

### セキュリティ

- **[汚染](/docs/app-router/building-your-application/data-fetching/patterns#preventing-sensitive-data-from-being-exposed-to-the-client):** データオブジェクトや特定の値を汚染することで、センシティブなデータがクライアントに公開されるのを防ぐ。
- **[Server Actions](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations#認証と認可):** ユーザーが Server Actions を呼び出す権限があることを確認します。推奨される[セキュリティ対策](https://nextjs.org/blog/security-nextjs-server-components-actions)を確認してください。
- **[環境変数](/docs/app-router/building-your-application/configuring/environment-variables):** `.env.*`ファイルが `.gitignore` に追加され、パブリック変数だけが `NEXT_PUBLIC_`でプレフィックスされていることを確認してください。
- **[Content Security Policy](/docs/app-router/building-your-application/configuring/content-security-policy):** クロスサイトスクリプティング、クリックジャッキング、その他のコードインジェクション攻撃などの様々なセキュリティ脅威からアプリケーションを保護するために、コンテンツセキュリティポリシーを追加することを検討してください。

### メタデータと SEO

- **[メタデータ API](/docs/app-router/building-your-application/optimizing/metadata):** メタデータ API を使って、ページのタイトルや説明文などを追加し、アプリケーションの検索エンジン最適化（SEO）を改善しましょう。
- **[Open Graph (OG) 画像](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image):** OG 画像を作成し、ソーシャル共有用のアプリケーションを準備します。
- **[サイトマップ](/docs/app-router/api-reference/functions/generate-sitemaps)と[ロボッツテキスト](/docs/app-router/api-reference/file-conventions/metadata/robots):** サイトマップとロボッツテキストファイルを生成することで、検索エンジンのクロールとインデックスを支援します。

### 型安全

- **TypeScript と [TS プラグイン](/docs/app-router/building-your-application/configuring/typescript):** TypeScript と TypeScript プラグインを使用することで、型安全性が向上し、エラーを早期に発見できるようになります。

## 本番移行前

本番環境に移行する前に、`next build` を実行してアプリケーションをローカルでビルドしビルドエラーを検出した後、`next start` を実行して本番環境に近い環境でアプリケーションのパフォーマンスを測定することができます。

### Core Web Vitals

- **[Lighthouse](https://developers.google.com/web/tools/lighthouse):** Lighthouse を裏で実行することで、ユーザーがサイトをどのように体験するかをより深く理解し、改善点を特定することができます。これはシミュレーションテストであり、フィールドデータ（Core Web Vitals など）を見ることと組み合わせる必要があります。
- **[`useReportWebVitals` フック](/docs/app-router/api-reference/functions/use-report-web-vitals):** [Core Web Vitals](https://web.dev/articles/vitals) のデータを分析ツールに送信するには、このフックを使用します。

### バンドルの分析

[`@next/bundle-analyzer` プラグイン](/docs/app-router/building-your-application/optimizing/bundle-analyzer)を使用して JavaScript バンドルのサイズを分析し、アプリケーションのパフォーマンスに影響を与える可能性のある大規模なモジュールや依存関係を特定します。

さらに、以下のツールを使用するとアプリケーションに新しい依存関係を追加した場合の影響を理解することができます:

- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Package Phobia](https://packagephobia.com/)
- [Bundle Phobia](https://bundlephobia.com/)
- [bundlejs](https://bundlejs.com/)

## デプロイ後

アプリケーションをデプロイする場所によっては、アプリケーションのパフォーマンスを監視して改善するのに役立つ追加のツールやインテグレーションを利用できる場合があります。

Vercel の導入については、以下を推奨します:

- **[Analytics](https://vercel.com/analytics?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs):** ユニーク訪問者数、ページビュー数など、アプリケーションのトラフィックを把握するのに役立つ組み込みの分析ダッシュボードです。
- **[Speed Insights](https://vercel.com/docs/speed-insights?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs):** 訪問者データに基づくリアルのパフォーマンス・インサイトにより、貴社のウェブサイトが現場でどのように機能しているかを実践的に把握できます。
- **[Logging](https://vercel.com/docs/observability/runtime-logs?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs):** ランタイムログとアクティビティログは、問題のデバッグや運用中のアプリケーションの監視に役立ちます。また、サードパーティのツールやサービスのリストについては、[integrations page](https://vercel.com/integrations?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs) を参照してください。

> **Good to know:**
>
> ウェブサイトのパフォーマンスを向上させるための詳細な戦略など、Vercel の本番環境におけるベストプラクティスを包括的に理解するには、[Vercel 本番環境チェックリスト](https://vercel.com/docs/production-checklist?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)を参照してください。

これらの推奨事項に従うことで、ユーザーにとってより高速で信頼性が高く、安全なアプリケーションを構築することができます。
