---
title: Script 最適化
sidebar_label: Scripts
description: 組み込みのスクリプトコンポーネントを使用して、サードパーティのスクリプトを最適化します。
related:
  title: API リファレンス
  description: next/script APIについてさらに詳しく学びましょう。
  links:
    - app-router/api-reference/components/script
---

### レイアウト・スクリプト

複数のルートにサードパーティのスクリプトを読み込むには、`next/script`をインポートして、レイアウト・コンポーネントに直接スクリプトを含めます：

```tsx title="app/dashboard/layout.tsx"
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

<!-- textlint-disable -->

サードパーティのスクリプトは、フォルダルート（例：`dashboard/page.js`）またはネストされたルート（例：`dashboard/settings/page.js`）にユーザーがアクセスしたときにフェッチされます。Next.js は、ユーザーが同じレイアウト内の複数のルート間を移動しても、スクリプトが**1 回しかロードされない**ようにします。

<!-- textlint-enable -->

### アプリケーション・スクリプト

すべてのルートにサードパーティのスクリプトをロードするには、`next/script`をインポートし、ルートレイアウトに直接スクリプトを含めます：

```tsx title="app/layout.tsx"
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

このスクリプトは、アプリケーション内の任意のルートへアクセスしたときにロードされ、実行されます。Next.js は、ユーザーが複数のページ間を移動しても、スクリプトが**1 回しかロードされない**ようにします。

> **推奨**： パフォーマンスへの不要な影響を最小限に抑えるため、特定のページやレイアウトにのみサードパーティのスクリプトを含めることをお勧めします。

### ストラテジー

`next/script`のデフォルトの動作では、どのページやレイアウトでもサードパーティのスクリプトを読み込むことができますが、`strategy`属性を使用することで、その読み込み動作を微調整できます：

- `beforeInteractive`：スクリプトを、Next.js コードの前、およびページのハイドレーションが発生する前にロードする
- `afterInteractive`: (**デフォルト**) スクリプトを早期に読み込みますが、ページのハイドレーションが発生した後に読み込む
- `lazyOnload`：ブラウザのアイドル時間中にスクリプトをロードする
- `worker`：（実験的機能）スクリプトを Web Worker で読み込む

各ストラテジーの詳細や使用例については、[`next/script`](/docs/app-router/api-reference/components/script#strategy) API リファレンス ドキュメントを参照してください。

### スクリプトを Web Worker にオフロードする（実験的な機能）

> **注意**： `worker`ストラテジーはまだ安定しておらず、`app` ディレクトリではまだ動作しません。注意して使用してください。

`worker`ストラテジーを使用するスクリプトはオフロードされ、[Partytown](https://partytown.builder.io/)を利用して Web Worker で実行されます。メインスレッドをアプリケーションコードに割り当てることで、サイトのパフォーマンスを向上させることができます。

このストラテジーはまだ実験的なもので、`next.config.js`で`nextScriptWorkers`フラグが有効になっている場合のみ使用できます：

```js title="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

次に`next`を実行すると（通常は`npm run dev`か`yarn dev`）、セットアップを完了するために Next.js が必要なパッケージのインストールを案内します：

```bash title="Terminal"
npm run dev
```

次のような指示が表示されます：Please install Partytown by running `npm install @builder.io/partytown`

セットアップが完了したら、`strategy="worker"`を定義することで、自動的に Partytown がアプリケーションにインスタンス化され、スクリプトが Web ワーカーにオフロードされます。

```tsx title="pages/home/tsx"
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

Web Worker でサードパーティのスクリプトをロードする場合、考慮すべきトレードオフがいくつかあります。詳細については、Partytown の[トレードオフ](https://partytown.builder.io/trade-offs)に関するドキュメントを参照してください。

### インライン・スクリプト

インラインスクリプト、つまり外部ファイルから読み込まれないスクリプトも Script コンポーネントでサポートされています。中括弧の中に JavaScript を記述します：

```jsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

あるいは、`dangerouslySetInnerHTML`属性を使用します：

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **注意**: Next.js がスクリプトを追跡して最適化するためには、インラインスクリプトに`id`属性を割り当てる必要があります。

### 追加コードの実行

イベントハンドラを Script コンポーネントで使用すると、特定のイベントが発生した後に追加のコードを実行できます：

- `onLoad`：スクリプトの読み込みが完了した後にコードを実行する
- `onReady`：スクリプトの読み込みが完了した後、コンポーネントがマウントされるたびにコードを実行する
- `onError`：スクリプトのロードに失敗した場合、コードを実行する

これらのハンドラは、`next/script`がインポートされ、`"use client"`がコードの最初の行に定義されている [Client Component](/docs/app-router/building-your-application/rendering/client-components) で使用される場合にのみ機能します：

```tsx title="app/page.tsx"
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

各イベントハンドラの詳細と表示例については、[`next/script`](/docs/app-router/api-reference/components/script#onload)API リファレンスを参照してください。

### 追加属性

`<script>`要素に割り当てることのできる DOM 属性には、[`nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)や[カスタム・データ属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)のように、Script コンポーネントでは使用されないものがたくさんあります。追加属性を含めると、HTML に含まれる最終的な最適化された`<script>`要素へ自動的に適用されます。

```tsx title="app/page.tsx"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

## API リファレンス

next/script API についてもっと知りたい場合は以下を参照してください。

/docs/app-router/api-reference/components/script
