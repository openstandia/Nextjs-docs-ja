---
title: useReportWebVitals
description: API Reference for the useReportWebVitals function.
---

`useReportWebVitals`フックを使用すると、[Core Web Vitals](https://web.dev/vitals/)をレポートでき、アナリティクスサービスと組み合わせることも可能です。

```jsx title="app/_components/web-vitals.js"
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
```

```jsx title="app/layout.js"
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

> `useReportWebVitals`フックは `"use client"`ディレクティブを必要とするため、もっともパフォーマンスの高いアプローチは、ルートレイアウトにインポートする別のコンポーネントを作成することです。これにより、クライアントの境界は`WebVitals`コンポーネントのみに限定されます。

## useReportWebVitals

フックの引数として渡される`metric`オブジェクトは、いくつかのプロパティで構成されています。

- `id`: 現在のページ読み込みのコンテキストにおけるメトリックの一意な識別子。
- `name`: パフォーマンスメトリクスの名前です。指定可能な値には、Web アプリケーション固有の [Web Vitals](#web-vitals) メトリクスの名前 (TTFB、FCP、LCP、FID、CLS) が含まれます。
- `delta`: メトリックの現在値と前回の値との差です。通常、値はミリ秒単位であり、時間経過によるメトリック値の変化を表します。
- `entries`: メトリックに関連付けられた[Performance Entries](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)の配列です。これらのエントリは、メトリックに関連するパフォーマンスイベントの詳細な情報を提供します。
- `navigationType`: メトリック収集のトリガーとなった[ナビゲーションのタイプ](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type)を示します。指定可能な値は、`"navigate"`、`"reload"`、`"back_forward"`、および `"prerender"`です。
- `rating`: メトリックの値に基づくパフォーマンスの評価ランクです。指定可能な値は、`"good"`、`"needs-improvement"`、および`"poor"`です。この評価は、通常、許容可能、もしくは最適ではないパフォーマンスを示す規定の閾値とメトリック値を比較することで決定されます。
- `value`: パフォーマンスエントリの実際の値または継続時間（通常はミリ秒単位）を示します。この値は、メトリックによって追跡されるパフォーマンス面の定量的な指標を提供します。値のソースは、測定される特定のメトリックに依存し、さまざまな[Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API) から取得できます。

## Web Vitals

[Web Vitals](https://web.dev/vitals/) は、ウェブページのユーザー・エクスペリエンスを把握することを目的とした、便利なメトリクスのセットです。以下の Web Vitals がすべて含まれています。

- [Time to First Byte](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte) (TTFB)
- [First Contentful Paint](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint) (FCP)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [First Input Delay](https://web.dev/fid/) (FID)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
- [Interaction to Next Paint](https://web.dev/inp/) (INP)

`name`プロパティを使って、これらのメトリクスの結果をすべて扱うことができます。

```tsx title="app/components/web-vitals.tsx"
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // FCPの結果を扱う
      }
      case 'LCP': {
        // LCPの結果を扱う
      }
      // ...
    }
  })
}
```

## Usage on Vercel

[Vercel Speed Insights](https://vercel.com/docs/concepts/speed-insights)は Vercel のデプロイ時に自動的に設定され、`useReportWebVitals`を使用する必要はありません。このフックはローカル開発、または異なる分析サービスを使用している場合に便利です。

## Sending results to external systems

任意のエンドポイントに結果を送信して、サイト上の実際のユーザーパフォーマンスを測定および追跡できます。  
例えば：

```js
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // `navigator.sendBeacon()`が利用可能な場合はそれを使用し、利用できない場合は`fetch()`にフォールバックします。
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
```

> **Good to know**: [Google Analytics](https://analytics.google.com/analytics/web/)を使用している場合、`id`を使用することで、手動でメトリックの分布を構築することができます（パーセンタイルなどを計算するため）。

> ```js
> useReportWebVitals(metric => {
>   // この例のようにGoogle Analyticsを初期化した場合は、`window.gtag`を使用します。
>   // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
>   window.gtag('event', metric.name, {
>     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // 値は整数でなければなりません。
>     event_label: metric.id, // 現在読み込んでいるページの固有のID。
>     non_interaction: true, // バウンス率（Bounce Rate）に影響を与えないようにする。
>   });
> }
> ```
>
> [Google Analytics への結果の送信](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics)については、こちらをご覧ください。
