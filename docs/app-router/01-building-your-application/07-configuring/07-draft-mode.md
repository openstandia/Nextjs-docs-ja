---
title: Draft Mode
description: Next.js has draft mode to toggle between static and dynamic pages. You can learn how it works with App Router here.
---

`Static rendering` は、ページがヘッドレス CMS からデータを取得する場合に便利です。ただし、ヘッドレス CMS 上でドラフトを書いて、すぐにそのドラフトをページで確認したい場合には理想的ではありません。こうした場合、Next.js にこれらのページをビルド時ではなく **リクエスト時** にレンダリングさせ、公開コンテンツではなくドラフトコンテンツを取得したいと思うでしょう。この特定のケースに対して、Next.js は [ダイナミックレンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング) に切り替えることが望ましいです。

Next.js には、この問題を解決するための **Draft Mode** という機能があります。以下はその使用方法の手順です。

## ステップ 1: ルートハンドラの作成とアクセス

まず、[ルートハンドラ](/docs/app-router/building-your-application/routing/route-handlers) を作成します。これには任意の名前を付けることができます。例えば `app/api/draft/route.ts` などです。

次に、`next/headers` から `draftMode` をインポートし、`enable()` メソッドを呼び出します。

```ts title="app/api/draft/route.ts" switcher
// ドラフトモードを有効にするルートハンドラ
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  draftMode().enable()
  return new Response('Draft mode is enabled')
}
```

これにより、**クッキー** が設定され、このクッキーを含む後続のリクエストは **Draft Mode** をトリガーし、静的生成されたページの動作が変更されるようになります（後述します）。

これを手動でテストするには、`/api/draft` にアクセスし、ブラウザの開発者ツールを見てください。`Set-Cookie` レスポンスヘッダーに `__prerender_bypass` という名前のクッキーがあることに注意してください。

### ヘッドレス CMS からの安全なアクセス

実際の運用では、ヘッドレス CMS からこのルートハンドラを**安全に**呼び出したいと思うでしょう。具体的な手順は使用しているヘッドレス CMS によって異なりますが、一般的な手順をいくつか紹介します。

これらの手順は、使用しているヘッドレス CMS が **カスタムドラフト URL** の設定をサポートしていることを前提としています。もしそうでない場合でも、この方法を使用してドラフト URL をセキュアにすることはできますが、ドラフト URL を手動で構築してアクセスする必要があります。

**まず最初に**、お好きなトークンジェネレータを使用して**シークレットトークン文字列**を作成します。この秘密は、Next.js アプリとヘッドレス CMS の間でのみ知られるものです。この秘密は、CMS へのアクセス権を持たない人々がドラフト URL にアクセスするのを防ぎます。

**次に**、ヘッドレス CMS がカスタムドラフト URL を設定できる場合は、次のようにドラフト URL を指定します。ここでは、ルートハンドラが `app/api/draft/route.ts` にあると仮定しています。

```bash title="Terminal"
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

- `<your-site>` はデプロイドメインに置き換えてください。
- `<token>` は生成した秘密トークンで置き換えてください。
- `<path>` は表示したいページのパスです。例えば `/posts/foo` を表示したい場合、`&slug=/posts/foo` を使用する必要があります。

ヘッドレス CMS によっては、`<path>` を CMS のデータに基づいて動的に設定できるようにするための変数をドラフト URL に含めることができるかもしれません。例えば `&slug=/posts/{entry.fields.slug}` のようになります。

**最後に**、ルートハンドラ内で以下の作業を行います：

- シークレットが一致し、`slug` パラメータが存在するかどうかを確認します（存在しない場合、リクエストは失敗すべきです）。
- `draftMode.enable()` を呼び出してクッキーを設定します。
- 次に、ブラウザを `slug` で指定されたパスにリダイレクトします。

```ts title="app/api/draft/route.ts" switcher
// シークレットとスラッグを持つルートハンドラ
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  // クエリ文字列パラメータを解析
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // シークレットと次のパラメータを確認します
  // このシークレットはこのルートハンドラと CMS のみが知っているべきです
  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // 提供された `slug` が存在するかどうかを確認するためにヘッドレス CMS にアクセスします
  // getPostBySlug は必要なフェッチロジックをヘッドレス CMS に実装することができるでしょう
  const post = await getPostBySlug(slug)

  // スラッグが存在しない場合、ドラフトモードが有効にならないようにします
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  // クッキーを設定して Draft Mode を有効にします
  draftMode().enable()

  // 取得した投稿のパスにリダイレクトします
  // searchParams.slug にリダイレクトしないように注意してください。それはオープンリダイレクトの脆弱性につながる可能性があります
  redirect(post.slug)
}
```

これが成功すると、ブラウザはドラフトモードクッキーを使用して表示したいパスにリダイレクトされるはずです。

## ステップ 2: ページの更新

次のステップは、ページを更新して `draftMode().isEnabled` の値を確認することです。

クッキーが設定されたページをリクエストすると、データは**リクエスト時**に取得されます（ビルド時ではなく）。

さらに、`isEnabled` の値は `true` になります。

```tsx title="app/page.tsx" switcher
// データを取得するページ
import { draftMode } from 'next/headers'

async function getData() {
  const { isEnabled } = draftMode()

  const url = isEnabled
    ? 'https://draft.example.com'
    : 'https://production.example.com'

  const res = await fetch(url)

  return res.json()
}

export default async function Page() {
  const { title, desc } = await getData()

  return (
    <main>
      <h1>{title}</h1>
      <p>{desc}</p>
    </main>
  )
}
```

以上で完了です。ヘッドレス CMS からドラフトルートハンドラ（`secret` と `slug` を含む）にアクセスするか、手動でアクセスすることで、ドラフトコンテンツを確認できるようになるはずです。ドラフトを更新して公開せずに残す場合、ドラフトを確認できるはずです。

ヘッドレス CMS にこのドラフト URL を設定するか、手動でアクセスして、ドラフトを確認できるはずです。

```bash title="Terminal"
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

## 詳細

### Draft Mode クッキーの消去

デフォルトでは、Draft Mode セッションはブラウザを閉じると終了します。

Draft Mode クッキーを手動で消去するには、`draftMode().disable()` を呼び出すルートハンドラを作成します：

```ts title="app/api/disable-draft/route.ts" switcher
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  draftMode().disable()
  return new Response('Draft mode is disabled')
}
```

その後、`/api/disable-draft` にリクエストを送信してルートハンドラを呼び出します。[`next/link`](/docs/app-router/api-reference/components/link) を使用してこのルートを呼び出す場合、クッキーを誤って削除しないように `prefetch={false}` を渡す必要があります。

### `next build` ごとに固有の値

`next build` を実行するたびに新しいバイパスクッキー値が生成されます。

これにより、バイパスクッキーを推測することはできなくなります。

> **Good to know**: HTTP 上で Draft Mode をローカルでテストするには、ブラウザでサードパーティのクッキーとローカルストレージへのアクセスを許可する必要があります。
