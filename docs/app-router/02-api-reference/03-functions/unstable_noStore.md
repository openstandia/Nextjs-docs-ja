---
title: unstable_noStore
description: unstable_noStore 関数の API リファレンス
---

`unstable_noStore` を使用すると、静的レンダリングを宣言的にオプトアウトし、特定のコンポーネントをキャッシュすべきでないことを示すことができます。

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function Component() {
  noStore();
  const result = await db.query(...);
  ...
}
```

> **Good to know**:
>
> - `unstable_noStore` は、`fetch` 時の `cache: 'no-store'` と等価です。
> - より細かい粒度でコンポーネントごとに使用できるため、`export const dynamic = 'force-dynamic'` よりも、`unstable_noStore` の方が好ましいです。

- [`unstable_cache`](/docs/app-router/api-reference/functions/unstable_cache) の内部で `unstable_noStore` を使用しても、静的生成は行われません。代わりに、結果をキャッシュするかどうかの判断をキャッシュの設定に委ねます。

## 使用方法

`cache: 'no-store'` や `next: { revalidate: 0 }` のように、`fetch` 時に追加のオプションを渡したくない場合は、全てのユースケースの代替として `noStore()` を使用することができます。

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function Component() {
  noStore();
  const result = await db.query(...);
  ...
}
```

## バージョン履歴

| Version   | Changes                              |
| --------- | ------------------------------------ |
| `v14.0.0` | `unstable_noStore` が導入されました. |
