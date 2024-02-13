---
title: NextResponse
description: NextResponse の API リファレンス
---

<!--
The content of this doc is shared between the app and pages router. You can use the `<PagesOnly>Content</PagesOnly>` component to add content that is specific to the Pages Router. Any shared content should not be wrapped in a component. 
-->

NextResponse は [Web レスポンス API](https://developer.mozilla.org/docs/Web/API/Response) に便利なメソッドを追加して拡張しています。

---

## `cookies`

レスポンスの[`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)ヘッダーを取得、または変更します。

### `set(name, value)`

指定した名前を持つクッキーをレスポンスに設定します。

```ts
// /home へのリクエストが来た場合
let response = NextResponse.next()
// バナーを隠すためのクッキーをセットする
response.cookies.set('show-banner', 'false')
// レスポンスには`Set-Cookie:show-banner=false;path=/home` ヘッダーがセットされる
return response
```

### `get(name)`

クッキー名が与えられたら、そのクッキーの値を返します。クッキーが見つからない場合は、`undefined`が返されます。複数のクッキーが見つかった場合は、最初のものが返されます。

```ts
// /home へのリクエストが来た場合
let response = NextResponse.next()
// { name: 'show-banner', value: 'false', Path: '/home' }
response.cookies.get('show-banner')
```

### `getAll()`

クッキー名が与えられた場合、そのクッキーの値を返します。名前が与えられない場合は、レスポンスに含まれるすべてのクッキーを返します。

```ts
// /home へのリクエストが来た場合
let response = NextResponse.next()
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
response.cookies.getAll('experiments')
// または、レスポンスの全てのクッキーを取得する
response.cookies.getAll()
```

### `delete(name)`

クッキー名を指定し、そのクッキーをレスポンスから削除します。

```ts
// /home へのリクエストが来た場合
let response = NextResponse.next()
// 削除されたら true、削除されなかったら false を返す
response.cookies.delete('experiments')
```

## `json()`

指定されたJSONボディを持つレスポンスを生成します。

```ts title="app/api/route.ts"
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

## `redirect()`

[URL](https://developer.mozilla.org/docs/Web/API/URL) にリダイレクトするレスポンスを生成します。

```ts
import { NextResponse } from 'next/server'

return NextResponse.redirect(new URL('/new', request.url))
```

[URL](https://developer.mozilla.org/docs/Web/API/URL) は、`NextResponse.redirect()` メソッドで使用する前に作成または変更できます。例えば、`request.nextUrl` プロパティを使用して現在の URL を取得し、それを変更して別の URL にリダイレクトできます。

```ts
import { NextResponse } from 'next/server'

// リクエストが来たら...
const loginUrl = new URL('/login', request.url)
// /login に ?from=/incoming-url を追加する
loginUrl.searchParams.set('from', request.nextUrl.pathname)
// 新しいURLにリダイレクトする
return NextResponse.redirect(loginUrl)
```

## `rewrite()`

元のURLを保持したまま、指定された[URL](https://developer.mozilla.org/docs/Web/API/URL)を書き換える（プロキシする）レスポンスを生成します。

```ts
import { NextResponse } from 'next/server'

// /about へのリクエストは ブラウザでは /about を表示する
// リクエストを /proxy に書き換えるとブラウザでは /about を表示する
return NextResponse.rewrite(new URL('/proxy', request.url))
```

## `next()`

`next()`メソッドは Middleware として利用でき、早期リターンまたはルーティングを継続できます。

```ts
import { NextResponse } from 'next/server'

return NextResponse.next()
```

レスポンスを生成する際に`headers`をフォワードできます。

```ts
import { NextResponse } from 'next/server'

// リクエストが来たら...
const newHeaders = new Headers(request.headers)
// 新しいヘッダーを作り
newHeaders.set('x-version', '123')
// そのヘッダーでレスポンスを生成する
return NextResponse.next({
  request: {
    // New request headers
    headers: newHeaders,
  },
})
```
