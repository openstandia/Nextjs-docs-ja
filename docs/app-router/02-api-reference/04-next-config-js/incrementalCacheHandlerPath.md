---
title: incrementalCacheHandlerPath
description: Configure the Next.js cache used for storing and revalidating data.
---

Next.js では、デフォルトのキャッシュハンドラはファイルシステムキャッシュを使用します。デフォルトのままなら設定は必要ありませんが、`next.config.js`の`incrementalCacheHandlerPath`フィールドを使用することで、キャッシュハンドラをカスタマイズできます。

```js title="next.config.js"
module.exports = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },
}
```

以下はカスタムのキャッシュ・ハンドラの例です：

```js title="next.config.js"
const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
    this.cache = {}
  }

  async get(key) {
    return cache.get(key)
  }

  async set(key, data) {
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
    })
  }
}
```

## API リファレンス

The cache handler can implement the following methods: `get`, `set`, and `revalidateTag`.

キャッシュ・ハンドラは、`get`、`set`、`revalidateTag`の各メソッドを実装できます。

### `get()`

| 引数  | 型       | 説明                     |
| ----- | -------- | ------------------------ |
| `key` | `string` | キャッシュされた値のキー |

キャッシュされた値、なければ`null`を返します。

### `set()`

| 引数   | 型             | 説明                     |
| ------ | -------------- | ------------------------ |
| `key`  | `string`       | データを保存する際のキー |
| `data` | Data or `null` | キャッシュされるデータ   |

`Promise<void>`を返します。

### `revalidateTag()`

| 引数  | 型       | 説明                     |
| ----- | -------- | ------------------------ |
| `tag` | `string` | 再検証するキャッシュタグ |

<!-- TODO: Fix links -->

`Promise<void>`を返します。 [データの再検証](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)や[`revalidateTag()`](/docs/app-router/api-reference/functions/revalidateTag)関数についてはそれぞれのドキュメントを参照してください。
