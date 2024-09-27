---
title: sitemap.xml
description: sitemap.xml ファイルの API リファレンスです。
sidebar_position: 5
---

検索エンジンのクローラーがより効率的にサイトをクロールできるように、`app`ディレクトリの**ルート**に[Sitemaps XML フォーマット](https://www.sitemaps.org/protocol.html)と一致する`sitemap.xml`ファイルを追加または生成します。

## 静的な`sitemap.xml`

```xml title="app/sitemap.xml"
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

## サイトマップを生成する

[Sitemap](#sitemap-の-return-type)を返す`sitemap.js`または`sitemap.ts`ファイルを追加します。

```ts title="app/sitemap.ts"
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

出力：

```xml title="acme.com/sitemap.xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Sitemap の Return Type

```
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}>
```

> **Good to know**
>
> - 将来的には、複数のサイトマップとサイトマップインデックスをサポートする予定です

## バージョン履歴

| Version   | Changes                                                   |
| :-------- | :-------------------------------------------------------- |
| `v13.3.0` | `sitemap` 導入                                            |
| `v13.4.5` | サイトマップに`changeFrequency`属性と`priority`属性を追加 |
