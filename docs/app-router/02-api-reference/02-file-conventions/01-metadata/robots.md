---
title: robots.txt
description: robots.txt ファイルの API リファレンスです。
sidebar_position: 4
---

<!-- textlint-disable -->

検索エンジンのクローラーへサイト内でアクセス可能な URL を知らせるために、`app`ディレクトリの**ルート**に[Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt#Standard)へ準拠した`robots.txt`ファイルを追加または生成します。

<!-- textlint-enable -->

## 静的な`robots.txt`

```txt title="app/robots.txt"
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## Robots ファイルを生成する

[Robots オブジェクト](#robotsオブジェクト)を返す`robots.js`または`robots.ts`ファイルを追加します。

```ts title="app/robots.ts"
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

出力：

```
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

### Robots オブジェクト

```ts
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }>
  sitemap?: string | string[]
  host?: string
}
```

## バージョン履歴

| Version   | Changes       |
| :-------- | :------------ |
| `v13.3.0` | `robots` 導入 |
