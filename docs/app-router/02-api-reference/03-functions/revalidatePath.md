---
title: revalidatePath
description: revalidatePath 関数の API リファレンス
---

`revalidatePath`を使用すると、特定のパスに対する[キャッシュ・データ](/docs/app-router/building-your-application/caching)をオンデマンドで消去できます。

> **Good to know**:
>
> - `revalidatePath` は [Node.js と Edge runtimes](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes)で使用できます。
> - `revalidatePath` は、パスが次に訪問されたときにのみキャッシュを無効にする。つまり、動的な Route Segment で`revalidatePath`を呼び出しても、すぐに複数の再検証が一度に行われるわけではなく、無効化はパスが次に訪問されたときにのみ行われます。
> - 現在、`revalidatePath` は[クライアントサイドの Router Cache](/docs/app-router/building-your-application/caching#router-cache)内のすべてのルートを無効にする。この動作は一時的なもので、将来的には特定のパスにのみ適用されるように更新される予定です。
> - `revalidatePath` を使用すると、[サーバーサイドの Full Route Cache](/docs/app-router/building-your-application/caching#full-route-cache)の特定のパスだけが無効になります。

## Parameters

```tsx
revalidatePath(path: string, type?: 'page' | 'layout'): void;
```

<!-- textlint-disable -->

- `path`: 再検証したいデータに関連するファイルシステムのパスを表す文字列 (例: `/product/[slug]/page`)、またはリテラルRoute Segment (例: `/product/123`)です。1024 文字未満でなければなりません。
<!-- textlint-enable -->
- `type`:（オプション）文字列`'page'` または `'layout'` で、再検証するパスのタイプを変更する。パスが動的な Segment (たとえば `/product/[slug]/page`) を含む場合は、このパラメータが必須となります。

## Returns

`revalidatePath` は値を返しません。

## 例

### 特定のURLを再検証する

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

この例は、次のページ訪問時に特定のURLを再検証します。

### ページのパスを再検証する

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
// or with route groups
revalidatePath('/(main)/post/[slug]', 'page')
```

次のページ訪問時に、指定された`page` ファイルにマッチするすべてのURLを再検証します。特定のページの下のページは無効に*なりません*。例えば、`/blog/[slug]` は `/blog/[slug]/[author]`を無効にしません。

### レイアウトのパスを再検証する

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'layout')
// またはルート・グループ
revalidatePath('/(main)/post/[slug]', 'layout')
```

次のページ訪問時に、指定された `layout` ファイルにマッチするURLを再検証します。これにより、同じレイアウトの下にあるページが次の訪問時に再検証されます。例えば、上記の場合、`/blog/[slug]/[another]`も次の訪問時に再検証されます。

### すべてのデータを再検証する

```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/', 'layout')
```

クライアント側のRouter Cacheが削除され、次のページ訪問時にData Cacheが再検証されます。

### Server Action

```ts title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

### Route Handler

```ts title="app/api/revalidate/route.ts"
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```
