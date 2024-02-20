---
title: ロギング
description: 開発モードで Next.js を実行する際のデータフェッチのログ出力設定方法
---

Next.js を開発モードで実行しているときに、完全な URL がコンソールにログ出力されるかどうかと、ログレベル設定ができます。

現在、`logging` は `fetch` APIを使用したデータフェッチにのみ適用されます。 Next.js 内の他のログにはまだ適用されません。

```js title="next.config.js"
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```