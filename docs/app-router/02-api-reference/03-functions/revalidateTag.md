---
title: revalidateTag
description: revalidateTag 関数のAPI Reference
---

`revalidateTag` allows you to purge [cached data](/docs/app/building-your-application/caching) on-demand for a specific cache tag.

`revalidateTag` を使用すると、特定のキャッシュ・タグの[キャッシュ・データ](/docs/app-router/building-your-application/caching)をオンデマンドで消去できます。

> **Good to know**:
>
> - `revalidateTag` is available in both [Node.js and Edge runtimes](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes).
> - `ravalidateTag` は、パスが次に訪問されたときにのみキャッシュを無効にします。つまり、動的な Route Segment で`revalidateTag`を呼び出しても、すぐに多くの再検証が一度に行われるわけではなく、無効化はパスが次に訪問されたときにのみ行われる

## Parameters

```tsx
revalidateTag(tag: string): void;
```

- `tag`： 再検証したいデータに関連付けられたキャッシュ・タグを表す文字列。256文字以下


You can add tags to `fetch` as follows:
以下のように`fetch`にタグをつけることができます：

```tsx
fetch(url, { next: { tags: [...] } });
```

## Returns

`revalidateTag` は値を返しません。

## 例

### Server Action

```ts title="app/actions.ts" 
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

### Route Handler

```ts title="app/api/revalidate/route.ts" 
import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

