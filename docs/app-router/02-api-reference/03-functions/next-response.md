---
title: NextRequest
description: NextRequest の API リファレンス
---

<!--
The content of this doc is shared between the app and pages router. You can use the `<PagesOnly>Content</PagesOnly>` component to add content that is specific to the Pages Router. Any shared content should not be wrapped in a component.
-->

NextRequest は [Web Request API](https://developer.mozilla.org/docs/Web/API/Request) に便利なメソッドを追加して拡張しています。

---

## `cookies`

リクエストの[`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)ヘッダーを取得または、変更します。

### `set(name, value)`

名前を指定し、リクエストに与えられた値のクッキーを設定します。

```ts
// /home へのリクエスト
// バナーを隠すためのクッキーをセットする
// リクエストのヘッダーに`Set-Cookie:show-banner=false;path=/home`をセットする
request.cookies.set('show-banner', 'false')
```

### `get(name)`

クッキーの名前が指定されると、そのクッキーの値が返されます。クッキーが見つからない場合は、`undefined`が返されます。複数のクッキーが見つかった場合は、最初のものが返されます。

```ts
// /home へのリクエスト
// { name: 'show-banner', value: 'false', Path: '/home' }
request.cookies.get('show-banner')
```

### `getAll()`

クッキーの名前が指定されている場合、そのクッキーの値を返します。名前が指定されていない場合、リクエストに関連するすべてのクッキーを返します。

```ts
// /homeへの入力リクエスト
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
request.cookies.getAll('experiments')
// または、リクエストに関連するすべてのクッキーを取得する
request.cookies.getAll()
```

### `delete(name)`

クッキーの名前が指定された場合、そのクッキーをリクエストから削除します。

```ts
// 削除された場合は true を戻し、何も削除されなかった場合は false を戻します
request.cookies.delete('experiments')
```

### `has(name)`

クッキーの名前が指定された場合、そのクッキーがリクエスト上に存在する場合は`true`を返します。

```ts
// クッキーが存在する場合は true を戻し、存在しない場合は false を戻します
request.cookies.has('experiments')
```

### `clear()`

リクエストから`Set-Cookie`ヘッダーを削除します。

```ts
request.cookies.clear()
```

## `nextUrl`

ネイティブの [`URL`](https://developer.mozilla.org/docs/Web/API/URL) API を拡張し、Next.js 固有のプロパティを含む便利なメソッドを追加しています。

```ts
// /home へのリクエストがあった場合、pathname は /home
request.nextUrl.pathname
// /home?name=lee へのリクエストがあった場合、searchParams は { 'name': 'lee' }
request.nextUrl.searchParams
```

以下のオプションが利用可能です：

| プロパティ     | 型                      | 説明                                                                                                                 |
| -------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `basePath`     | `string`                | URL の[ベースパス](/docs/app-router/api-reference/next-config-js/basePath)                                           |
| `buildId`      | `string` \| `undefined` | Next.jsアプリケーションのビルド識別子。[カスタマイズ](/docs/app-router/api-reference/next-config-js/generateBuildId) |
| `pathname`     | `string`                | URL のパス名                                                                                                         |
| `searchParams` | `Object`                | URL の検索パラメータ                                                                                                 |

> **注意：** Pages Router の国際化プロパティは、App Routerでは使用できません。詳しくは[App Routerによる国際化](/docs/app-router/building-your-application/routing/internationalization)を参照してください。

## `ip`

`ip` プロパティはリクエストのIPアドレスを含む文字列です。この値はオプションで、あなたのホスティングプラットフォームによって提供されることもあります。

> **Good to know：** [Vercel](https://vercel.com/docs/frameworks/nextjs)では、この値がデフォルトで提供されます。他のプラットフォームでは、[`X-Forwarded-For`](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For) ヘッダーで IP アドレスを指定します。

```ts
// Vercel では提供されます
request.ip
// セルフホスティング
request.headers.get('X-Forwarded-For')
```

## `geo`

`geo` プロパティはリクエストの地理情報を含むオブジェクトです。この値はオプションで、あなたのホスティングプラットフォームによって提供されることもあります。

> **Good to know：** [Vercel](https://vercel.com/docs/frameworks/nextjs)では、この値がデフォルトで提供されます。他のプラットフォームでは、 [`X-Forwarded-For`](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For) ヘッダーで IP アドレスを指定し、[サードパーティのサービス](https://ip-api.com/) を使用して地理情報を取得します。

```ts
// Vercel によって提供されます
request.geo.city
request.geo.country
request.geo.region
request.geo.latitude
request.geo.longitude

// セルフホスティング
function getGeo(request) {
  let ip = request.headers.get('X-Forwarded-For')
  // サードパーティのサービスを使用して地理情報を取得する
}
```
