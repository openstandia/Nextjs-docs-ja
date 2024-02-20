---
title: サードパーティ ライブラリ
説明: next/third-parties パッケージを使って、アプリケーション内のサードパーティライブラリのパフォーマンスを最適化しよう。
---

**`@next/third-parties`** は、Next.js アプリケーションで一般的なサードパーティライブラリを読み込む際のパフォーマンスと
開発者体験を向上させるコンポーネントとユーティリティのコレクションを提供するライブラリです。

`@next/third-parties` が提供するすべてのサードパーティの統合は、パフォーマンスと使いやすさを考慮して最適化されています。

## 初めに

まず、`@next/third-parties` ライブラリをインストールします:

```bash title="Terminal"
npm install @next/third-parties@latest next@latest
```

`@next/third-parties` は現在開発中の **実験的** ライブラリです。サードパーティとの統合の追加に取り組んでいる間は、
**最新** または **カナリア** フラグでインストールすることをお勧めします。

## Google サードパーティ

Google がサポートするすべてのサードパーティライブラリは、`@next/third-parties/google` からインポートできます。

### Google Tag Manager

`GoogleTagManager` コンポーネントを使うと、 [Google Tag Manager](https://developers.google.com/tag-platform/tag-manager) コンテナをページにインスタンス化することができます。
デフォルトでは、ページ上でハイドレーションが発生した後に元のインラインスクリプトを取得します。

すべてのルートに対して Google Tag Manager をロードするには、コンポーネントをルートレイアウトに直接インクルードし、GTM コンテナ ID を渡します:

```tsx title="app/layout.tsx"
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleTagManager gtmId="GTM-XYZ" />
    </html>
  )
}
```

単一のルートに対して Google Tag Manager をロードするには、ページファイルにコンポーネントをインクルードします:

```jsx title="app/page.js"
import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return <GoogleTagManager gtmId="GTM-XYZ" />
}
```

#### イベントの送信

`sendGTMEvent` 関数を使うと、`dataLayer` オブジェクトを使ってイベントを送信し、ページ上のユーザ・インタラクションを追跡することができます。
この関数を使うには、`<GoogleTagManager />` コンポーネントが親レイアウト、ページ、コンポーネントに含まれているか、同じファイルに直接含まれている必要があります。

```jsx title="app/page.js"
'use client'

import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        Send Event
      </button>
    </div>
  )
}
```

関数に渡すことができるさまざまな変数やイベントについては、Tag Manager の[開発者向けドキュメント](https://developers.google.com/tag-platform/tag-manager/datalayer)を参照してください。

#### オプション

Google Tag Manager に渡すオプションです。オプションの詳細については、[Google Tag Manager のドキュメント](https://developers.google.com/tag-platform/tag-manager/datalayer)を参照してください。

| 名前            | タイプ | 説明                                                                       |
| --------------- | ------ | -------------------------------------------------------------------------- |
| `gtmId`         | 必須   | GTMコンテナID。通常は `GTM-` で始まります。                                |
| `dataLayer`     | 任意   | コンテナのインスタンスを作成するデータ層の配列。デフォルトは空の配列です。 |
| `dataLayerName` | 任意   | データレイヤーの名前。デフォルトは `dataLayer` です。                      |
| `auth`          | 任意   | 環境スニペットの認証パラメータ (`gtm_auth`) の値です。                     |
| `preview`       | 任意   | 環境スニペットのプレビューパラメータ (`gtm_preview`) の値です。            |

### Google Analytics

`GoogleAnalytics` コンポーネントを使用すると、Googleタグ（`gtag.js`）を介して [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)をページに含めることができます。
デフォルトでは、ページ上でハイドレーションが発生した後、オリジナルのスクリプトを取得します。

> **推奨**: Google Tag Manager がすでにアプリケーションに含まれている場合は、
> Google Analytics を別のコンポーネントとして含めるのではなく、
> Google Tag Manager を使って直接 Google Analytics を設定することができます。
> Tag Manager と `gtag.js` の違いについては[ドキュメント](https://developers.google.com/analytics/devguides/collection/ga4/tag-options#what-is-gtm)を参照してください。

すべてのルートに対して Google Analytics をロードするには、コンポーネントをルートレイアウトに直接インクルードし、測定IDを渡します:

```tsx title="app/layout.tsx"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

単一のルートに対して Google Analytics をロードするには、ページファイルにコンポーネントを含めます:

```jsx title="app/page.js"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Page() {
  return <GoogleAnalytics gaId="G-XYZ" />
}
```

#### イベントの送信

`sendGAEvent` 関数を使うと、`dataLayer` オブジェクトを使ってイベントを送信し、ページ上のユーザーインタラクションを測定することができます。
この関数を使うには、`<GoogleAnalytics />` コンポーネントが親レイアウト、ページ、コンポーネントに含まれているか、同じファイルに直接含まれている必要があります。

```jsx title="app/page.js"
'use client'

import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGAEvent({ event: 'buttonClicked', value: 'xyz' })}
      >
        Send Event
      </button>
    </div>
  )
}
```

イベントパラメータの詳細については、Google Analytics の[開発者向けドキュメント](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters)を参照してください。

#### ページビューのトラッキング

Google Analytics は、ブラウザの履歴状態が変化すると自動的にページビューを追跡します。
つまり、クライアントサイドで Next.js のルートを移動すると、設定なしでページビューデータが送信されます。

クライアント側のナビゲーションが正しく測定されていることを確認するには、
管理パネルで[_「拡張計測」_](https://support.google.com/analytics/answer/9216061#enable_disable)プロパティが有効になっており、
*「ブラウザ履歴イベントに基づくページ変更」*チェックボックスが選択されていることを確認してください。

> **注**: ページビューイベントを手動で送信する場合は、データの重複を避けるため、デフォルトのページビュー測定を無効にしてください。
> 詳しくは Google Analytics の[開発者向けドキュメント](https://developers.google.com/analytics/devguides/collection/ga4/views?client_タイプ=gtag#manual_pageviews)を参照してください。

#### オプション

`<GoogleAnalytics>` コンポーネントに渡すオプションです。

| 名前            | タイプ | 説明                                                                                           |
| --------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `gaId`          | 必須   | [測定ID](https://support.google.com/analytics/answer/12270356)です。通常は `G-` で始まります。 |
| `dataLayerName` | 任意   | データレイヤーの名前。デフォルトは `dataLayer` です。                                          |

### Google Maps の埋め込み

`GoogleMapsEmbed` コンポーネントは、[Google Maps Embed](https://developers.google.com/maps/documentation/embed/embedding-map)
をページに追加するために使用できます。デフォルトでは、`loading` 属性を使用して、折りたたみの下に埋め込みを遅延ロードします。

```jsx title="app/page.js"
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

#### オプション

Google Maps Embed に渡すオプションです。
オプションの一覧は [Google Map Embed のドキュメント](https://developers.google.com/maps/documentation/embed/embedding-map) を参照ください。

| 名前              | タイプ | 説明                                                                                                     |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `apiKey`          | 必須   | API キーです。                                                                                           |
| `mode`            | 必須   | [マップ モード](https://developers.google.com/maps/documentation/embed/embedding-map#choosing_map_modes) |
| `height`          | 任意   | 埋め込み部分の高さ。デフォルトは `auto` です。                                                           |
| `width`           | 任意   | 埋め込み幅。デフォルトは `auto` です。                                                                   |
| `style`           | 任意   | iframe にスタイルを渡します。                                                                            |
| `allowfullscreen` | 任意   | 特定のマップ部分をフルスクリーンにするプロパティです。                                                   |
| `loading`         | 任意   | デフォルトはlazyです。埋め込みが折り畳みより上になることがわかっている場合は、変更を検討してください。   |
| `q`               | 任意   | マップマーカーの位置を定義します。_マップモードによっては必要です。_                                     |
| `center`          | 任意   | マップビューの中心を定義します。                                                                         |
| `zoom`            | 任意   | マップの初期ズームレベルを設定します。                                                                   |
| `maptype`         | 任意   | ロードするマップタイルのタイプを定義します。                                                             |
| `language`        | 任意   | UI要素とマップタイル上のラベル表示に使用する言語を定義します。                                           |
| `region`          | 任意   | 地理的・政治的感性に基づいて、表示する適切な境界線とラベルを定義します。                                 |

### YouTube の埋め込み

`YouTubeEmbed` コンポーネントは、YouTube の埋め込みをロードして表示するために使用できます。
このコンポーネントは、[`lite-youtube-embed`](https://github.com/paulirish/lite-youtube-embed) を使用することで、より高速に読み込まれます。

```jsx title="app/page.js"
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

#### オプション

| 名前        | タイプ | 説明                                                                                                                                                                                                                                |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `videoid`   | 必須   | YouTubeのビデオIDです。                                                                                                                                                                                                             |
| `width`     | 任意   | 動画コンテナの幅。デフォルトは `auto` です。                                                                                                                                                                                        |
| `height`    | 任意   | 動画コンテナの高さ。デフォルトは `auto` です。                                                                                                                                                                                      |
| `playlabel` | 任意   | アクセシビリティのため、再生ボタンに視覚的に見えないラベルを付けます。                                                                                                                                                              |
| `params`    | 任意   | [ここ](https://developers.google.com/youtube/player_parameters#Parameters)で定義された動画プレーヤーのパラメータです。<br /> パラメータは、クエリパラメータ文字列として渡されます。<br /> 例: `params="controls=0&start=10&end=30"` |
| `style`     | 任意   | 動画コンテナにスタイルを適用するために使用します。                                                                                                                                                                                  |
