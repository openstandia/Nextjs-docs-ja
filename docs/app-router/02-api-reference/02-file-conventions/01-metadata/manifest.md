---
title: manifest.json
description: manifest.json ファイルの API リファレンスです。
sidebar_position: 2
---

ブラウザに Web アプリケーションの情報を提供するために、`app` ディレクトリのルートに [Web Manifest Specification](https://developer.mozilla.org/ja/docs/Web/Manifest) に一致する`manifest.(json|webmanifest)` ファイルを追加または生成します。

## 静的なマニフェストファイル

```json title="app/manifest.json | app/manifest.webmanifest"
{
  "name": "My Next.js Application",
  "short_name": "Next.js App",
  "description": "An application built with Next.js",
  "start_url": "/"
  // ...
}
```

## マニフェストファイルの生成

[マニフェストオブジェクト](#マニフェストオブジェクト)を返す`manifest.js`または`manifest.ts`ファイルを追加します。

```ts title="app/manifest.ts"
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

### マニフェストオブジェクト

マニフェストオブジェクトには、新しい Web 標準のために更新される可能性のあるオプションの広範なリストが含まれています。現在のすべてのオプションに関する情報は、[TypeScript](/docs/app-router/building-your-application/configuring/typescript#typescript-plugin)を使用している場合はコードエディタで`MetadataRoute.Manifest`型を参照するか、[MDN ドキュメント](https://developer.mozilla.org/en-US/docs/Web/Manifest)を参照してください。
