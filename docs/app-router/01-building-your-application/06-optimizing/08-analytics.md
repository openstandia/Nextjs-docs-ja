---
title: アナリティクス
description: Measure and track page performance using Next.js Speed Insights
---

Next.js には、パフォーマンスメトリクスの測定とレポート機能が組み込まれています。`useReportWebVitals` フックを使って自分でレポートを管理することもできますし、Vercel が提供する[マネージドサービス](https://vercel.com/analytics?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)で自動的にメトリクスを収集して可視化することもできます。

## Build Your Own

```js title="app/_components/web-vitals.js"
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
```

```js title="app/layout.js"
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

> `useReportWebVitals` フックは `"use client"`ディレクティブを必要とするため、最もパフォーマンスの高いアプローチは、ルートレイアウトがインポートする別のコンポーネントを作成することです。これにより、クライアントの境界は `WebVitals` コンポーネントのみに限定されます。

詳しくは [API リファレンス](/docs/app-router/api-reference/functions/use-report-web-vitals)をご覧ください。

## Web vitals

Web Vitals は、ウェブページのユーザー・エクスペリエンスを把握することを目的とした、便利なメトリクスのセットです。以下のがすべて含まれています：

- [Time to First Byte](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte)（TTFB: 最初の 1 バイトを受信するまでの時間）
- [First Contentful Paint](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)（FCP：視覚コンテンツの初期表示時間）
- [Largest Contentful Paint](https://web.dev/lcp/)（LCP：最大コンテンツの描画）
- [First Input Delay](https://web.dev/fid/)（FID：初回入力までの遅延時間）
- [Cumulative Layout Shift](https://web.dev/cls/)（CLS：累積レイアウトシフト数）
- [Interaction to Next Paint](https://web.dev/inp/)（INP：ページの読み込みを開始してからユーザーがページを離れるまでの間に発生する、ユーザー入力への応答性）（実験的機能）

`name` プロパティを使って、これらのメトリクスの結果をすべて扱うことができます。

```tsx title="app/components/web-vitals.tsx"
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

## 結果を外部システムに送信する

任意のエンドポイントに結果を送信して、サイト上の実際のユーザーパフォーマンスを測定および追跡できます。例えば

```js
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
```

> **Good to know**: Google Analytics を使用している場合、id 値を使用することで、メトリックの分布を手動で構築することができます（パーセンタイルなどを計算するため）。

> ```js
> useReportWebVitals(metric => {
>   // Use `window.gtag` if you initialized Google Analytics as this example:
>   // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
>   window.gtag('event', metric.name, {
>     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
>     event_label: metric.id, // id unique to current page load
>     non_interaction: true, // avoids affecting bounce rate.
>   });
> }
> ```
>
> Google Analytics への結果送信については、[こちら](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics)をご覧ください。
