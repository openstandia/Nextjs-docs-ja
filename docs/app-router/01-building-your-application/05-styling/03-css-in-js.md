---
title: CSS-in-JS
description: Next.js で CSS-in-JS ライブラリを使用する
---

> **注意:** 実行時の JavaScript ランタイムが必要な CSS-in-JS ライブラリは、現在 Server Components でサポートされていません。Server Components や Streaming など、新しい React 機能と CSS-in-JS を使用するには、ライブラリの作者が React の最新バージョン( [並行レンダリング](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)を含む)をサポートする必要があります。
>
> 現在 Next.js チームは React Server Components とストリーミングアーキテクチャをサポートする CSS と JavaScript アセットを扱うための上流の API について、React チームと協力して作業しています。

`app` ディレクトリ内の Client Components で以下のライブラリがサポートされています（アルファベット順）:
- [`chakra-ui`](https://chakra-ui.com/getting-started/nextjs-app-guide)
- [`kuma-ui`](https://kuma-ui.com)
- [`@mui/material`](https://mui.com/material-ui/guides/next-js-app-router/)
- [`pandacss`](https://panda-css.com)
- [`styled-jsx`](#styled-jsx)
- [`styled-components`](#styled-components)
- [`stylex`](https://stylexjs.com)
- [`tamagui`](https://tamagui.dev/docs/guides/next-js#server-components)
- [`tss-react`](https://tss-react.dev/)
- [`vanilla-extract`](https://vanilla-extract.style)

現在対応を進めているライブラリ:
- [`emotion`](https://github.com/emotion-js/emotion/issues/2928)

> Good to know: 様々な CSS-in-JS ライブラリを試し、React 18 の機能や `app` ディレクトリをサポートするライブラリについて、さらに多くの例を追加する予定です。

Server Components をスタイリングする場合、CSS ファイルを出力する [CSS Modules](/docs/app-router/building-your-application/styling/css-modules) や PostCSS、[Tailwind CSS](/docs/app-router/building-your-application/styling/tailwind-css) などの他の解決策の使用をお勧めします。

## `app` での CSS-in-JS の設定

CSS-in-JS を設定するには、以下の 3 ステップで構成されるオプトインのプロセスが必要です:

1. レンダリング中のすべての CSS ルールを収集する **スタイルレジストリ**
2. ルールを使用する可能性のあるすべてのコンテンツの前にルールを注入する `useServerInsertedHTML` フック
3. 初期サーバーサイドレンダリング中にアプリケーションをスタイルレジストリでラップする Client Component

### `styled-jsx`

Client Components で `styled-jsx` を使用するには、`v5.1.0` を使用します。まず、新しいレジストリを作成します:

```tsx title="app/registry.tsx"
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
	// lazy な初期状態で、一度だけスタイルシートを作成する
  // 参考: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

次に、レジストリで[ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)をラップします:

```tsx title="app/layout.tsx"
import StyledJsxRegistry from './registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

[例を見る](https://github.com/vercel/app-playground/tree/main/app/styling/styled-jsx).

### Styled Components

以下は、`styled-components@6` 以降を設定する方法の例です:

まず、`next.config.js` で styled-components を有効にします。

```js title="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

次に `styled-components` API を使用して、描画中に生成されたすべての CSS スタイルルールを収集するグローバルレジストリコンポーネントと、それらのルールを返す関数を作成します。その後、`useServerInsertedHTML` フックを使用して、ルートレイアウトの `<head>` HTML タグにレジストリで収集されたスタイルを注入します。

```tsx title="lib/registry.tsx"
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
	// lazy な初期状態で、一度だけスタイルシートを作成する
  // 参考: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

ルートレイアウトの `children` をスタイルレジストリコンポーネントでラップします:

```tsx title="app/layout.tsx"
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

[例を見る](https://github.com/vercel/app-playground/tree/main/app/styling/styled-components).

> Good to know:
>
> - サーバーレンダリング中には、スタイルがグローバルレジストリに抽出され、HTML の `<head>` にフラッシュされます。これにより、スタイルルールがそれらを使用する可能性のあるあらゆるコンテンツの前に配置されることが保証されます。将来的には、スタイルをどこに注入するかを決定するために、React の今後の機能を使用することがあります。
> - ストリーミング時には、各チャンクからのスタイルが収集され、既存のスタイルに追加されます。クライアントサイドのハイドレーションが完了すると、`styled-components` は通常どおりに引き継ぎ、さらなる動的スタイルを注入します。
> - スタイルレジストリのために、ツリーの最上位に Client Component を特に使用するのは、この方法で CSS ルールを抽出するほうが効率的だからです。これにより、後続のサーバーレンダリング時にスタイルの再生成を回避し、Server Component のペイロードでそれらが送信されるのを防ぎます。
> - styled-components のコンパイルで個々のプロパティを設定する必要がある高度なユースケースに対して、[Next.js styled-components API リファレンス](/docs/architecture/nextjs-compiler#styled-components) で詳しく学ぶことができます。