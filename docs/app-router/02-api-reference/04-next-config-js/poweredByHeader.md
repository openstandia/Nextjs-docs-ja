---
title: poweredByHeader
description: Next.jsでは、デフォルトで x-powered-by ヘッダーが追加されます。オプトアウトする方法については、こちらをご覧ください。
sidebar_position: 24
---

デフォルトでは、Next.js は`x-powered-by`ヘッダーを追加します。これを無効にするには、`next.config.js`を開き、`poweredByHeader`設定を無効にします：

```js title="next.config.js"
module.exports = {
  poweredByHeader: false,
}
```
