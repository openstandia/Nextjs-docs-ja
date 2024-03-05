---
title: onDemandEntries
description: Next.js が開発中に作成されるページを解放したりメモリに保持する方法を設定します。
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
