---
title: unstable_cache
description: unstable_cache 関数の API リファレンス
---

`unstable_cache` は、データベースクエリのような重要な操作の結果をキャッシュし、複数のリクエストで再利用することができます。

```jsx
import { getUser } from './data';
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
);

export default async function Component({ userID }) {
  const user = await getCachedUser(userID);
  ...
}
```

> **注意**: このAPIは不安定であり、将来変更される可能性があります。このAPIが安定するにつれ、必要に応じて移行ドキュメントや codemod を提供します。

## Parameters

```jsx
const data = unstable_cache(fetchData, keyParts, options)()
```

- `fetchData`: キャッシュしたいデータをフェッチする非同期関数です。`Promise` を返す関数でなければなりません。
- `keyParts`: キャッシュされるキーを識別する配列です。キャッシュされるデータのキーを識別するために、グローバルに一意な値を含める必要があります。キャッシュキーには、関数に渡される引数も含まれます。
- `options`: キャッシュの動作を制御するオブジェクトです。以下のプロパティを含むことができます:
  - `tags`: キャッシュの無効化を制御するために使用できるタグの配列です。
  - `revalidate`: キャッシュを再検証するまでの秒数です。

## Returns

`unstable_cache` は、呼び出されたときにキャッシュされたデータを解決する Promise を返す関数を返します。
データがキャッシュにない場合は、指定した関数が呼び出され、その結果がキャッシュされて返されます。

## バージョン履歴

| Version   | Changes                             |
| --------- | ----------------------------------- |
| `v14.0.0` | `unstable_cache` が導入されました。 |
