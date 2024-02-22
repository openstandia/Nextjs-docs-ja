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

> **Good to know**: `mdx-components.tsx` は App Router と MDX を使うために必要であり、これがなければ動作しません。

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

MDX ページの間でレイアウトを共有するために、App Routerの[組み込みのレイアウトのサポート](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト)を使用できます。

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

## Frontmatter

Frontmatter は、ページについてのデータを保存するために使用できる YAML 形式のキー/バリューの組み合わせです。デフォルトでは、 `@next/mdx` は frontmatter をサポートしていませんが、MDX コンテンツに fronmatter を追加するための多くのライブラリがあります。例えば:

- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
- [remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

`@next/mdx` を使用してページのメタデータにアクセスするためには、 `.mdx` ファイル内からメタデータオブジェクトをエクスポートできます:

```mdx
export const metadata = {
  author: 'John Doe',
}

# My MDX page
```

## カスタム要素

Markdown を使用する楽しい面の1つは、それがネイティブの `HTML` エレメントにマッピングされ、素早く直感的に記述できることです:

```md
This is a list in markdown:

- One
- Two
- Three
```

このテキストは次のような `HTML` を生成します:

```html
<p>This is a list in markdown:</p>

<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

あなたのウェブサイトやアプリケーションのために独自の要素を用意したい場合、ショートコードを渡すことができます。ショートコードは `HTML` 要素に対応するカスタムコンポーネントです。

そのためには、アプリケーションのルートにある `mdx-components.tsx` ファイルを開き、カスタム要素を追加します:

```tsx title="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

// このファイルでは、MDX ファイルで使用するカスタム React コンポーネントを指定できます。
// React コンポーネントを自由にインポートして使用することができます。例えば、インラインスタイル、他のライブラリのコンポーネントなどです。

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ビルトインコンポーネントをカスタマイズすることが可能です。例えば、スタイリングを追加する場合などです。
    h1: ({ children }) => <h1 style={{ fontSize: '100px' }}>{children}</h1>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  }
}
```

## さらに学ぶ: Markdown を HTML に変換するには？

React は、Markdown をネイティブに理解できません。まず Markdown のプレーンテキストを HTML に変換する必要があります。そのために `remark` と `rehype` を使用します。

`remark` は Markdown に関するツールのエコシステムです。`rehype` も同じですが、HTML 向けです。例えば、以下のコードスニペットは Markdown を HTML に変換します:

```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse) // Markdown AST に変換
    .use(remarkRehype) // HTML AST に変換
    .use(rehypeSanitize) // HTML 入力のサニタイズ
    .use(rehypeStringify) // AST をシリアライズした HTML に変換
    .process('Hello, Next.js!')

  console.log(String(file)) // <p>Hello, Next.js!</p>
}
```

`remark` と `rehype` のエコシステムには、[シンタックス・ハイライト](https://github.com/atomiks/rehype-pretty-code)、[見出しリンク](https://github.com/rehypejs/rehype-autolink-headings)、[目次の生成](https://github.com/remarkjs/remark-toc)などのプラグインが含まれています。

上記のように `@next/mdx` を使用する場合、`remark` や `rehype` を直接使用する必要はありません。それらはすでに処理されています。ここで説明しているのは、`@next/mdx` パッケージが内部で何をしているかをより深く理解するためです。

## Rust ベースの MDX コンパイラの使用（実験的）

Next.js は、Rust で書かれた新しい MDX コンパイラをサポートしています。このコンパイラはまだ実験段階であり、プロダクションでの使用はお勧めできません。新しいコンパイラを使用する場合、`next.config.js` を `withMDX` へ渡す際に設定が必要です:

```js title="next.config.js"
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
})
```

## 関連情報

- [MDX](https://mdxjs.com)
- [`@next/mdx`](https://www.npmjs.com/package/@next/mdx)
- [remark](https://github.com/remarkjs/remark)
- [rehype](https://github.com/rehypejs/rehype)
- [Markdoc](https://markdoc.dev/docs/nextjs)
