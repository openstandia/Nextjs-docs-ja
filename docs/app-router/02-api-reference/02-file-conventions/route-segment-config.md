---
title: Route Segment Config
description: Learn about how to configure options for Next.js route segments.
sidebar_position: 8
---

Route Segment オプションは、以下の変数を直接エクスポートすることで、[ページ](/docs/app-router/building-your-application/routing/pages-and-layouts)、[レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts)、または [ルートハンドラ](/docs/app-router/building-your-application/routing/route-handlers) の動作を設定できます。

| オプション                            | タイプ                                                                                                                                                       | デフォルト                     |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------- |
| [`dynamic`](#dynamic)                 | <code>'auto' &#124; 'force-dynamic' &#124; 'error' &#124; 'force-static'</code>                                                                              | `'auto'`                       |
| [`dynamicParams`](#dynamicparams)     | `boolean`                                                                                                                                                    | `true`                         |
| [`revalidate`](#revalidate)           | <code>false &#124; 'force-cache' &#124; 0 &#124; number</code>                                                                                               | `false`                        |
| [`fetchCache`](#fetchcache)           | <code>'auto' &#124; 'default-cache' &#124; 'only-cache' &#124; 'force-cache' &#124; 'force-no-store' &#124; 'default-no-store' &#124; 'only-no-store'</code> | `'auto'`                       |
| [`runtime`](#runtime)                 | <code>'nodejs' &#124; 'edge'</code>                                                                                                                          | `'nodejs'`                     |
| [`preferredRegion`](#preferredregion) | <code>'auto' &#124; 'global' &#124; 'home' &#124; string &#124; string[]</code>                                                                              | `'auto'`                       |
| [`maxDuration`](#maxduration)         | `number`                                                                                                                                                     | デプロイプラットフォームによる |

```tsx title="layout.tsx / page.tsx / route.ts"
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

export default function MyComponent() {}
```

> **Good to know**：
>
> - 現在、設定オプションの値は静的に解析可能である必要があります。たとえば、`revalidate = 600`は有効ですが、`revalidate = 60 * 10`は無効です。

## Options

### `dynamic`

レイアウトやページの動的な動作を、完全に静的または動的な動作に変更します。

```tsx title="layout.tsx / page.tsx / route.ts"
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

> **Good to know**: `app`ディレクトリは、`pages`ディレクトリのページレベルでの`getServerSideProps`と`getStaticProps`の全てか無かの二項対立モデルよりも、フェッチリクエストレベルでのきめ細かいキャッシュ制御を優先します。`dynamic`オプションは便宜上`pages`ディレクトリのモデルに戻る方法であり、よりシンプルな移行手段を提供します。

- **`auto`**（デフォルト）：デフォルトのオプションでは、コンポーネントの動的な動作を妨げることなく、可能な限りキャッシュします
- **`force-dynamic`**： `fetch`リクエストのキャッシュをすべて無効にし、常に再検証することで、レイアウトやページの動的レンダリングとキャッシュなしのデータフェッチを強制します。このオプションは以下と同じです
  - `pages`ディレクトリにおける`getServerSideProps()`
  - レイアウトまたはページ内のすべての`fetch()`リクエストのオプションを`{ cache: 'no-store', next：{ revalidate: 0 } }`にする
  - Segment 設定を`export const fetchCache = 'force-no-store'`にする
- **`error`**：静的レンダリングを強制し、[動的関数](/docs/app-router/building-your-application/rendering/server-components#server-rendering-strategies#dynamic-functions)やキャッシュされていないデータを使用しているコンポーネントがある場合、エラーを発生させてレイアウトやページのデータをキャッシュします。このオプションは以下と同じです
  - `pages`ディレクトリにおける`getStaticProps()`
  - レイアウトまたはページ内のすべての`fetch()`リクエストのオプションを`{ cache: 'force-cache' }`にする
  - Segment 設定を`fetchCache = 'only-cache', dynamicParams = false`にする
  - `dynamic = 'error'`は`dynamicParams`のデフォルトを`true`から`false`に変更します。`generateStaticParams`で生成されなかった動的パラメータは、手動で`dynamicParams = true`を設定することで、動的にページをレンダリングするように戻すことができます
    <!-- textlint-disable -->
    <!-- TODO: Fix links -->
- **`force-static`**： [`cookies()`](/docs/app-router/api-reference/functions/cookies)、[`headers()`](/docs/app-router/api-reference/functions/headers)、[`useSearchParams()`](/docs/app-router/api-reference/functions/use-search-params)が空の値を返すように強制することで、静的レンダリングを強制し、レイアウトやページのデータをキャッシュします
<!-- textlint-enable -->

> **Good to know**:

<!-- TODO: Fix links -->

> - `getServerSideProps`と`getStaticProps`から`dynamic: 'force-dynamic'`と`dynamic: 'error'`への[移行方法](/docs/app-router/building-your-application/upgrading/app-router-migration#step-6-migrating-data-fetching-methods)は[アップグレードガイド](/docs/app-router/building-your-application/upgrading/app-router-migration#step-6-migrating-data-fetching-methods)に記載されています。

### `dynamicParams`

<!-- TODO: Fix links -->

[`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params)で生成されなかった動的な Segment にアクセスしたときの動作を制御します。

```tsx title="layout.tsx / page.tsx"
export const dynamicParams = true // true | false,
```

- `true`（デフォルト）：`generateStaticParams`に含まれない動的な Segment がオンデマンドで生成されます
- `false`：`generateStaticParams`に含まれていない動的 Segment は`404`を返します

> **Good to know**:
>
> - このオプションは、`pages`ディレクトリの`getStaticPaths`の`fallback: true | false | blocking`オプションを置き換えます
> - `dynamicParams = true`の場合、Segment は[ストリーミング・サーバーレンダリング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#サスペンスによるストリーミング)を使用します
> - `dynamic = 'error'`と`dynamic = 'force-static'`を使用すると、`dynamicParams`のデフォルトが`false`に変更されます

### `revalidate`

レイアウトまたはページのデフォルトの再検証時間を設定します。このオプションは、個々の`fetch`リクエストによって設定された`revalidate`値は上書きしません。

```tsx title="layout.tsx / page.tsx/ route.ts"
export const revalidate = false
// false | 'force-cache' | 0 | number
```

<!-- textlint-disable -->

- `false`: （デフォルト）キャッシュオプションを`'force-cache'`に設定した`fetch`リクエスト、あるいは[動的関数](/docs/app-router/building-your-application/rendering/server-components#サーバーレンダリングストラテジー)が使われる前に発見された`fetch`リクエストをキャッシュするためのデフォルトのヒューリスティック。意味的には`revalidate: Infinity`と同じで、リソースを無期限にキャッシュすることを意味します。個々の`fetch`リクエストで `cache: 'no-store'`または`revalidate: 0`を使用してキャッシュを回避し、ルートを動的にレンダリングできます。あるいは`revalidate`をルートのデフォルトより低い正の数値に設定することで、ルートの再検証頻度を増やすことができます。
  <!-- textlint-enable -->
  <!-- textlint-disable -->
- `0`: 動的関数やキャッシュされていないデータフェッチが検出されなくても、レイアウトやページが常に[動的にレンダリング](/docs/app-router/building-your-application/rendering/server-components#動的レンダリング)されます。このオプションは、キャッシュオプションを設定しない`fetch`リクエストのデフォルトを`'no-store'`に変更しますが、`'force-cache'`を選ぶか、正の`revalidate`を使う`fetch`リクエストはそのままにします。
<!-- textlint-enable -->
- `number`:（秒単位）レイアウトまたはページのデフォルトの再検証頻度を`n`秒に設定します。

> **Good to know**:
>
> - `revalidate`オプションは、[Node.js ランタイム](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes#nodejs-runtime)を使用している場合にのみ使用できます。つまり、`runtime = 'edge'`で`revalidate`オプションを使用しても動作しません。

#### 再検証の頻度

- 1 つのルートの各レイアウトとページでもっとも低い`revalidate`値が、ルート*全体*の再検証頻度になります。これは子ページが親レイアウトと同じ頻度で再検証されることを保証します。
- 個々の`fetch`リクエストは、ルート全体の再バリデーション頻度を上げるために、ルートのデフォルトの`revalidate`よりも低い値を設定できます。これにより、いくつかの基準に基づいて、特定のルートに対してより頻繁な再検証を動的にオプトインできます。

### `fetchCache`

<!-- ドキュメント上ではCollapsibleだが中身が単純な文章ではないため、以下の形式に書き換えています -->

:::caution
**これは上級用のオプションです。デフォルトの振る舞いを明示的に上書きしたい場合にのみ使用してください。**
:::

デフォルトでは、Next.js は[動的関数](/docs/app-router/building-your-application/rendering/server-components#サーバーレンダリングストラテジー)が使用される**前**に到達可能なすべての`fetch()`リクエストを**キャッシュし**、動的関数が使用された**後**に発見された`fetch`リクエストは**キャッシュしません**。

`fetchCache`を使用すると、レイアウトまたはページ内のすべての`fetch`リクエストのデフォルト`cache`オプションを上書きできます。

```tsx title="layout.tsx / page.tsx / route.ts"
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

- `'auto'`：（デフォルト）動的関数の前に、その関数が提供するキャッシュオプションで`fetch`リクエストをキャッシュし、動的関数の後の`fetch`リクエストはキャッシュしないデフォルトのオプションです
- `'default-cache'`：どのような`cache`オプションでも`fetch`へ渡せるようにしますが、オプションが提供されない場合は、`cache`オプションを`'force-cache'`に設定します。これは、動的関数の後の`fetch`リクエストも静的とみなすことを意味します
- `'only-cache'`：オプションがない場合はデフォルトを`cache: 'force-cache'`に変更し、`cache: 'no-store'`の`fetch`リクエストがあった場合はエラーにします
- `'force-cache'`：すべての`fetch`リクエストの`cache`オプションを`'force-cache'`に設定することで、すべての`fetch`リクエストがキャッシュを利用するようにします
- `'default-no-store'`：どのような`cacehe`オプションでも`fetch`へ渡せるようにしますが、オプションが与えられない場合は`cache`オプションを`'no-store'`にします。これは、動的関数の前の`fetch`リクエストも動的とみなすことを意味します
- `'only-no-store'`：オプションがない場合はデフォルトを`cache: 'no-store'`に変更し、`cache: 'force-cache'`の`fetch`リクエストがあった場合はエラーにします
- `'force-no-store'`：すべての`fetch`リクエストの`cache`オプションを`'no-store'`に設定し、すべての`fetch`リクエストがキャッシュを使わないようにします。これにより、すべての`fetch`リクエストは、たとえ`'force-cache'`オプションが指定されていても、リクエスト毎に再フェッチされます

#### ルートをまたぐ Segment の挙動

- 1 つのルートの各レイアウトとページに設定されたオプションは、互いに互換性を持つ必要があります
  - `only-cache`と`force-cache`の両方が指定された場合は、`force-cache`が優先されます。`'only-no-store'`と`'force-no-store'`の両方が指定された場合は、`'force-no-store'`が優先されます。force オプションはルート全体の動作を変更するので、`'force-*'`を指定した単一の Segment は、`'only-*'`によるエラーを防ぐことができます
  - `'only-*'`と`'force-*'`オプションの意図は、ルート全体が完全に静的か、完全に動的であることを保証することです。つまり：
    - 1 つのルートで`'only-cache'`と`'only-no-store'`を組み合わせることはできません
    - 1 つのルートで`'force-cache'`と`'force-no-store`'を組み合わせることはできません
  - 子で`auto`または`*-cache`が設定されている場合、同じ fetch が異なる振る舞いを持つため、親は`default-no-store`を使用できません
- 一般的には、共有の親レイアウトは`'auto'`のままにしておき、子 Segment が分岐する部分のオプションをカスタマイズすることを推奨します

### `runtime`

```tsx title="layout.tsx / page.tsx / route.ts"
export const runtime = 'nodejs'
// 'edge' | 'nodejs'
```

- `nodejs`（デフォルト）
- `edge`

Edge および Node.js ランタイムの詳細については、[こちら](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes)を参照してください。

### `preferredRegion`

```tsx title="layout.tsx / page.tsx / route.ts"
export const preferredRegion = 'auto'
// 'auto' | 'global' | 'home' | ['iad1', 'sfo1']
```

`preferredRegion`のサポートおよびサポートされるリージョンは、使用しているデプロイメント・プラットフォームに依存します。

> **Good to know**:
>
> - `preferredRegion`が指定されない場合、もっとも近い親レイアウトのオプションを継承します
> - ルートレイアウトのデフォルトは`all`リージョンです

### `maxDuration`

デプロイメント・プラットフォームによっては、関数のデフォルト実行時間を長く設定できる場合があります。この設定により、プランの制限内でより長い実行時間を選択できます。**注**: この設定には、Next.js `13.4.10`以降が必要です。

```tsx title="layout.tsx / page.tsx / route.ts"
export const maxDuration = 5
```

> **Good to know**:
>
> - `maxDuration`が指定されていない場合、デフォルト値はデプロイメント・プラットフォームとプランに依存します。

### `generateStaticParams`

<!-- textlint-disable -->

`generateStaticParams`関数を[動的なルート Segment](/docs/app-router/building-your-application/routing/dynamic-routes)と組み合わせることで、リクエスト時に生成されるのではなく、ビルド時に静的に生成されるルート Segment のパラメータのリストを定義できます。

<!-- textlint-enable -->

<!-- TODO: Fix link -->

詳細は[API リファレンス](/docs/app-router/api-reference/functions/generate-static-params)を参照してください。
