---
title: generateImageMetadata
description: 1 つの Metadata API 専用ファイルに複数の画像を生成する方法を紹介します。
related:
  title: 次のステップ
  description: Metadata APIオプションをすべて表示します
  links:
    - app-router/api-reference/file-conventions/metadata
    - app-router/building-your-application/optimizing/metadata
---

`generateImageMetadata` を使用して、1 つの画像の異なるバージョンを生成したり 1 つのルートセグメントに対して複数の画像を返したりすることができます。
これは、アイコンのようにメタデータの値をハードコーディングするのを避けたい場合に便利です。

## Parameters

`generateImageMetadata` 関数は以下のパラメータを受け付けます:

#### `params` (任意)

ルートセグメントから `generateImageMetadata` が呼び出されたセグメントまでの、[動的ルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)オブジェクトを含むオブジェクトです。

```tsx title="icon.tsx"
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  // ...
}
```

| ルート                          | URL         | `params`                  |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/icon.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

## Returns

`generateImageMetadata` 関数は、`alt` や `size` などの画像のメタデータを含むオブジェクトの `array` を返す必要があります。さらに、各項目は画像生成関数の props に渡される `id` 値を含んで **いなければなりません**。

| 画像メタデータオブジェクト | 型                                  |
| -------------------------- | ----------------------------------- |
| `id`                       | `string` (必須)                     |
| `alt`                      | `string`                            |
| `size`                     | `{ width: number; height: number }` |
| `contentType`              | `string`                            |

```tsx title="icon.tsx"
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default function Icon({ id }: { id: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {id}
      </div>
    )
  )
}
```

### 例

#### 外部データの利用

この例では、`params` オブジェクトと外部データを使って、ルートセグメントに対して複数の [Open Graph 画像](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image)を生成します。

```tsx title="app/products/[id]/opengraph-image.tsx"
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app-router/utils/images'

export async function generateImageMetadata({
  params,
}: {
  params: { id: string }
}) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({
  params,
  id,
}: {
  params: { id: string }
  id: number
}) {
  const productId = params.id
  const imageId = id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

## バージョン履歴

| Version   | Changes                                    |
| --------- | ------------------------------------------ |
| `v13.3.0` | `generateImageMetadata` が導入されました。 |
