---
title: route.js
description: API reference for the route.js special file.
sidebar_position: 7
---

ルートハンドラを使用すると、Web リクエスト API とレスポンス API を使用して、指定したルートに対するカスタムリクエストハンドラを作成できます。

## HTTP メソッド

**ルート**ファイルによって、与えられたルートに対してカスタム・リクエストハンドラを作成できます。次の[HTTP メソッド](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)がサポートされています：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`、`OPTIONS`

```ts title="route.ts"
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// `OPTIONS` が定義されていない場合、Next.jsは自動的に`OPTIONS`を実装し、ルートハンドラで定義されている他のメソッドに応じて適切なレスポンス`Allow`ヘッダーを設定します。
export async function OPTIONS(request: Request) {}
```

> **Good to know**: ルートハンドラは`app`ディレクトリ内でのみ利用可能です。API Routes（`pages`）とルートハンドラ（`app`）を一緒に使用する必要はありません。ルートハンドラがすべてのユースケースを処理できるはずだからです。

## parameters

### `request` （任意）

リクエストオブジェクトは[NextRequest](/docs/app-router/api-reference/functions/next-request)オブジェクトで、Web [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) API を拡張したものです。`NextRequest`は、`cookies`や拡張され解析された URL オブジェクト`nextUrl`に簡単にアクセスできるなど、送られてくるリクエストをさらにコントロールできるようにします。

### `context` （任意）

```js title="app/dashboard/[team]/route.js"
export async function GET(request, context: { params }) {
  const team = params.team // '1'
}
```

現在のところ、`context`の唯一の値は`params`で、これは現在のルートの[動的なルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes)を含むオブジェクトです。

| 例                               | URL            | `params`                  |
| :------------------------------- | :------------- | :------------------------ |
| `app/dashboard/[team]/route.js`  | `/dashboard/1` | `{ team: '1' }`           |
| `app/shop/[tag]/[item]/route.js` | `/shop/1/2`    | `{ tag: '1', item: '2' }` |
| `app/blog/[...slug]/route.js`    | `/blog/1/2`    | `{ slug: ['1', '2'] }`    |

## NextResponse

ルートハンドラは`NextResponse`オブジェクトを返すことで Web レスポンス API を拡張できます。これにより cookies、headers、redirect、rewrite を簡単に設定できるようになります。[API リファレンスを見る](/docs/app-router/api-reference/functions/next-response)。

## Version 履歴

| Version   | Changes            |
| --------- | ------------------ |
| `v13.2.0` | ルートハンドラ導入 |
