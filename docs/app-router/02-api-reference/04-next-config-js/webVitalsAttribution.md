---
title: webVitalsAttribution
description: Web Vitals の問題の原因を特定するために、webVitalsAttribution オプションの使用方法を学びます。
sidebar_position: 38
---

ウェブ・バイタルに関連する問題をデバッグする際、問題の原因を突き止めることができると便利です。例えば、累積レイアウトシフト（CLS）の場合、最大のレイアウトシフトが発生したときに、最初にシフトした要素を知りたいことがあります。あるいは、Largest Contentful Paint（LCP）の場合、そのページの LCP に関係する要素を特定したいかもしれません。LCP 要素が画像の場合、画像リソースの URL を知ることで、最適化が必要なアセットを見つけることができます。

<!-- textlint-disable -->

[アトリビューション](https://github.com/GoogleChrome/web-vitals/blob/4ca38ae64b8d1e899028c692f94d4c56acfc996c/README.md#attribution)と呼ばれる Web Vitals スコアの最大の原因を特定することで、[PerformanceEventTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)、[PerformanceNavigationTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming)、[PerformanceResourceTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming)の項目など、より詳細な情報を得ることができます。

<!-- textlint-enable -->

Next.js のデフォルトではアトリビューションは無効になっていますが、`next.config.js`で以下のように指定することで、メトリックごとに有効にできます。

```js title="next.config.js"
experimental: {
  webVitalsAttribution: ['CLS', 'LCP']
}
```

有効なアトリビューションの値は、[NextWebVitalsMetric](https://github.com/vercel/next.js/blob/442378d21dd56d6e769863eb8c2cb521a463a2e0/packages/next/shared/lib/utils.ts#L43)タイプで指定されているすべての`web-vitals`のメトリクスです。
