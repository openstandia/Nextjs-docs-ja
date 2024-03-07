---
title: generateEtags
description: Next.jsでは、デフォルトですべてのページにetagが生成されます。etagの生成を無効にする方法については、こちらで詳細をご確認ください。
sidebar_position: 11
---

Next.js はデフォルトですべてのページに[etag](https://en.wikipedia.org/wiki/HTTP_ETag?useskin=vector)を生成します。キャッシュ戦略によっては、HTML ページの etag 生成を無効にしたい場合があります。

`next.config.js`を開き、`generateEtags`オプションを無効にします：

```js title="next.config.js"
module.exports = {
  generateEtags: false,
}
```
