---
title: generateEtags
description: Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.
---

Next.js はデフォルトですべてのページに[etag](https://en.wikipedia.org/wiki/HTTP_ETag?useskin=vector)を生成します。キャッシュ戦略によっては、HTML ページの etag 生成を無効にしたい場合があります。

`next.config.js`を開き、`generateEtags`オプションを無効にします：

```js title="next.config.js"
module.exports = {
  generateEtags: false,
}
```
