---
title: cookies
description: Cookies関数のAPIリファレンス
related:
  title: 次のステップ
  description: 次に何をすべきかについては、以下のセクションを参照されたい
  links:
    - app-router/building-your-application/data-fetching/server-actions
---

`cookies` 関数を使用すると、[Server Components](/docs/app-router/building-your-application/rendering/server-components) から HTTP 受信リクエストの Cookies を読み取ったり、[Server Action](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations) や [Route Handler](/docs/app-router/building-your-application/routing/route-handlers) の送信リクエストに Cookies を書き込むことができます。

> **Good to know**: `cookies()` は[**動的関数**](/docs/app-router/building-your-application/rendering/server-components#動的関数)で、その返される値は事前に知ることができません。レイアウトやページでこの関数を使用すると、リクエスト時に[**動的レンダリング**](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)へのルートが選択されます。

## `cookies().get(name)`

cookie 名を受け取り、名前と値を持つオブジェクトを返すメソッドです。名前を持つ cookie が見つからない場合、`undefined` を返します。複数の cookie がマッチした場合、最初にマッチしたものだけを返します。

```jsx title="app/page.js"
import { cookies } from 'next/headers'

export default function Page() {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

## `cookies().getAll()`

`get` と似ていますが、名前が一致するすべての cookie のリストを返すメソッドです。`name` が指定されていない場合、利用可能なすべての cookie を返します。

```jsx title="app/page.js"
import { cookies } from 'next/headers'

export default function Page() {
  const cookieStore = cookies()
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>Name: {cookie.name}</p>
      <p>Value: {cookie.value}</p>
    </div>
  ))
}
```

## `cookies().has(name)`

cookie 名を受け取り、その cookie が存在するか(`true`)、しないか(`false`)に基づいて `boolean` 値を返すメソッドです。

```jsx title="app/page.js"
import { cookies } from 'next/headers'

export default function Page() {
  const cookiesList = cookies()
  const hasCookie = cookiesList.has('theme')
  return '...'
}
```

## `cookies().set(name, value, options)`

cookie の名前、値、オプションを受け取り、送信リクエストに cookie を設定するメソッドです。

> **Good to know**: HTTP ではストリーミング開始後に Cookie を設定できないため、[Server Action](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations) または [Route Handler](/docs/app-router/building-your-application/routing/route-handlers) で `.set()` を使用する必要があります。

```js title="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function create(data) {
  cookies().set('name', 'lee')
  // or
  cookies().set('name', 'lee', { secure: true })
  // or
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

## cookie を削除する

> **Good to know**: cookie を削除できるのは、[Server Action](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations) または [Route Handler](/docs/app-router/building-your-application/routing/route-handlers) だけです。

cookie を削除するにはいくつかのオプションがあります:

### `cookies().delete(name)`

指定した名前の cookie を明示的に削除することができます。

```js title="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  cookies().delete('name')
}
```

### `cookies().set(name, '')`

あるいは、同じ名前で空の値を持つ新しい cookie を設定することもできます。

```js title="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  cookies().set('name', '')
}
```

> **Good to know**: `.set()` は、[Server Action](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations) または [Route Handler](/docs/app-router/building-your-application/routing/route-handlers)でのみ使用できます。

### `cookies().set(name, value, { maxAge: 0 })`

`maxAge` を 0 に設定すると、cookie は直ちに失効します。

```js title="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  cookies().set('name', 'value', { maxAge: 0 })
}
```

### `cookies().set(name, value, { expires: timestamp })`

`expires` を過去の任意の値に設定すると、cookie は直ちに失効します。

```js title="app/actions.js"
'use server'

import { cookies } from 'next/headers'

async function delete(data) {
  const oneDay = 24 * 60 * 60 * 1000
  cookies().set('name', 'value', { expires: Date.now() - oneDay })
}
```

> **Good to know**: 削除できるのは、`.set()` が呼び出されたのと同じドメインに属する cookie だけです。さらに、削除したい cookie と同じプロトコル(HTTP または HTTPS)でコードを実行しなければなりません。

## バージョン履歴

| Version   | Changes                      |
| --------- | ---------------------------- |
| `v13.0.0` | `cookies` が導入されました。 |
