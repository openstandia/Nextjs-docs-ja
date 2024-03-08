---
title: Turbopack
description: Turbopack は JavaScript と TypeScript のために最適化されたインクリメンタルバンドラであり、Rust で書かれ、Next.js に組み込まれています。
---

[Turbopack](https://turbo.build/pack) (ベータ版)は、JavaScript と TypeScript のために最適化されたインクリメンタルバンドラであり、Rust で書かれ、Next.js に組み込まれています。

## 使用方法

Turbopack は、ローカル開発を高速化するために Next.js の `pages` ディレクトリと `app` ディレクトリの両方で使用することができます。 Turbopack を有効にするには、Next.js の開発サーバーを実行する際に `--turbo` フラグを使用します。

```json title="package.json" highlight={3}
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## サポートされている機能

Turbopack の現在サポートされている機能については、[ドキュメンテーション](https://turbo.build/pack/docs/features)を参照してください。

## サポートされていない機能

Turbopack は現在 `next dev` のみをサポートしており、`next build` をサポートしていません。安定版に向けてビルドのサポートを進めています。
