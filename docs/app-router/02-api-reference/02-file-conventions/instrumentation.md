---
title: instrumentation.js
description: instrumentation.jsファイルのAPIリファレンス。
related:
  title: Instrumentation の詳細を学ぶ
  links:
    - app-router/building-your-application/optimizing/instrumentation
sidebar_position: 3
---

`instrumentation.js|ts` ファイルは、モニタリングとロギングのツールをアプリケーションに統合するために使われます。
これにより、アプリケーションのパフォーマンスとふるまいを追跡し、運用環境での問題をデバッグできます。

使用するには、このファイルをアプリケーションの **ルート** に置くか、[`src` フォルダ](/docs/app-router/building-your-application/configuring/src-directory)を使用している場合はその中に置きます。

## 設定オプション

Instrumentation は現在実験的な機能です。
`instrumentation` ファイルを使用するには、`next.config.js` で [`experimental.instrumentationHook = true;`](/docs/app-router/api-reference/next-config-js/instrumentationHook)を定義して、明示的にオプトインする必要があります:

```js title="next.config.js"
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## エクスポート

### `register` (必須)

このファイルは、新しい Next.js サーバーインスタンスが開始されたときに **一度だけ** 呼び出される `register` 関数をエクスポートします。
`register` 関数は非同期関数にすることができます。

```ts title="instrumentation.ts"
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

## バージョン履歴

| Version   | Changes                                              |
| --------- | ---------------------------------------------------- |
| `v14.0.4` | Turbopack が `instrumentation` をサポートしました。  |
| `v13.2.0` | `instrumentation` が実験的機能として導入されました。 |

## Instrumentation の詳細を学ぶ

[Instrumentation](/docs/app-router/building-your-application/optimizing/instrumentation)
