---
title: generateStaticParams
description: generateStaticParams 関数の API リファレンスです。
---

`generateStaticParams` 関数を[動的なルートセグメント](/docs/app-router/building-your-application/routing/dynamic-routes)と組み合わせて使うことで、
リクエスト時にオンデマンドでルートを生成するのではなく、ビルド時に [**静的にルートを生成する**](/docs/app-router/building-your-application/rendering/server-components#静的レンダリングデフォルト) ことができます。

```jsx title="app/blog/[slug]/page.js"
// [slug] のダイナミックセグメントに入力する `params` のリストを返す
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// `generateStaticParams` によって返される `params` を使用して、このページの複数のバージョンが静的に生成されます
export default function Page({ params }) {
  const { slug } = params
  // ...
}
```

> **Good to know**
>
> - [`dynamicParams`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamicparams) segment config オプションを使用すると、`generateStaticParams` で生成されなかったダイナミックセグメントにアクセスしたときの動作を制御できます。
> - `next dev` ではルートに移動したときに `generateStaticParams` が呼び出されます。
> - `next build` では対応するレイアウトやページが生成される前に `generateStaticParams` が実行されます。
> - 再検証(ISR)の間、`generateStaticParams` は再び呼び出されることはありません。
> - `generateStaticParams` は、Pages Router の [`getStaticPaths`](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths) 関数を置き換えます。

## Parameters

`options.params` (任意)

ルート内の複数の動的セグメントが `generateStaticParams` を使用する場合、子の `generateStaticParams` 関数は、
親が生成する各 `params` のセットに対して 1 回ずつ実行されます。

`params` オブジェクトには、[子セグメントで `params` を生成する](#ルート内の複数のダイナミックセグメント)ために使われる親の `generateStaticParams` で設定されたパラメータが含まれます。

## Returns

`generateStaticParams` はオブジェクトの配列を返す必要があり、各オブジェクトは 1 つのルートの入力された動的なセグメントを表します。

- オブジェクトの各プロパティは、ルートに対して入力される動的セグメントです。
- プロパティの名前はセグメントの名前で、プロパティの値はそのセグメントを埋める値です。

| ルートの例                       | `generateStaticParams` の戻り値の型       |
| -------------------------------- | ----------------------------------------- |
| `/product/[id]`                  | `{ id: string }[]`                        |
| `/products/[category]/[product]` | `{ category: string, product: string }[]` |
| `/products/[...slug]`            | `{ slug: string[] }[]`                    |

## 単一のダイナミックセグメント

```tsx title="app/product/[id]/page.tsx"
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

// `generateStaticParams` が返す `params` を使って、このページの3つのバージョンが静的に生成されます
// - /product/1
// - /product/2
// - /product/3
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  // ...
}
```

## 複数のダイナミックセグメント

```tsx title="app/products/[category]/[product]/page.tsx"
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// `generateStaticParams` が返す `params` を使って、このページの3つのバージョンが静的に生成されます
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default function Page({
  params,
}: {
  params: { category: string; product: string }
}) {
  const { category, product } = params
  // ...
}
```

## その他のダイナミックセグメント

```tsx title="app/product/[...slug]/page.tsx"
export function generateStaticParams() {
  return [{ slug: ['a', '1'] }, { slug: ['b', '2'] }, { slug: ['c', '3'] }]
}

// `generateStaticParams` が返す `params` を使って、このページの3つのバージョンが静的に生成されます
// - /product/a/1
// - /product/b/2
// - /product/c/3
export default function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params
  // ...
}
```

## 例

### ルート内の複数のダイナミックセグメント

You can generate params for dynamic segments above the current layout or page, but **not below**. For example, given the `app/products/[category]/[product]` route:

現在のレイアウトやページよりも上位の動的セグメントに対して params を生成することはできますが、下位の動的セグメントに対して params を生成することは**できません**。
たとえば、`app/products/[category]/[product]` ルートを考えます:

- `app/products/[category]/[product]/page.js` は、`[category]` と `[product]` の両方のパラメータを生成できます。
- `app/products/[category]/layout.js` は、`[category]` のパラメータ **のみ** を生成できます。

複数のダイナミックセグメントを持つルートのパラメータを生成するには、2 つのアプローチがあります:

### ボトムアップでパラメータを生成する

子ルートセグメントから複数のダイナミックセグメントを生成します。

```tsx title="app/products/[category]/[product]/page.tsx"
// [category] と [product] の両方のセグメントを生成します
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
    product: product.id,
  }))
}

export default function Page({
  params,
}: {
  params: { category: string; product: string }
}) {
  // ...
}
```

### トップダウンでパラメータを生成する

まず親セグメントを生成し、その結果を使用して子セグメントを生成します。

```tsx title="app/products/[category]/layout.tsx"
// [category] のセグメントを生成します
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
  }))
}

export default function Layout({ params }: { params: { category: string } }) {
  // ...
}
```

子ルートセグメントの `generateStaticParams` 関数は、親の `generateStaticParams` が生成するセグメントごとに 1 回ずつ実行されます。

子ルートの `generateStaticParams` 関数は、親ルートの `generateStaticParams` 関数から返されたパラメータを使用して、動的にセグメントを生成することができます。

```tsx title="app/products/[category]/[product]/page.tsx"
// 親セグメントの `generateStaticParams` 関数から渡された `params` を使用して、[product] 用のセグメントを生成します
export async function generateStaticParams({
  params: { category },
}: {
  params: { category: string }
}) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json())

  return products.map((product) => ({
    product: product.id,
  }))
}

export default function Page({
  params,
}: {
  params: { category: string; product: string }
}) {
  // ...
}
```

> **Good to know**: `fetch` リクエストは、すべての `generate`-prefixed 関数、レイアウト、ページ、および Server Components にわたって、同じデータに対して自動的に[メモ化](/docs/app-router/building-your-application/caching#リクエストのメモ化)されます。`fetch` が利用できない場合は、[Reactキャッシュ](/docs/app-router/building-your-application/caching#リクエストのメモ化)を使用できます。

### params のサブセットのみを生成する

生成したい動的なセグメントだけを含むオブジェクトの配列を返すことで、ルートのパラメータのサブセットを生成できます。
それから、[`dynamicParams`](/docs/app-router/api-reference/file-conventions/route-segment-config#dynamicparams) セグメント設定オプションを使うことで、
`generateStaticParams` で生成されなかった動的なセグメントにアクセスしたときの動作を制御できます。

```jsx title="app/blog/[slug]/page.js"
// トップ10 以外の投稿はすべて 404 になります
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  const topPosts = posts.slice(0, 10)

  return topPosts.map((post) => ({
    slug: post.slug,
  }))
}
```

## バージョン履歴

| Version   | Changes                                   |
| --------- | ----------------------------------------- |
| `v13.0.0` | `generateStaticParams` が導入されました。 |
