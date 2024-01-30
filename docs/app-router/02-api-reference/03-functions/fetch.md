---
title: fetch
description: 拡張フェッチ関数のAPIリファレンス
---

Next.js は、ネイティブの [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API) を拡張して、サーバー上の各リクエストに独自の永続キャッシュのセマンティクスを設定できるようにしました。

ブラウザでは、`cache` オプションはフェッチリクエストが _ブラウザの_ HTTP キャッシュとどのように相互作用するかを示します。この拡張機能では、`cache` は _サーバーサイド_ のフェッチリクエストがフレームワークの永続的な HTTP キャッシュとどのように相互作用するかを示します。

Server Components 内では、`async` や `await` を使って直接 `fetch` を呼び出すことができます。

```tsx title="app/page.tsx"
export default async function Page() {
  // このリクエストは手動で無効にされるまでキャッシュされるべきである。
  // `getStaticProps`.と似ている。
  // `force-cache` はデフォルトであり、省略可能である。
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // このリクエストはリクエスト毎にリフェッチされるべきである。
  // `getStaticProps`.と似ている。
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // このリクエストは10秒の有効期限でキャッシュされるべきである。
  // `getStaticProps` に `revalidate` オプションを付けたものと似ている。
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

## `fetch(url, options)`

Next.js は [Web `fetch()` API](https://developer.mozilla.org/docs/Web/API/Fetch_API) を拡張しているため、[利用可能なネイティブオプション](https://developer.mozilla.org/docs/Web/API/fetch#parameters)のどれでも使うことができます。

### `options.cache`

リクエストが Next.js [データキャッシュ](/docs/app-router/building-your-application/caching#data-cache)とどのようにやりとりするかを設定します。

```ts
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

- **`force-cache`** (default) - Next.js のデータキャッシュで一致するリクエストを探します。
  - 一致するものがあり、それが新しいものであればキャッシュから返されます。
  - 一致しない場合、または古い一致がある場合、Next.js はリモートサーバーからリソースを取得し、ダウンロードしたリソースでキャッシュを更新します。
- **`no-store`** - Next.js はリクエストごとに、キャッシュを見ずにリモートサーバーからリソースをフェッチし、ダウンロードしたリソースでもキャッシュを更新しません。

> **Good to know**:
>
> - `cache` オプションを指定しない場合、Next.js のデフォルトは `force-cache` になります。ただし、`cookies()` などの[動的関数](/docs/app-router/building-your-application/rendering/server-components#動的関数)が使用されている場合は、デフォルトは `no-store` になります。
> - `no-cache` オプションは、Next.js の `no-store` と同じ動作をします。

### `options.next.revalidate`

```ts
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

リソースのキャッシュ有効期間を設定します（秒単位）。

- **`false`** - リソースを無期限にキャッシュします。意味的には `revalidate: Infinity` と同じです。HTTP キャッシュは時間の経過とともに古いリソースを削除する可能性があります。
- **`0`** - リソースがキャッシュされないようにします。
- **`number`** - (秒単位） リソースのキャッシュのライフタイムが最大 `n` 秒であることを指定します。

> **Good to know**:
>
> - 個々の `fetch()` リクエストが、ルートの [`default revalidate`](/docs/app-router/api-reference/file-conventions/route-segment-config#revalidate) よりも低い `revalidate` 数を設定した場合、ルート全体の revalidate 間隔は短くなります。
> - 同じルート内の同じ URL の 2 つのフェッチリクエストで `revalidate` の値が異なる場合、小さい方の値が使われます。 -
> - 便宜上、`revalidate` に数値を設定した場合、`cache` オプションを設定する必要はありません。なぜなら、`0` は `cache: 'no-store'`を意味し、正の値は `cache: 'force-cache'`を意味するからです。
> - `{ revalidate: 0, cache: 'force-cache' }` や `{ revalidate: 10, cache: 'no-store' }` のような相反するオプションはエラーとなります。

### `options.next.tags`

```ts
fetch(`https://...`, { next: { tags: ['collection'] } })
```

リソースのキャッシュタグを設定します。その後、[revalidateTag](/docs/app-router/api-reference/functions/revalidateTag) を使用してオンデマンドでデータを再検証できます。カスタムタグの最大長は 256 文字です。

## Version History

| Version   | Changes                    |
| --------- | -------------------------- |
| `v13.0.0` | `fetch` が導入されました。 |
