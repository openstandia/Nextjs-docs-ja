---
title: template.js
description: template.jsファイルのAPIリファレンス
sidebar_position: 11
---

**テンプレート**ファイルは、それぞれの子レイアウトやページをラップするという点で[レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト)と同様です。しかし、ルートをまたいで持続し、状態を維持するレイアウトとは異なり、テンプレートはナビゲーションごとにその子コンポーネントの新しいインスタンスを生成します。

```tsx title="app/template.tsx"
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

![template.js ファイル](../../assets/template-special-file.avif)

あまり一般的ではありませんが、次のような場合にはレイアウトよりもテンプレートの使用を検討できます:

- `useEffect`（例: ページビューのログ記録）や`useState`（例：ページごとのフィードバックフォーム）に依存する機能がある場合。
- デフォルトのフレームワークの挙動を変えるため。例えば、レイアウト内のサスペンス境界は最初にレイアウトがロードされたときだけフォールバックを表示し、ページを切り替えたときには表示しません。しかし、テンプレートでは、各ナビゲーションごとにフォールバックが表示されます。

## Props

### `children`（必須）

Templateコンポーネントは`children` propを引数に取り、使用しなければなりません。テンプレートは[レイアウト](/docs/app-router/api-reference/file-conventions/layout)とその子コンポーネントの間でレンダリングされます。例えば次のとおりです：

```jsx title="Output"
<Layout>
  {/* templateには一意のキーが与えられていることに注意してください */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

> **Good to know**:
>
> - デフォルトではテンプレートは[Server Component](/docs/app-router/building-your-application/rendering/server-components)ですが、`"use client"`ディレクティブにより[Client Component](/docs/app-router/building-your-application/rendering/client-components)としても使用できます。
> - ユーザーがテンプレートを共有するルート間を移動するとき、コンポーネントの新しいインスタンスがマウントされ、DOM要素が再作成され、状態は保存**されず**、副作用は再同期されます。

## バージョン履歴

| Version   | Changes          |
| --------- | ---------------- |
| `v13.0.0` | `template`の導入 |
