---
title: Custom Next.js Cache Handler
sidebar_label: cacheHandler
description: Next.jsのキャッシュを構成し、Redis、Memcachedなどの外部サービスを使用してデータを保存、再検証する方法を学習します。
---

Next.js では、Pages Router及びApp Routerの[デフォルトのキャッシュハンドラ](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)はファイルシステムキャッシュを使用します。これには設定は必要ありませんが、`next.config.js`の`cacheHandler`フィールドを使用してキャッシュハンドラをカスタマイズすることができます。

```js title="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // disable default in-memory caching
}
```

[カスタムキャッシュハンドラ](/docs/app-router/building-your-application/deploying#キャッシュ設定)の例を確認し、実装について詳しく学習します。

## API リファレンス

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
| `ctx`  | `{ tags: [] }` | 提供されたキャッシュタグ |

`Promise<void>`を返します。

### `revalidateTag()`

| 引数  | 型       | 説明                     |
| ----- | -------- | ------------------------ |
| `tag` | `string` | 再検証するキャッシュタグ |

`Promise<void>`を返します。 [データの再検証](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)や[`revalidateTag()`](/docs/app-router/api-reference/functions/revalidateTag)関数についてはそれぞれのドキュメントを参照してください。

#### Good to know:

- `revalidatePath`はキャッシュタグの上にある便利なレイヤーです。`revalidatePath`を呼び出すと`revalidateTag`関数が呼び出され、パスに基づいてキャッシュキーにタグを付けるかどうかを選択できます。

## バージョン履歴

| Version   | Change                                                                              |
| --------- | ----------------------------------------------------------------------------------- |
| `v14.1.0` | 名前を変更した`cacheHandler`が安定版になりました。                                  |
| `v13.4.0` | `incrementalCacheHandlerPath`（実験的）は`revalidateTag`をサポートしています。      |
| `v13.4.0` | `incrementalCacheHandlerPath`（実験的）はスタンドアロンの出力をサポートしています。 |
| `v12.2.0` | `incrementalCacheHandlerPath`（実験的）が追加されました。                           |
