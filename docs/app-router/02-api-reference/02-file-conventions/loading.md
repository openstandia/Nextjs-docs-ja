---
title: loading.js
description: API reference for the loading.js  file.
sidebar_position: 4
---

**loading**ファイルは、[Suspense](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)上に構築されたインスタント・ローディングの状態を作り出すことができます。

デフォルトでは、このファイルは Server Components ですが、`"use client"`ディレクティブによって Client Components として使用できます。

```tsx title="app/feed/loading.tsx"
export default function Loading() {
  // またはカスタムのローディング・スケルトン コンポーネント
  return <p>'Loading...'</p>
}
```

ローディング UI コンポーネントはパラメータを受け付けません。

> **Good to know**:
>
> - ローディング UI をデザインしている間、[React Developer Tools](https://ja.react.dev/learn/react-developer-tools)を使って Suspense バウンダリに手動で切り替えると便利です。
