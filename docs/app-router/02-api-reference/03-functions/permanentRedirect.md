---
title: permanentRedirect
description: permanentRedirect 関数の API リファレンスです。
related:
  links:
    - app-router/api-reference/functions/redirect
---

`permanentRedirect`関数を使用すると、ユーザーを別のURLにリダイレクトできます。`permanentRedirect`はServer Components、Client Components、[Route Handlers](/docs/app-router/building-your-application/routing/route-handlers)、および[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)で使用できます。

ストリーミングのコンテキストで使用されると、クライアント側でリダイレクトを発生させるためのメタタグを挿入します。Server Actionで使用されると、呼び出し元に対して303 HTTPリダイレクトレスポンスを返します。それ以外の場合は、呼び出し元に対して308（パーマネント）HTTPリダイレクトレスポンスを返します。

リソースが存在しない場合は、代わりに[`notFound`関数](/docs/app-router/api-reference/functions/not-found)を使用できます。

> **Good to know**: 308（Permanent）の代わりに307（Temporary）HTTPリダイレクトを返したい場合は、代わりに[`redirect`関数](/docs/app-router/api-reference/functions/redirect)を使用できます。

## パラメーター

`permanentRedirect`関数は2つの引数を受け取ります：

```js
permanentRedirect(path, type)
```

| パラメータ | タイプ                                                                    | 説明                                                        |
| ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `path`     | `string`                                                                  | リダイレクト先のURL。相対パスまたは絶対パスが指定できます。 |
| `type`     | `'replace'`（デフォルト）または `'push'`（Server Actions でのデフォルト） | 実行するリダイレクトのタイプ。                              |

<!-- textlint-disable -->

<!-- TODO: fix link to Server Actions -->

デフォルトでは、`permanentRedirect`は[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)で`push`（ブラウザの履歴スタックに新たなエントリを追加する）を使用し、それ以外では`replace`（ブラウザの履歴スタックの現在のURLを置き換える）を使用します。`type`パラメータを指定することで、この動作を上書きできます。

<!-- textlint-enable -->

`type`パラメータは、Server Components で使用した場合には効果がありません。

## 戻り値

`permanentRedirect`は値を返しません。

## 例

`permanentRedirect()`関数を呼び出すと、`NEXT_REDIRECT`エラーをスローし、それがスローされたRoute Segmentの描画を終了します。

```jsx title="app/team/[id]/page.js"
import { permanentRedirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    permanentRedirect('/login')
  }

  // ...
}
```

> **Good to know**：`permanentRedirect`は TypeScript の[`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)型を使用しているため、`return permanentRedirect()`と書く必要はありません。
