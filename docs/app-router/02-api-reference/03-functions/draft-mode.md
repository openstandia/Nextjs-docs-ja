---
title: draftMode
description: API Reference for the draftMode function.
---

`draftMode` 関数を使用すると、[Server Component](/docs/app-router/building-your-application/rendering/server-components)
内で [Draft Mode](/docs/app-router/building-your-application/configuring/draft-mode) を検出することができます。

```tsx title="app/page.js"
import { draftMode } from 'next/headers'

export default function Page() {
  const { isEnabled } = draftMode()
  return (
    <main>
      <h1>My Blog Post</h1>
      <p>Draft Mode is currently {isEnabled ? 'Enabled' : 'Disabled'}</p>
    </main>
  )
}
```

## バージョン履歴

| バージョン | 変更内容                       |
| ---------- | ------------------------------ |
| `v13.4.0`  | `draftMode` が導入されました。 |
