---
title: 絶対インポートとモジュール・パス・エイリアス
description: 特定のインポートパスをリマップするためのモジュール・パス・エイリアスを設定します。
---

<details>
  <summary>例</summary>

- [絶対インポートとエイリアス](https://github.com/vercel/next.js/tree/canary/examples/with-absolute-imports)

</details>

Next.jsは `tsconfig.json` と `jsconfig.json` のオプション `"paths"`と `"baseUrl"`をサポートしています。

これらのオプションを使うと、プロジェクトディレクトリを絶対パスにエイリアスでき、モジュールのインポートが簡単になります。例えば:

```tsx
// 変更前
import { Button } from '../../../components/button'

// 変更後
import { Button } from '@/components/button'
```

> **Good to know**: `create-next-app` はこれらのオプションを設定するようにプロンプトします。

## 絶対インポート

`baseUrl` 設定オプションを使うと、プロジェクトのルートから直接インポートできます。

設定の例:

```json title="tsconfig.json または jsconfig.json"
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

```jsx title="components/button.tsx"
export default function Button() {
  return <button>Click me</button>
}
```

```tsx title="app/page.tsx"
import Button from 'components/button'

export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  )
}
```

## モジュールエイリアス

`baseUrl` パスを設定するうえで、`"paths"`オプションを使ってモジュールパスを"エイリアス化"できます。

例えば、次の設定では、`@/components/*`を`components/*`にマップします:

```json title="tsconfig.json または jsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```tsx title="components/button.tsx"
export default function Button() {
  return <button>Click me</button>
}
```

```tsx title="app/page.tsx"
import Button from '@/components/button'

export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  )
}
```

`"paths"` の各指定は、`baseUrl` の位置に対して相対的です。例えば:

```json
// tsconfig.json または jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

```jsx
// pages/index.js
import Button from '@/components/button'
import '@/styles/styles.css'
import Helper from 'utils/helper'

export default function HomePage() {
  return (
    <Helper>
      <h1>Hello World</h1>
      <Button />
    </Helper>
  )
}
```