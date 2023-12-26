---
title: Instrumentation
description: Learn how to use instrumentation to run code at server startup in your Next.js app
---

<!-- textlint-disable -->

プロジェクトのルートディレクトリ（または`src`フォルダを使用している場合は`src`内）にある`instrumentation.ts`（または`.js`）ファイルから`register`という関数をエクスポートすると、新しい Next.js サーバーインスタンスが起動されるたびにその関数が呼び出されます。

<!-- textlint-enable -->

> **Good to know**:
>
> - この機能は**実験的**なものです。この機能を使用するには、`next.config.js`で`experimental.instrumentationHook = true;`と定義して、明示的にオプトインする必要があります
> - `instrumentation`ファイルは、`app`や`pages`ディレクトリではなく、プロジェクトのルートに置く必要があります。`src`フォルダを使用している場合は、`src`の中に`pages`と`app`と一緒にファイルを置きます

<!-- TODO: Fix link -->

> - [`pageExtensions`設定オプション](/docs/app-router/api-reference/next-config-js/pageExtensions)を使用して接尾子を追加する場合は、`instrumentation`のファイル名もそれに合わせて更新する必要があります
> - 基本的な使用例として[with-opentelemetry](https://github.com/vercel/next.js/tree/canary/examples/with-opentelemetry)が用意されています

`register`関数がデプロイされると、コールドスタートするたびに呼び出されます（ただし、各環境で一度だけ）。

場合によっては、副作用のためにコード内でファイルをインポートすることが有用な場合もあります。例えば、グローバル変数のセットを定義したファイルをインポートし、インポートしたファイルをコード内で明示的に使用することがないような場合です。パッケージが宣言したグローバル変数にアクセスはできます。

`instrumentation.ts`では、`register`関数内で使用するために副作用のあるファイルをインポートできます：

```ts title="your-project/instrumentation.ts"
import { init } from 'package-init'

export function register() {
  init()
}
```

しかし、副作用のあるファイルのインポートには、`register`関数の中から`import`を使うことをお勧めします。次の例は`register`関数内での`import`の基本的な使い方を示しています：

```ts title="your-project/instrumentation.ts"
export async function register() {
  await import('package-with-side-effect')
}
```

こうすることで、すべての副作用をコード内の一箇所に集めることができ、ファイルのインポートによる意図しない結果を避けることができます。

すべての環境で`register`が呼び出されるので、`edge`と`nodejs`の両方をサポートしていないコードは条件付きでインポートする必要があります。環境変数`NEXT_RUNTIME`を使って現在の環境を取得できます。環境固有のコードをインポートする場合は次のようになります：

```ts title="your-project/instrumentation.ts"
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge')
  }
}
```
