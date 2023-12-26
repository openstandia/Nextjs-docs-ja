---
title: Dynamic Routes
description: Dynamic Routes can be used to programmatically generate route segments from dynamic data.
related:
  title: Next Steps
  description: For more information on what to do next, we recommend the following sections
  links:
    - app/building-your-application/routing/linking-and-navigating
    - app/api-reference/functions/generate-static-params
---

前もって正確な Segment 名がわからず、動的なデータからルートを作成したい場合、リクエスト時に入力される動的 Segment を使うか、ビルド時に[prerendered](#static-パラメーターの生成)を使うことができます。

## 規約

ダイナミック Segment はフォルダーの名前を角括弧で囲み作成できます。例えば、`[id]`や`[slug]`などです。

ダイナミック Segment は[`layout`](/docs/app-router/api-reference/file-conventions/layout)、[`page`](/docs/app-router/api-reference/file-conventions/page)、 [`route`](/docs/app-router/building-your-application/routing/route-handlers)、[`generateMetadata`](/docs/app-router/api-reference/functions/generate-metadata#generatemetadata-function)関数の `params` として渡されます。

## 例

例えば、ブログは次のようなルート `app/blog/[slug]/page.js` を含むことができます。

```tsx filename="app/blog/[slug]/page.js"
export default function Page({ params }) {
  return <div>My Post</div>
}
```

| Route                     | Example URL | `params`        |
| ------------------------- | ----------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a`   | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b`   | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c`   | `{ slug: 'c' }` |

Segment のパラメータを生成する方法については、[generateStaticParams()](#static-パラメーターの生成)のページを参照してください。

**Note:** ダイナミック Segment は `pages` ディレクトリの [Dynamic Routes](/docs/app-router/building-your-application/routing/dynamic-routes) と同じです。

## Static パラメーターの生成

`generateStaticParams`関数は[動的なルートセグメント](/docs/app-router/building-your-application/routing/dynamic-routes)と組み合わせて使うことで、リクエスト時にオンデマンドでルートを生成する代わりに、ビルド時に[**静的に生成**](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト)できます。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

`generateStaticParams` 関数の主な利点は、データをスマートに取得できることです。`generateStaticParams` 関数内で `fetch` リクエストを使用してコンテンツを取得する場合、リクエストは [自動的に重複排除されます](/docs/app-router/building-your-application/data-fetching#automatic-fetch-request-deduping)。これは、複数の `generateStaticParams`、レイアウト、ページにわたって同じ引数を持つ `fetch` リクエストが一度しか行われないことを意味します。

`pages`ディレクトリからマイグレーションする場合は、[migration guide](/docs/app-router/building-your-application/upgrading/app-router-migration#dynamic-paths-getstaticpaths) を参照してください。

より詳細な情報と高度な使用例については、[`generateStaticParams` サーバー関数ドキュメント](/docs/app-router/api-reference/functions/generate-static-params) を参照してください。

## キャッチオール Segment

ダイナミック Segment は、`[...フォルダ名]`という括弧の中に省略記号を追加することで、後続の**すべての**Segment をキャッチするように拡張できます。

<!-- textlint-disable -->

例えば`app/shop/[...slug]/page.js` は `/shop/clothes` にマッチしますが、 `/shop/clothes/tops` や `/shop/clothes/tops/t-shirts` などにもマッチします。

<!-- textlint-enable -->

| Route                        | Example URL   | `params`                    |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[...slug]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## オプションのキャッチオール Segment

キャッチオールセグメンテーションは、`[[...フォルダ名]]`という二重の角括弧の中にパラメータを含めることで、**オプション**にできます。

<!-- textlint-disable -->

例えば`app/shop/[[...スラッグ]]/page.js`は、`/shop/clothes`、`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`に加えて、`/shop`にもマッチします。

<!-- textlint-enable -->

**catch-all**Segment と**optional catch-all**Segment の違いは、optional の場合はパラメータのないルートもマッチする (上の例では `/shop`) ことです。

| Route                          | Example URL   | `params`                    |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop`       | `{}`                        |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## TypeScript

TypeScript を使用する場合、設定したルート Segment に応じて `params` の型を追加できます。

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>My Page</h1>
}
```

| Route                               | `params` Type Definition                 |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`           | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`        | `{ slug: string[] }`                     |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

> **Note**: これは将来的には[TypeScript プラグイン](/docs/app-router/building-your-application/configuring/typescript#typescript-plugin)によって自動的に行われるようになるかもしれない。
