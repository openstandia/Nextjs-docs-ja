---
title: error.js
description: API reference for the error.js special file.
related:
  title: Learn more about error handling
  links:
    - app/building-your-application/routing/error-handling
sidebar_position: 2
---

**error**ファイルは、ルート Segment のエラー UI Boundary を定義します。

Server Components や Client Components で発生した**予期しない**エラーをキャッチし、フォールバック UI を表示するのに便利です。

```tsx title="app/dashboard/error.tsx"
'use client' // ErrorコンポーネントはClient Componentsである必要がある

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // レポートサービスにエラーを記録する
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Segmentの再レンダリングを試みる
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

## Props

### `error`

Client Component である`error.js`に転送された[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)オブジェクトのインスタンス。

#### `error.message`

エラーメッセージです。

- Client Components から転送されたエラーの場合、これは元のエラーのメッセージになります
- Server Components から転送されたエラーの場合は、機密情報の漏洩を避けるために一般的なエラーメッセージとなります。`errors.digest`を使用して、サーバー側のログにある対応するエラーとマッチさせることができます

#### `error.digest`

Server Component でスローされたエラーの自動生成ハッシュ。サーバー側のログに対応するエラーとマッチさせるために使用します。

### `reset`

エラーバウンダリをリセットする関数。実行されると、この関数はエラーバウンダリの内容の再レンダリングを試みます。成功した場合、フォールバックのエラーコンポーネントは再レンダリングの結果で置き換えられます。

ユーザーにエラーからの回復を試みるよう促すために使用できます。

> **Good to know**:

<!-- TODO: fix link -->

> - `error.js` は[Client Component](/docs/app-router/building-your-application/rendering/client-components)である必要があります
> - プロダクション用のビルドでは、Server Components から転送されたエラーは、機密情報の漏洩を避けるために、特定のエラー詳細が取り除かれます
> - `error.js`バウンダリは、**同じ**Segment 内の`layout.js`コンポーネントでスローされたエラーを処理しません。なぜなら、エラーバウンダリはそのレイアウト・コンポーネントの中にネストされているからです
>   - 特定のレイアウトのエラーを処理するには、レイアウトの親 Segment に`error.js`ファイルを配置します
>   - ルートレイアウトまたはテンプレート内でエラーを処理するには、`app/global-error.js`という`error.js`のバリエーションを使います

## `global-error.js`

ルートの`layout.js`でエラーを処理するには、`app`ディレクトリのルートで`error.js`のバリエーションである`app/global-error.js`を使います。

```tsx title="app/global-error.tsx"
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

> **Good to know**:
>
> - `global-error.js`は、アクティブになるとルートの`layout.js`と置き換わるので、`<html>`タグと`<body>`タグを定義する必要があります
> - エラー UI をデザインする際、[React Developer Tools](https://ja.react.dev/learn/react-developer-tools)を使って手動でエラーバウンダリに切り替えると便利です

## バージョン履歴

| Version   | Changes              |
| :-------- | :------------------- |
| `v13.1.0` | `global-error`の導入 |
| `v13.0.0` | `error`の導入        |

## エラーハンドリングについてさらに学ぶ

[Error Handling](/docs/app-router/building-your-application/routing/error-handling)
