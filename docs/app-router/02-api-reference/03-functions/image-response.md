---
title: ImageResponse
description: ImageResponse コンストラクタの API リファレンス。
---

`ImageResponse` コンストラクターを使用すると、JSX と CSS を使って動的な画像を生成できます。これは、Open Graph 画像、Twitter カードなどのソーシャルメディア画像を生成するのに便利です。

`ImageResponse` で利用可能なオプションは以下のとおりです：

```tsx
import { ImageResponse } from 'next/og'

new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
       style: 'normal' | 'italic'
      }[]
    debug?: boolean = false

    // Options that will be passed to the HTTP response
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

## サポートされている CSS プロパティ

サポートされている HTML および CSS の機能の一覧については、[Satori のドキュメンテーション](https://github.com/vercel/satori#css)を参照してください。

## バージョン履歴

| バージョン | 変更内容                                                           |
| ---------- | ------------------------------------------------------------------ |
| `v14.0.0`  | `ImageResponse` は `next/server` から `next/og` に移動されました。 |
| `v13.3.0`  | `ImageResponse` を `next/server` からインポート可能に。            |
| `v13.0.0`  | `ImageResponse` は `@vercel/og` で追加されました。                 |
