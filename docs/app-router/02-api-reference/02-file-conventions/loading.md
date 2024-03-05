---
title: loading.js
description: loading.js ファイルのAPIリファレンス。
sidebar_position: 5
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

## バージョン履歴

| Version   | Changes         |
| --------- | --------------- |
| `v13.0.0` | `loading`の導入 |
