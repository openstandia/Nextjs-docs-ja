---
title: <Script>
description: Optimize third-party scripts in your Next.js application using the built-in `next/script` Component.
---

この API リファレンスは、Script コンポーネントで使用できる[props](#props)の使い方を理解するのに役立ちます。機能と使用方法については、[スクリプトの最適化ページ](/docs/app-router/building-your-application/optimizing/scripts)を参照してください。

```tsx title="app/dashboard/page.tsx"
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

## Props

Script コンポーネントで使用可能な props の概要は以下のとおりです：

| Prop                    | 例                                | 型       | 必須                                     |
| :---------------------- | :-------------------------------- | :------- | :--------------------------------------- |
| [`src`](#src)           | `src="http://example.com/script"` | String   | インラインのスクリプトではない場合は必須 |
| [`strategy`](#strategy) | `strategy="lazyOnload"`           | String   | -                                        |
| [`onLoad`](#onload)     | `onLoad={onLoadFunc}`             | Function | -                                        |
| [`onReady`](#onready)   | `onReady={onReadyFunc}`           | Function | -                                        |
| [`onError`](#onerror)   | `onError={onErrorFunc}`           | Function | -                                        |

## 必須の Props

`<Script />`コンポーネントには以下のプロパティが必要です。

### `src`

外部スクリプトの URL を指定するパス文字列。これは、絶対外部 URL または内部パスのいずれかになります。インライン・スクリプトを使用しない限り、`src`プロパティは必須です。

## 任意の Props

`<Script />`コンポーネントは、必要なプロパティ以外にも多くの追加プロパティを受け付けます。

### `strategy`

スクリプトのロード・ストラテジー。使用できるストラテジーは 4 種類あります：

- `beforeInteractive`：Next.js のコードの前、およびページのハイドレーションが発生する前にロードします
- `afterInteractive`：（デフォルト）早い段階で読み込みますが、ページのハイドレーションが発生した後に読み込みます
- `lazyOnload`：ブラウザのアイドル時間中にロードします
- `worker`：（実験的）Web Worker で読み込みます

### `beforeInteractive`

<!-- textlint-disable -->

`beforeInteractive`ストラテジーでロードされるスクリプトは、サーバーから最初の HTML に注入され、どの Next.js モジュールよりも先にダウンロードされ、ページ上でハイドレーションが発生する前に配置された順序で実行されます。

<!-- textlint-enable -->

このストラテジーで指定されたスクリプトは、ファーストパーティのコードよりも前にプリロードされ、フェッチされますが、その実行によってページのハイドレーションがブロックされることはありません。

<!-- textlint-disable -->

`beforeInteractive`スクリプトは、ルートレイアウト（`app/layout.tsx`）内に配置する必要があり、サイト全体で必要とされるスクリプトをロードするように設計されています（つまり、アプリケーション内の任意のページがサーバー側にロードされたときスクリプトがロードされます）。

<!-- textlint-enable -->

<!-- textlint-disable -->

**このストラテジーは、ページの一部がインタラクティブになる前にフェッチされる必要がある重要なスクリプトにのみ使用されるべきです。**

<!-- textlint-enable -->

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
      <Script
        src="https://example.com/script.js"
        strategy="beforeInteractive"
      />
    </html>
  )
}
```

> **Good to know**：`beforeInteractive`を持つスクリプトは、コンポーネント内のどこに配置されているかにかかわらず、常に HTML ドキュメントの head 内に注入されます。

`beforeInteractive`でできるだけ早くロードされるべきスクリプトの例には、以下のようなものがあります：

- ボット検知器
- クッキーの同意管理

### `afterInteractive`

`afterInteractive`ストラテジーを使用するスクリプトは、HTML クライアントサイドに注入され、ページ上で一部（またはすべて）のハイドレーションが発生した後にロードされます。これは Script コンポーネントのデフォルトのストラテジーで、できるだけ早くロードする必要があるスクリプトに使用します。

`afterInteractive`スクリプトは任意のページまたはレイアウトの内部に配置でき、そのページ（またはページ群）がブラウザで開かれたときにのみロードされ実行されます。

```jsx title="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

`afterInteractive`に適したスクリプトの例としては、以下のようなものがあります：

- タグマネージャー
- アナリティクス

### `lazyOnload`

`lazyOnload`ストラテジーを使用するスクリプトは、ブラウザのアイドル時間中に HTML クライアントサイドへ注入され、ページ上のすべてのリソースがフェッチされた後にロードされます。このストラテジーは、早期にロードする必要のないバックグラウンドスクリプトや優先度の低いスクリプトに使用されるべきです。

`lazyOnload`スクリプトは、任意のページやレイアウトの内部に配置でき、そのページ（またはページのグループ）がブラウザで開かれたときにのみロードされ、実行されます。

```js title="app/page.js"
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

すぐにロードする必要がなく、`lazyOnload`でフェッチできるスクリプトの例には、次のようなものがあります：

- チャットサポートプラグイン
- ソーシャルメディアウィジェット

### `worker`

> **注意**：`worker`ストラテジーはまだ安定しておらず、`app`ディレクトリではまだ動作しません。注意して使用してください。

`worker`ストラテジーを使用するスクリプトは、メインスレッドを解放し、重要なファーストパーティのリソースのみが処理されるようにするため、Web Worker に移動されます。このストラテジーはどんなスクリプトにも使えますが、すべてのサードパーティ製スクリプトのサポートが保証されているわけではない、高度なユースケースです。

`worker`をストラテジーとして使用するには、`next.config.js`で`nextScriptWorkers`フラグを有効にする必要があります：

```js title="next.config.js"
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

`worker`スクリプトは**現在`pages/`ディレクトリでのみ使用できます**：

```tsx title="page/home.tsx"
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

### `onLoad`

> **注意**：`onLoad`はまだ Server Components では動作せず、Client Components でのみ使用できます。さらに、`onLoad`は`beforeInteractive`と一緒に使うことはできません。代わりに`onReady`を使うことを検討してください。

<!-- textlint-disable -->

サードパーティのスクリプトの中には、コンテンツのインスタンス化や関数の呼び出すために、スクリプトの読み込みが完了した後に JavaScript コードを一度実行する必要があるものがあります。ストラテジーとして`afterInteractive`または `lazyOnload`を使用してスクリプトをロードしている場合は、`onLoad`プロパティを使用してロード後にコードを実行できます。

<!-- textlint-enable -->

以下はライブラリがロードされた後にのみ lodash のメソッドを実行する例です：

```tsx title="app/page.tsx"
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
        }}
      />
    </>
  )
}
```

### `onReady`

> **注意**：`onReady`はまだ Server Components では動作せず、Client Components でのみ使用できます。

<!-- textlint-disable -->

サードパーティのスクリプトの中には、スクリプトのロードを完了した後、およびコンポーネントがマウントされるたびに（たとえばルートナビゲーションの後に）、JavaScript コードを実行する必要がある場合があります。onReady プロパティを使用すると、スクリプトが最初にロードされたときの load イベントの後にコードを実行し、その後コンポーネントが再マウントされるたびにコードを実行できます。

<!-- textlint-enable -->

以下は、コンポーネントがマウントされるたびに、Google Maps JS embed を再インスタンス化する方法の例です：

```tsx title="app/page.tsx"
'use client'

import { useRef } from 'react'
import Script from 'next/script'

export default function Page() {
  const mapRef = useRef()

  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

### `onError`

> **注意**：`onError`はまだ Server Components では動作せず、Client Components でのみ使用できます。`onError`は`beforeInteractive`ストラテジーでは使用できません。

スクリプトのロードに失敗したとき、キャッチできると便利なことがあります。このようなエラーは onError プロパティで処理できます：

```tsx title="app/page.tsx"
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

## バージョン履歴

| Version   | Changes                                                                                 |
| :-------- | :-------------------------------------------------------------------------------------- |
| `v13.0.0` | `beforeInteractive`と`afterInteractive`が`app`をサポートするために更新されました。      |
| `v12.2.4` | `onReady` prop が追加されました。                                                       |
| `v12.2.2` | `beforeInteractive`属性をつけた`next/script`が`_document`に記述できるようになりました。 |
| `v11.0.0` | `next/script`が導入されました。                                                         |
