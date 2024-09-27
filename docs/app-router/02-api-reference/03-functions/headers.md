---
タイトル: headers
説明: headers 関数の API リファレンスです。
---

`headers`関数を使用すると、[Server Component](/docs/app-router/building-your-application/rendering/server-components)からHTTPの受信リクエストヘッダーを読み取ることができます。

## `headers()`

このAPIは、[Web Headers API](https://developer.mozilla.org/docs/Web/API/Headers)を拡張しています。**読み取り専用**であるため、送信リクエストヘッダーを`set`または`delete`できません。

```tsx title="app/page.tsx"
import { headers } from 'next/headers'

export default function Page() {
  const headersList = headers()
  const referer = headersList.get('referer')

  return <div>Referer: {referer}</div>
}
```

> **Good to know:**
>
> - `headers()`は**[動的関数](/docs/app-router/building-your-application/rendering/server-components#動的関数)**で、事前に返り値を知ることはできません。これをレイアウトまたはページで使用すると、ルートがリクエスト時に**[動的レンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)**に切り替わります。

### API リファレンス

```tsx
const headersList = headers()
```

#### Paramters

`headers`はパラメーターを取りません。

#### Returns

`headers`は**読み取り専用**の[Web Headers](https://developer.mozilla.org/docs/Web/API/Headers)オブジェクトを返します。

- [`Headers.entries()`](https://developer.mozilla.org/docs/Web/API/Headers/entries): このオブジェクトに含まれるすべてのキー/バリューのペアを走査できる [`イテレータ`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) を返します。
- [`Headers.forEach()`](https://developer.mozilla.org/docs/Web/API/Headers/forEach): この `Headers` オブジェクト内の各キー/バリューのペアに対して指定された関数を一度実行します。
- [`Headers.get()`](https://developer.mozilla.org/docs/Web/API/Headers/get): `Headers`オブジェクト内で指定された名前のヘッダーのすべての値の [`文字列`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) を返します。
- [`Headers.has()`](https://developer.mozilla.org/docs/Web/API/Headers/has): `Headers`オブジェクトが特定のヘッダーを含んでいるかどうかを示すブール値を返します。
- [`Headers.keys()`](https://developer.mozilla.org/docs/Web/API/Headers/keys): このオブジェクトに含まれるキー/バリューのペアのすべてのキーを走査できる [`イテレータ`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) を返します。
- [`Headers.values()`](https://developer.mozilla.org/docs/Web/API/Headers/values): このオブジェクトに含まれるキー/バリューのペアのすべてのバリューを走査できる [`イテレータ`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) を返します。

### 例

#### データフェッチでの使用

`headers()` は [データフェッチ用のSuspense](/docs/app-router/building-your-application/data-fetching/fetching-caching-and-revalidating)と組み合わせて使用できます。

```jsx title="app/page.js"
import { Suspense } from 'react'
import { headers } from 'next/headers'

async function User() {
  const authorization = headers().get('authorization')
  const res = await fetch('...', {
    headers: { authorization }, // 認証ヘッダーを転送します
  })
  const user = await res.json()

  return <h1>{user.name}</h1>
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <User />
    </Suspense>
  )
}
```

#### IPアドレス

`headers()`は、クライアントのIPアドレスを取得するために使用できます。

```jsx title="app/page.js"
import { Suspense } from 'react'
import { headers } from 'next/headers'

function IP() {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = headers().get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <IP />
    </Suspense>
  )
}
```

`x-forwarded-for`に加えて、`headers()`は以下も読み取ることができます:

- `x-real-ip`
- `x-forwarded-host`
- `x-forwarded-port`
- `x-forwarded-proto`

## バージョン履歴

| バージョン | 変更             |
| ---------- | ---------------- |
| `v13.0.0`  | `headers` の導入 |
