---
title: 最適化
sidebar_label: 最適化
description: Optimize your Next.js application for best performance and user experience.
---

Next.js には、アプリケーションの速度と[Core Web Vitals](https://web.dev/vitals/)を向上させるために設計されたさまざまな最適化が組み込まれています。このガイドでは、ユーザーエクスペリエンスを向上させるために活用できる最適化について説明します。

## 組み込み Components

組み込みコンポーネントは、一般的な UI 最適化の実装の複雑さを抽象化します。

- **Images**: ネイティブの`<img>`要素をベースに構築されています。Image Component は、遅延ロードやデバイスのサイズに応じた画像の自動リサイズにより、画像のパフォーマンスを最適化します
- **Link**: ネイティブの`<a>`タグをベースに構築されています。Link Component は、より速くスムーズなページ遷移のために、バックグラウンドでページをプリフェッチします
- **Scripts**: ネイティブの`<script>`タグをベースにしています。Script Component は、サードパーティのスクリプトの読み込みと実行を制御します

## メタデータ

<!-- textlint-disable -->

メタデータは、検索エンジンがあなたのコンテンツをよりよく理解するのに役立ち（SEO の向上につながる）、ソーシャルメディア上でのコンテンツの表示方法をカスタマイズできるようになり、さまざまなプラットフォームでより魅力的で一貫性のあるユーザー体験を生み出すのに役立ちます。

<!-- textlint-enable -->

Next.js の Metadata API では、ページの`<head>`要素を変更できます。メタデータは 2 つの方法で設定できます：

- **設定ベースのメタデータ**: 静的なメタデータ・オブジェクトまたは動的な`generateMetadata`関数を`layout.js`または`page.js`ファイルにエクスポートします
- **ファイルベースのメタデータ**: ルート Segment に静的または動的に生成された特殊ファイルを追加します

さらに、[`imageResponse`](/docs/app-router/api-reference/functions/image-response)コンストラクタを使用して、JSX と CSS をから動的な Open Graph 画像を作成できます。

## 静的アセット

Next.js の`/public`フォルダは、画像やフォントなどの静的アセットを配信するために使用できます。`/public`フォルダ内のファイルは、CDN プロバイダーによってキャッシュされ、効率的に配信されます。

## 分析とモニタリング

大規模なアプリケーションの場合、Next.js は一般的な分析ツールやモニタリングツールと統合して、アプリケーションのパフォーマンスを把握するのに役立ちます。詳しくは[OpenTelemetry](https://nextjs.org/docs/pages/building-your-application/optimizing/open-telemetry)と[Instrumentation](https://nextjs.org/docs/pages/building-your-application/optimizing/instrumentation)ガイドをご覧ください。
