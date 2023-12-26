---
title: notFound
description: API Reference for the notFound function.
---

`notFound`関数を使うと、ルート Segment 内で[`not-found`ファイル](/docs/app-router/api-reference/file-conventions/not-found)をレンダリングして、`<meta name="robots" content="noindex" />`タグを挿入できます。

## `notFound()`

`notFound()` 関数を呼び出すと、`NEXT_NOT_FOUND`エラーがスローされ、スローされたルート Segment のレンダリングが終了します。[**not-found** ファイル](/docs/app-router/api-reference/file-conventions/not-found)を指定して、Segment 内で Not Found UI をレンダリングすることで、このようなエラーを処理できます。

```ts title="app/user/[id]/page.js"
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const user = await fetchUser(params.id)

  if (!user) {
    notFound()
  }

  // ...
}
```

> **Good to know**: `notFound()`は、TypeScript の[`never`型](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)を使用しているため、`return notFound()` という記述は必要はありません。

## Version 履歴

| Version   | Changes         |
| --------- | --------------- |
| `v13.0.0` | `notFound` 導入 |
