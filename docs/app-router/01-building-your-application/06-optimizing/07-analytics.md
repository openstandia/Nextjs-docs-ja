---
title: アナリティクス
description: Measure and track page performance using Next.js Speed Insights
---

[Next.js Speed Insights](https://nextjs.org/analytics)では、さまざまなメトリクスを使ってページのパフォーマンスを分析・測定できます。

[Vercel でのデプロイメント](https://vercel.com/docs/concepts/speed-insights?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)では、設定なしで[Real Experience Score](https://vercel.com/docs/concepts/speed-insights#core-web-vitals-explained)の収集を開始できます。

このドキュメントの残りの部分では、Next.js Speed Insights が使用するビルトインのリレイヤーについて説明します。

---

## Web vitals

Web Vitals は、ウェブページのユーザー・エクスペリエンスを把握することを目的とした、便利なメトリクスのセットです。以下のがすべて含まれています：

- [Time to First Byte](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte)（TTFB: 最初の 1 バイトを受信するまでの時間）
- [First Contentful Paint](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)（FCP：視覚コンテンツの初期表示時間）
- [Largest Contentful Paint](https://web.dev/lcp/)（LCP：最大コンテンツの描画）
- [First Input Delay](https://web.dev/fid/)（FID：初回入力までの遅延時間）
- [Cumulative Layout Shift](https://web.dev/cls/)（CLS：累積レイアウトシフト数）
- [Interaction to Next Paint](https://web.dev/inp/)（INP：ページの読み込みを開始してからユーザーがページを離れるまでの間に発生する、ユーザー入力への応答性）（実験的機能）
