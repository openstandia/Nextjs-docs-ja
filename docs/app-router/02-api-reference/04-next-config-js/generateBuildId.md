---
title: generateBuildId
description: Configure the build id, which is used to identify the current build in which your application is being served.
---

Next.js は、ビルド時に生成される id 定数を使用して、どのバージョンのアプリケーションが提供されているかを識別します。このため、複数のサーバーへデプロイし`next build`が各サーバーで実行される場合に問題を起こす可能性があります。ビルド間で一貫したビルド ID を保つために、独自のビルド ID を指定できます。

`next.config.js`を開き、`generateBuildId`関数を追加します：

```js title="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // 例えば、最新のgit コミットハッシュを使用することもできます
    return 'my-build-id'
  },
}
```
