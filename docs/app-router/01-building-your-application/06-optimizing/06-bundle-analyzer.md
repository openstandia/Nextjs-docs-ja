---
title: バンドルアナライザ
description: '@next/bundle-analyzer プラグインを使用して JavaScript バンドルのサイズを分析します'
related:
  description: アプリケーションを本番環境に最適化する方法について学習します
  links:
    - app-router/building-your-application/deploying/production-checklist
---

[`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer) は、JavaScript モジュールのサイズを管理するための Next.js のプラグインです。各モジュールとその依存関係のサイズについて視覚的に報告できます。この情報を使用して、大きな依存関係の削除、コード分割、必要な部分だけをロードすることで、クライアントに転送するデータ量を削減できます。

## インストール

以下のコマンドを実行してプラグインをインストールします：

```bash
npm i @next/bundle-analyzer
# または
yarn add @next/bundle-analyzer
# または
pnpm add @next/bundle-analyzer
```

その後、バンドルアナライザの設定を `next.config.js` に追加します。

```js title="next.config.js"
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withBundleAnalyzer(nextConfig)
```

## バンドルの分析

以下のコマンドを実行してバンドルを分析します：

```bash
ANALYZE=true npm run build
# または
ANALYZE=true yarn build
# または
ANALYZE=true pnpm build
```

レポートはブラウザの新しいタブを3つ開いて検査できます。この作業を定期的に実行し、サイトをデプロイする前に行うことで、大きなバンドルを早期に特定し、よりパフォーマンスの高いアプリケーションを構築できます。

## 次のステップ

アプリケーションを本番環境に最適化するための詳細をご覧ください。

[Production Checklist](/docs/app-router/building-your-application/deploying/production-checklist)
