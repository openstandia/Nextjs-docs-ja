---
title: Markdown と MDX
nav_title: MDX
description: MDX を構成して、Markdown  ファイルで JSX を書く方法を学びましょう。
---

[Markdown ](https://daringfireball.net/projects/markdown/syntax) は、テキストを形式化するための軽量なマークアップ言語です。 プレーンテキストの構文を書くことで、構造的に有効な HTML に変換できます。ウェブサイトやブログのコンテンツを書くためによく使われます。

次のように書くと:

```md title="Markdown サンプル"
I **love** using [Next.js](https://nextjs.org/)
```

以下のように出力されます:

```html
<p>I <strong>love</strong> using <a href="https://nextjs.org/">Next.js</a></p>
```

[MDX](https://mdxjs.com/) は、Markdown のスーパーセットで、Markdown ファイルに直接 [JSX](https://react.dev/learn/writing-markup-with-jsx) を書くことができます。コンテンツに動的な対話性を追加したり、React コンポーネントを埋め込む強力な方法です。

<!-- textlint-disable -->
Next.js は、アプリケーション内のローカル MDX コンテンツと、サーバー上で動的にフェッチされるリモート MDX ファイルの両方をサポートしています。 Next.js プラグインは、Markdown と React コンポーネントを HTML に変換する役割を果たし、Server Components（App Routerのデフォルト）での使用をサポートします。
<!-- textlint-enable -->

## `@next/mdx`

`@next/mdx` パッケージは、Markdown と MDX を処理できるように Next.js を設定します。 **ローカルファイルからデータを取得し**、`.mdx` 拡張子のページを直接 `/pages` または `/app` ディレクトリに作成できます。

MDX を Next.jsで設定し、使う方法をみていきましょう。

## Getting Started

MDX をレンダリングするために必要なパッケージをインストールします:

```bash title="Terminal"
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

アプリケーションのルート（`src/` または `app/` の親フォルダのいずれか）に `mdx-components.tsx` ファイルを作成します:

> **Good to know**: `mdx-components.tsx` は App ルータと MDX を使うために必要であり、これがなければ動作しません。

```tsx title="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

次に、プロジェクトのルートにある `next.config.js` ファイルを更新して、MDX を使用できるように設定します:

```js title="next.config.js"
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `pageExtensions` MDX をサポートするための設定
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // 任意で他の設定を追加
}

module.exports = withMDX(nextConfig)
```

その後、`/app` ディレクトリ内に新しい MDX ページを作成します:

```txt
  your-project
  ├── app
  │   └── my-mdx-page
  │       └── page.mdx
  └── package.json
```

これで、MDX ページ内で Markdown を使用したり、直接 React コンポーネントをインポートできます:

```mdx 
import { MyComponent } from 'my-components'

# Welcome to my MDX page!

This is some **bold** and _italics_ text.

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent />
```

`/my-mdx-page` ルートに移動すると、レンダリングされた MDX を表示できます。

## リモートの MDX

Markdown または MDX ファイルやコンテンツが **他の場所** にある場合、サーバー上で動的に取得できます。 これは、別のローカルフォルダ、CMS、データベース、または他の場所に格納されているコンテンツに使用できます。よく利用されるコミュニティ・パッケージは [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support) です。

> **Good to know**: 慎重に使用してください。 MDX は JavaScript にコンパイルされ、サーバー上で実行されます。MDX コンテンツは信頼できるソースからのみ取得し、そうでなければリモートコード実行(RCE)につながる可能性があります。

次の例は `next-mdx-remote` を使用しています:

```tsx title="app/my-mdx-page-remote/page.tsx"
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function RemoteMdxPage() {
  // MDX ファイルのパス - ローカルファイル、データベース、CMS、フェッチ、その他...
  const res = await fetch('https://...')
  const markdown = await res.text()
  return <MDXRemote source={markdown} />
}
```

`/my-mdx-page-remote` ルートに移動すると、レンダリングされた MDX を表示できます。

## レイアウト

MDX ページの間でレイアウトを共有するために、App Routerの[組み込みのレイアウトのサポート](/docs/app-router/building-your-application/routing/pages-and-layouts#layouts)を使用できます。

```tsx title="app/my-mdx-page/layout.tsx"
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // ここで共有レイアウトやスタイルを作成
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

## Remark と Rehype プラグイン

必要に応じて、`remark`と `rehype`のプラグインを提供して、MDX コンテンツを変換できます。

たとえば、`remark-gfm` を使用して GitHub Flavored Markdown をサポートできます。

`remark` と `rehype` のエコシステムは ESM のみをサポートしているので、 `next.config.mjs` を設定ファイルとして使用する必要があります。

```js title="next.config.mjs"
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `pageExtensions` MDX をサポートするための設定
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // 任意で他の設定を追加
}

const withMDX = createMDX({
	// 必要な Markdown プラグインをここに追加する
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

// MDX の設定と Next.js の設定をマージする
export default withMDX(nextConfig)
```