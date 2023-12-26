---
title: poweredByHeader
description: Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.
---

デフォルトでは、Next.js は`x-powered-by`ヘッダーを追加します。これを無効にするには、`next.config.js`を開き、`poweredByHeader`設定を無効にします：

```js title="next.config.js"
module.exports = {
  poweredByHeader: false,
}
```
