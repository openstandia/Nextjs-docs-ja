---
title: Viteからの移行
description: 既存の React アプリケーションを Vite から Next.js に移行する方法をご紹介します
---

このガイドは、既存の Vite アプリケーションを Next.js に移行する際に役立ちます。

## なぜ移行するのか?

Vite から Next.js に移行したくなる理由はいくつかあります:

### ページの初期読み込み時間が遅い

[React 用のデフォルトの Vite プラグイン](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)でアプリケーションを構築した場合、アプリケーションは純粋なクライアントサイドアプリケーションです。
クライアントサイドのみのアプリケーションは、シングルページアプリケーション（SPA）としても知られており、ページの初期読み込み時間が遅くなることがよくあります。
これにはいくつかの理由があります:

1. ブラウザは、あなたのコードが何らかのデータをロードするリクエストを送信できるようになる前に、React コードとあなたのアプリケーションバンドル全体がダウンロードされ、実行されるのを待つ必要があります。
2. アプリケーションのコードは、新しい機能や依存関係を追加するたびに増えていきます。

### 自動的なコード分割がない

前述した読み込み時間の遅さという問題は、コード分割によってある程度解決することができます。
しかし、手動でコード分割を行おうとすると、パフォーマンスが悪化することが多いです。
手動でコード分割すると、不注意でネットワークウォーターフォールが発生しやすくなります。
Next.js は、ルーターに組み込まれた自動コード分割機能を提供します。

### ネットワークウォーターフォール

パフォーマンスが低下する一般的な原因は、アプリケーションがデータをフェッチするためにクライアントとサーバー間で連続したリクエストを行う場合に発生します。
SPA におけるデータフェッチの一般的なパターンの 1 つは、最初にプレースホルダをレンダリングし、コンポーネントがマウントされた後にデータをフェッチすることです。
残念ながら、これはデータをフェッチする子コンポーネントが、親コンポーネントが自身のデータのロードを終了するまでフェッチを開始できないことを意味します。

Next.js では、クライアントでのデータ取得がサポートされていますが、データ取得をサーバーに移行するオプションも用意されています。
これは、クライアントとサーバーのウォーターフォールをなくすことができます。

### 迅速かつ意図的なローディング状態

[React Suspense によるストリーミング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#サスペンスによるストリーミング)のビルトイン・サポートにより、
ネットワークウォーターフォールを発生させることなく、UI のどの部分をどの順番で最初にロードするかについて、より意図的に行うことができます。

これにより、読み込みが速く[レイアウトがずれる](https://vercel.com/blog/how-core-web-vitals-affect-seo)ことのないページを構築できます。

### データフェッチ・ストラテジーの選択

Next.js では、ニーズに応じて、ページやコンポーネントごとにデータ取得方法を選択できます。
ビルド時、サーバーでのリクエスト時、およびクライアントでのリクエスト時において、フェッチすることを決めることができます。
たとえば、ビルド時に CMS からデータをフェッチしてブログ記事をレンダリングし、CDN に効率的にキャッシュすることができます。

### Middleware

[Next.js Middleware](/docs/app-router/building-your-application/routing/middleware) 使うと、リクエストが完了する前にサーバー上でコードを実行できます。
特に、ユーザが認証専用ページにアクセスしたときにログインページにリダイレクトすることで、認証されていないコンテンツがフラッシュ表示されるのを避けるのに便利です。
Middleware は実験や[国際化](/docs/app-router/building-your-application/routing/internationalization)にも役立ちます。

### ビルドインの最適化

[画像](/docs/app-router/building-your-application/optimizing/images)、[フォント](/docs/app-router/building-your-application/optimizing/fonts)、[サードパーティのスクリプト](/docs/app-router/building-your-application/optimizing/scripts)は、しばしばアプリケーションのパフォーマンスに大きな影響を与えます。
Next.js には、それらを自動的に最適化する組み込みコンポーネントが用意されています。

## 移行手順

この移行の目的は、Next.js アプリケーションをできるだけ早く動作させ、Next.js の機能を段階的に導入できるようにすることです。
まず最初に、既存のルーターを移行せずに、純粋なクライアントサイドアプリケーション（SPA）として維持します。
こうすることで、移行プロセスで問題が発生する可能性を最小限に抑え、マージの競合を減らすことができます。

### ステップ 1: Next.js の依存関係のインストール

最初にすべきことは、依存関係として `next` をインストールすることです:

```bash title="Terminal"
npm install next@latest
```

### ステップ 2: Next.js の設定ファイルの作成

プロジェクトのルートに `next.config.mjs` を作成します。
このファイルには、[Next.js の設定オプション](/docs/app-router/api-reference/next-config-js)が保存されます。

```js title="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // シングルページアプリケーション（SPA）を出力します
  distDir: './dist', // ビルドの出力ディレクトリを `./dist/` に変更します
}

export default nextConfig
```

> **Good to know:** Next.js 設定ファイルには、`.js` または `.mjs` を使用できます。

### ステップ 3: TypeScript 設定の更新

TypeScript を使用している場合は、Next.js と互換性を持たせるために、`tsconfig.json` ファイルを以下のように変更する必要があります。
TypeScript を使用していない場合は、この手順を省略できます。

1. `tsconfig.node.json` の[プロジェクト参照](https://www.typescriptlang.org/tsconfig#references)を削除します。
2. `./dist/types/**/*.ts` と `./next-env.d.ts` を [`include` 配列](https://www.typescriptlang.org/tsconfig#include)に追加します。
3. `./node_modules` を [`exclude` 配列](https://www.typescriptlang.org/tsconfig#exclude)に追加します。
4. [`compilerOptions` 内の `plugins` 配列](https://www.typescriptlang.org/tsconfig#plugins)に `{ "name": "next" }` を追加します。: `"plugins": [{ "name": "next" }]`
5. [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) に `true` を設定します。: `"esModuleInterop": true`
6. [`jsx`](https://www.typescriptlang.org/tsconfig#jsx) に `preserve` を設定します。: `"jsx": "preserve"`
7. [`allowJs`](https://www.typescriptlang.org/tsconfig#allowJs) に `true` を設定します。: `"allowJs": true`
8. [`forceConsistentCasingIntitles`](https://www.typescriptlang.org/tsconfig#forceConsistentCasingIntitles) に `true` を設定します。: `"forceConsistentCasingIntitles": true`
9. [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) に `true` を設定します。: `"incremental": true`

この変更を加えた `tsconfig.json` の例です:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "forceConsistentCasingIntitles": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["./src", "./dist/types/**/*.ts", "./next-env.d.ts"],
  "exclude": ["./node_modules"]
}
```

TypeScript の設定については、[Next.js のドキュメント](/docs/app-router/building-your-application/configuring/typescript#typescriptプラグイン)を参照してください。

### ステップ 4: ルートレイアウトの作成

Next.js [App Router](/docs/app-router) アプリケーションには、[ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)ファイルを含める必要があります。
これは、アプリケーション内のすべてのページをラップする [React Server Component](/docs/app-router/building-your-application/rendering/server-components) です。
このファイルは、`app`ディレクトリのトップレベルで定義されます。

Vite アプリケーションのルートレイアウトファイルに最も近いのは [`index.html` ファイル](https://vitejs.dev/guide/#index-html-and-project-root)で、`<html>` タグ、`<head>` タグ、`<body>` タグが含まれています。

このステップでは、`index.html` ファイルをルートレイアウトファイルに変換します:

1. `src` ディレクトリに新しい `app` ディレクトリを作成します。
2. その `app` ディレクトリ内に新しい `layout.tsx` ファイルを作成します:

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return null
}
```

> **Good to know**: レイアウトファイルには、`.js`、`.jsx`、または `.tsx` の拡張子を使用できます。

3. `index.html` ファイルの内容を、先に作成した `<RootLayout>` コンポーネントにコピーし、`body.div#root` と `body.script` タグを `<div id="root">{children}</div>` に置き換えます:

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

4. Next.js にはデフォルトで [meta charset](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset) タグと [meta viewport](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) タグが含まれているので、`<head>` からそれらを削除しても問題ありません:

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

5. `favicon.ico`、`icon.png`、`robots.txt` などの[メタデータファイル](/docs/app-router/building-your-application/optimizing/metadata#ファイルベースのメタデータ)は、`app` ディレクトリのトップレベルに配置されている限り、アプリの `<head>` タグに自動的に追加されます。[すべての対応ファイル](/docs/app-router/building-your-application/optimizing/metadata#ファイルベースのメタデータ)を `app` ディレクトリに移動した後、それらの `<link>` タグを安全に削除することができます:

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

6. 最後に、Next.js は最後の `<head>` タグを[メタデータ API](/docs/app-router/building-your-application/optimizing/metadata) で管理できます。最終的なメタデータ情報を、エクスポートされた [`metadata` オブジェクト](/docs/app-router/api-reference/functions/generate-metadata#metadata-オブジェクト)に移動します:

```tsx title="app/layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App is a...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

上記の変更により、`index.html` ですべてを宣言することから、Next.js のフレームワークに組み込まれた規約ベースのアプローチ（[メタデータ API](/docs/app-router/building-your-application/optimizing/metadata)）を使用することにシフトしました。
このアプローチによって、ページの SEO とウェブ共有性をより簡単に向上させることができます。

### ステップ 5: エントリーポイントページの作成

Next.js では、`page.tsx` ファイルを作成してアプリケーションのエントリーポイントを宣言します。
Vite でこのファイルに最も近いのは、`main.tsx` ファイルです。
このステップでは、アプリケーションのエントリポイントを設定します。

1. **`app`ディレクトリに `[[...slug]]` ディレクトリを作成します。**

このガイドでは、まず Next.js を SPA（シングルページアプリケーション）としてセットアップすることを目的としているので、
アプリケーションのすべての可能な経路をキャッチするページのエントリポイントが必要です。
そのためには、アプリディレクトリに新しい `[[...slug]]` ディレクトリを作成します。

このディレクトリは、[オプションのキャッチオールルートセグメント](/docs/app-router/building-your-application/routing/dynamic-routes#オプションのキャッチオール-segment)と呼ばれるものです。
Next.js では、[ディレクトリを使ってルートを定義する](/docs/app-router/building-your-application/routing/defining-routes#ルートの作成)ファイルシステムベースのルーターを使います。
この特別なディレクトリは、アプリケーションのすべてのルートが `page.tsx` ファイルを含むディレクトリに誘導されるようにします。

2. **`app/[[...slug]]` ディレクトリ内に、次の内容で新しい `page.tsx` ファイルを作成します:**

```tsx title="app/[[...slug]]/page.tsx"
import '../../index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

> **Good to know**: ページファイルには、`.js`、`.jsx`、または `.tsx` の拡張子を使用できます。

このファイルは [Server Component](/docs/app-router/building-your-application/rendering/server-components) です。
`next build` を実行すると、このファイルは静的アセットにプリレンダリングされます。動的なコードは必要*ありません*。

このファイルはグローバル CSS をインポートし、[`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params) に 1 つのルート（`/` のインデックスルート）だけを生成するように指示します。

さて、クライアントのみで実行される Vite アプリケーションの残りの部分を動かしてみましょう。

```tsx title="app/[[...slug]]/client.tsx"
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

このファイルは `use client` ディレクティブで定義された[Client Component](/docs/app-router/building-your-application/rendering/client-components) です。
Client Component は、クライアントに送信される前にサーバ上で [HTML にプリレンダリング](/docs/app-router/building-your-application/rendering/client-components#client-components-はどのようにレンダリングされるのか)されます。

クライアント専用のアプリケーションを起動したいので、`App` コンポーネントから下のプリレンダリングを無効にするように `Next.js` を設定します。

```tsx
const App = dynamic(() => import('../../App'), { ssr: false })
```

では、新しいコンポーネントを使うようにエントリーポイントページを更新してください:

```tsx title="app/[[...slug]]/page.tsx"
import '../../index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

### ステップ 6: 静的画像インポートの更新

Next.js では、静的画像のインポート処理が Vite と若干異なります。
Vite では、画像ファイルをインポートするとその公開 URL が文字列として返されます:

```tsx title="App.tsx"
import image from './img.png' // 本番では `image` は '/assets/img.2d8efhg.png' になります

export default function App() {
  return <img src={image} />
}
```

Next.js では、静的画像のインポートはオブジェクトを返します。
このオブジェクトは、Next.js の [`<Image>` コンポーネント](/docs/app-router/api-reference/components/image)で直接使用することもできますし、既存の `<img>` タグでオブジェクトの `src` プロパティを使用することもできます。

`<Image>` コンポーネントには、[画像の自動最適化](/docs/app-router/building-your-application/optimizing/images)という利点もあります。
`<Image>` コンポーネントは、画像の寸法に基づいて、生成される `<img>` の `width` 属性と `height` 属性を自動的に設定します。
これにより、画像の読み込み時にレイアウトがずれるのを防ぐことができます。
しかし、アプリに含まれる画像の寸法の一方だけがスタイル設定され、もう一方が `auto` にスタイル設定されていない場合、問題が発生する可能性があります。
`auto` にスタイル設定されていない場合、 寸法はデフォルトで `<img>` タグの寸法属性の値になり、イメージが歪んで見える原因となります。

`<img>` タグを維持することで、アプリケーションの変更量を減らし、上記の問題を防ぐことができます。
その後、オプションで `<Image>` コンポーネントに移行して、[ローダーを設定する](/docs/app-router/building-your-application/optimizing/images#loaders)ことで画像の最適化を利用したり、画像の自動最適化を備えたデフォルトの Next.js サーバーに移行したりすることができます。

1. **`/public` からインポートした画像の絶対インポートパスを相対インポートに変換すします:**

```tsx
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

2. **`<img>` タグには、画像オブジェクト全体ではなく、画像の `src` プロパティを渡します:**

```tsx
// Before
<img src={logo} />

// After
<img src={logo.src} />
```

代わりに、タイトルに基づいて画像アセットの公開 URL を参照することもできます。
例えば、`public/logo.png` はアプリケーション内の `/logo.png` というパスで画像を提供しますので、`src` の値として使用できます。

> **注意:** TypeScript を使用している場合、`src` プロパティにアクセスする際に型エラーが発生する可能性があります。
> 今のところは無視してかまいません。このガイドの終わりまでには修正されるでしょう。

### ステップ 7: 環境変数の移行

Next.js は Vite と同様に `.env` [環境変数](/docs/app-router/building-your-application/configuring/environment-variables)をサポートしています。
主な違いは、クライアントサイドで環境変数を公開するためのプレフィックスです。

- プレフィックスが `VITE_` の環境変数はすべて `NEXT_PUBLIC_`に変更してください。

Vite では、Next.js ではサポートされていないいくつかの組み込み環境変数を特別な `import.meta.env` オブジェクトで公開しています。
以下のように使用方法を更新する必要があります:

- `import.meta.env.MODE` ⇒ `process.env.NODE_ENV`
- `import.meta.env.PROD` ⇒ `process.env.NODE_ENV === 'production'`
- `import.meta.env.DEV` ⇒ `process.env.NODE_ENV !== 'production'`
- `import.meta.env.SSR` ⇒ `typeof window !== 'undefined'`

Next.js には、組み込みの `BASE_URL` 環境変数もありません。しかし、必要であれば設定することができます:

1. **`.env` ファイルに以下を追加します:**

```bash title=".env"
# ...
NEXT_PUBLIC_BASE_PATH="/some-base-path"
```

2. **`next.config.mjs` ファイルの `process.env.NEXT_PUBLIC_BASE_PATH` に [`basePath`](/docs/app-router/api-reference/next-config-js/basePath) を設定します:**

```js title="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // シングルページアプリケーション（SPA）を出力します
  distDir: './dist', // ビルドの出力ディレクトリを `./dist/` に変更します
  basePath: process.env.NEXT_PUBLIC_BASE_PATH, // basePath を `/some-base-path` に設定します
}

export default nextConfig
```

3. **`import.meta.env.BASE_URL` の使用法を `process.env.NEXT_PUBLIC_BASE_PATH` に更新する。**

### ステップ 8: `package.json` のスクリプトの更新

これで、もし Next.js への移行が成功していればアプリケーションを実行できるようになります。
しかしその前に、`package.json`の `scripts` を Next.js 関連のコマンドで更新し、`.next` と `next-env.d.ts` を `.gitignore` に追加する必要があります:

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

```txt title=".gitignore"
# ...
.next
next-env.d.ts
dist
```

`npm run dev` を実行し、[`http://localhost:3000`](http://localhost:3000)を開きます。
すると、Next.js 上でアプリケーションが動いているのが見えるはずです。

> **例:** Next.js に移行した Vite アプリケーションの動作例については、[こちらのプルリクエスト](https://github.com/inngest/vite-to-nextjs/pull/1)をご覧ください。

### ステップ 9: クリーンアップ

これでコードベースから Vite 関連の成果物を一掃できます:

- `main.tsx` を削除します。
- `index.html` を削除します。
- `vite-env.d.ts` を削除します。
- `tsconfig.node.json` を削除します。
- `vite.config.ts` を削除します。
- Vite の依存関係をアンインストールします。

## 次のステップ

すべてが計画どおりに進んでいれば、Next.js アプリケーションはシングルページアプリケーションとして動作しています。
まだ Next.js のメリットのほとんどを活用できていませんが、あなたは今すべての利点を享受するために漸進的な変更を開始することができます。次にやるべきことは以下の通りです:

- React Router から [Next.js App Router](/docs/app-router/building-your-application/routing) に移行して、次のことを実現します。
  - コードの自動分割
  - [ストリーミングサーバーレンダリング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)
  - [React Server Components](/docs/app-router/building-your-application/rendering/server-components)
- [`<Image>` コンポーネントで画像を最適化します](/docs/app-router/building-your-application/optimizing/images)
- [`next/font`でフォントを最適化します](/docs/app-router/building-your-application/optimizing/fonts)
- [`<Script>` コンポーネントでサードパーティ製スクリプトを最適化します](/docs/app-router/building-your-application/optimizing/scripts)
- [Next.js ルールをサポートするように ESLint の設定を更新します](/docs/app-router/building-your-application/configuring/eslint)
