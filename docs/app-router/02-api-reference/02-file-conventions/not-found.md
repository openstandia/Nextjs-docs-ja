---
title: not-found.js
description: API reference for the not-found.js file.
sidebar_position: 5
---

**not-found**ファイルは、ルート Segment 内で[`notFound`](/docs/app-router/api-reference/functions/not-found)関数がスローされたときに UI をレンダリングするために使用されます。カスタム UI を提供すると同時に、Next.js はストリーミングされたレスポンスには`200` HTTP ステータスを返し、ストリーミングされていないレスポンスには`404` HTTP ステータスコードを返します。

```tsx title="app/blog/not-found.tsx"
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

> **Good to know**: 予期される`notFound()`エラーをキャッチするだけでなく、ルートにある`app/not-found.js`ファイルは、アプリケーション全体で一致しない URL も処理します。つまり、アプリケーションが扱っていない URL にアクセスしたユーザーには、`app/not-found.js`ファイルによってエクスポートされた UI が表示されます。

## Props

`not-found.js` コンポーネントは props を受け付けません。

## データ・フェッチ

デフォルトでは、`not-found`は Server Component です。これを`async`としてマークすると、データを取得して表示できます：

```tsx title="app/blog/not-found.tsx"
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div>
      <h2>Not Found: {data.name}</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/blog">all posts</Link>
      </p>
    </div>
  )
}
```

## Version 履歴

| Version   | Changes                                                                              |
| --------- | ------------------------------------------------------------------------------------ |
| `v13.3.0` | ルートの`app/not-found`で一致しない URL をグローバルにハンドルするようになりました。 |
| `v13.0.0` | `not-found` 導入                                                                     |
