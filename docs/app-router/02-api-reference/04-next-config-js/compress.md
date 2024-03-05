---
title: compress
description: Next.jsは、レンダリングされたコンテンツと静的ファイルを圧縮するためのgzip圧縮を提供していますが、これはサーバーターゲットでのみ機能します。詳細についてはこちらをご覧ください。
---

Next.js はレンダリングコンテンツと静的ファイルを圧縮するために[gzip](https://tools.ietf.org/html/rfc6713#section-3)を使用しています。一般的には、Node.js プロセスからの負荷を軽減するために、[nginx](https://www.nginx.com/)のような HTTP プロキシで圧縮を有効にします。

圧縮を無効にするには、`next.config.js`を開き、`compress`設定を無効にします：

```js title="next.config.js"
module.exports = {
  compress: false,
}
```
