---
title: generateSitemaps
nav_title: generateSitemaps
description: generateSiteMaps関数を使用して、アプリケーション用に複数のサイトマップを作成する方法を説明します
related:
  title: 次のステップ
  description: Next.jsアプリケーションのサイトマップを作成する方法をご紹介します
  links:
    - app-router/api-reference/file-conventions/metadata/sitemap
---

`generateSitemaps` 関数を使用すると、アプリケーション用に複数のサイトマップを生成できます。

## Returns

`generateSitemaps` は、`id` プロパティを持つオブジェクトの配列を返します。

## URLs

本番環境では、生成されたサイトマップは `/.../sitemap/[id].xml` で利用できるようになります。例えば、`/product/sitemap/1.xml` です。

開発環境では、生成されたサイトマップを `/.../sitemap.xml/[id]` で見ることができます。例えば、`/product/sitemap.xml/1` です。この違いは一時的なもので、本番用のフォーマットに従います。

## 例

例えば、`generateSitemaps` を使用してサイトマップを分割するには、サイトマップの `id` を持つオブジェクトの配列を返します。そして、ユニークなサイトマップを生成するために `id` を使用します。

```ts title="app/product/sitemap.ts"
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 総数を取得し、必要なサイトマップの数を計算する
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): MetadataRoute.Sitemap {
  // Google のサイトマップは 50,000 URL が上限
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`
    lastModified: product.date,
  }))
}
```
