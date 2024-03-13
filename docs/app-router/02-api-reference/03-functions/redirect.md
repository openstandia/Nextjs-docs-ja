---
title: redirect
description: redirect 関数の API リファレンスです。
related:
  links:
    - app-router/api-reference/functions/permanentRedirect
---

`redirect` 関数はユーザーを他のURLにリダイレクトすることを可能にします。`redirect`は[Server Component](/docs/app-router/building-your-application/rendering/server-components)、[Route Handlers](/docs/app-router/building-your-application/routing/route-handlers)、[Server Actions](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations)で利用できます。

[ストリーミングのコンテキスト](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#ストリーミングとは)で利用するとクライアント側でリダイレクトを発生させるためのメタタグを挿入します。Server Actions で利用した場合、303のHTTPリダイレクトレスポンスを呼び出し側に返します。それ以外の場合では、307のHTTPリダイレクトレスポンスを呼び出し側に返します。

リソースが存在しない場合、代わりに[`notFound`関数](/docs/app-router/api-reference/functions/not-found)を使用できます。

> **Good to know**:
>
> - Server Actions およびRoute Handlersでは、`try/catch`ブロックの後に`redirect`を呼び出すべきです。
> - 307(Temporary)のHTTPリダイレクトではなく、308(Permanent)のHTTPリダイレクトを返したい場合は、[`permanentRedirect`関数](/docs/app-router/api-reference/functions/permanentRedirect)を使用できます。

## Parameters

`redirect`関数は2つの引数を受け入れます：

```js
redirect(path, type)
```

| パラメータ | 型                                                                        | 説明                                                        |
| ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `path`     | `string`                                                                  | リダイレクト先のURL。相対パスまたは絶対パスが指定可能です。 |
| `type`     | `'replace'`（デフォルト）または `'push'`（Server Actions でのデフォルト） | 実行するリダイレクトのタイプ。                              |

<!-- textlint-disable -->

デフォルトでは、[Server Actions](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations)では`redirect` は `push`（ブラウザの履歴スタックに新たなエントリを追加する）を使用し、それ以外の場所では`replace`（ブラウザの履歴スタックの現在のURLを置き換える）を使用します。この振る舞いは `type` パラメータを指定することで上書きできます。

<!-- textlint-enable -->

`type`パラメータは、Server Components で使用した場合には効果がありません。

## Returns

`redirect`は値を返しません。

## 例

### Server Component

`redirect()`関数を呼び出すと`NEXT_REDIRECT`エラーがスローされ、スローされたRoute Segmentのレンダリングが終了します。

```jsx title="app/team/[id]/page.js"
import { redirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }

  // ...
}
```

> **Good to know**：`redirect`は TypeScript の[`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)型を使用しているため、`return redirect()`と書く必要はありません。

### Client Component

`redirect`は、 Server Actions を介して Client Component で使用できます。ユーザーをリダイレクトするためにイベントハンドラーを使用する必要がある場合は、[`useRouter`](/docs/app-router/api-reference/functions/use-router) hook を使用できます。

```tsx title="app/client-redirect.tsx"
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

```ts title="app/actions.ts"
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}
```

## FAQ

### なぜ `redirect` は 307 と 308 を使用するのか？

<!-- textlint-disable -->

`redirect()`を使用すると、一時的なリダイレクトには`307`、永続的なリダイレクトには`308`のステータスコードが使用されることに気づくかもしれません。伝統的に一時的なリダイレクトには`302`が使用され、永続的なリダイレクトには`301`が使用されてきましたが、`302`を使用すると多くのブラウザが元のリクエストメソッドに関係なく、リダイレクトのリクエストメソッドを`POST`から`GET`に変更します。

<!-- textlint-enable -->

`/users`から`/people`へのリダイレクトの例を考えてみましょう。新しいユーザーを作成するために`/users`へ`POST`リクエストを行うと、`302`の一時的なリダイレクトが返されるとします。この場合、リクエストメソッドは`POST`から`GET`リクエストに変更されます。これは理にかなっていません。なぜなら、新しいユーザーを作成するためには`/people`に`POST`リクエストを行うべきですし、`GET`リクエストを行うべきではありません。

`307`ステータスコードの導入により、リクエストメソッドは`POST`として保持されます。

- `302` - 一時的なリダイレクト、リクエストメソッドを`POST`から`GET`に変更します
- `307` - 一時的なリダイレクト、リクエストメソッドを`POST`のまま保持します

`redirect()`メソッドは`302`の維持的なリダイレクトではなく、デフォルトで`307`を使用します。そのため、リクエストは _常に_ `POST`リクエストとして保持されます。

HTTPリダイレクトの詳細は[こちら](https://developer.mozilla.org/docs/Web/HTTP/Redirections)を参照してください。

## バージョン履歴

| バージョン | 変更点           |
| ---------- | ---------------- |
| `v13.0.0`  | `redirect`の導入 |
