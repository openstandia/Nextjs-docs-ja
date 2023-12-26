---
title: onDemandEntries
description: Configure how Next.js will dispose and keep in memory pages created in development.
---

Next.js は、開発中にビルドされたページをサーバーがメモリ上にどのように破棄するか、または保持するかを制御するオプションをいくつか公開しています。

デフォルトを変更するには、`next.config.js`を開き、`onDemandEntries`設定を追加します：

```js title="next.config.js"
module.exports = {
  onDemandEntries: {
    // サーバーがページをバッファに保持する期間(ms)
    maxInactiveAge: 25 * 1000,
    // 破棄せずに同時に保管すべきページ数
    pagesBufferLength: 2,
  },
}
```
