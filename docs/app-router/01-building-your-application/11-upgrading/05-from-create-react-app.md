---
title: Create React App からの移行
description: 既存の Create React App で作成した React アプリケーションを Next.js に移行する方法を学びます。
---

このガイドでは、既存の Create React App サイトを Next.js に移行する方法について説明します。

## なぜ乗り換えるのか？

Create React App から Next.js に切り替える理由はいくつかあります:

### 初期ページの読み込み時間の遅さ

Create React App は純粋にクライアントサイドの React を使用します。クライアントサイドのみのアプリケーション、別名シングルページアプリケーション（SPA）は、しばしば初期ページの読み込み時間が遅くなります。これにはいくつかの理由があります:

1. ブラウザは、React のコードとアプリケーション全体のバンドルをダウンロードして実行し、コードがデータのリクエストを送るようになるまで待たなければなりません。
2. 新しい機能や依存関係を追加するたびに、アプリケーションのコードが増えます。

### 自動的なコード分割がない

遅い読み込み時間の問題は、コードの分割を使ってある程度管理できます。しかし、手動でコード分割を試みると、パフォーマンスをさらに悪化させることがよくあります。手動でコードを分割すると、ネットワークのウォーターフォールを無意識のうちに導入するしてしまいます。Next.js は、Router により自動コード分割を提供します。

### ネットワークウォーターフォール

アプリケーションがクライアントとサーバー間で連続的にリクエストを行ってデータを取得するとき、パフォーマンス低下をもたらす原因があります。SPA でのデータ取得の一般的なパターンは、最初にプレースホルダをレンダリングし、その後にコンポーネントがマウントされた後にデータを取得することです。残念ながら、これはデータを取得する子コンポーネントが、親コンポーネントが自身のデータのロードを終えるまで取得を開始できないことを意味します。

Next.js ではクライアントでのデータ取得もサポートされていますが、データ取得をサーバーにシフトするオプションも提供し、クライアントとサーバーのウォーターフォールを排除できます。

### 迅速かつ意図的なローディング状態

[React Suspense を通じたストリーミングのビルトインサポート](/docs/app-router/building-your-application/routing/loading-ui-and-streaming#サスペンスによるストリーミング)により、UI のどの部分を最初に、そしてどの順序でロードするかをより意図的に決定できます。これにより、ネットワークウォーターフォールを導入せずに、読み込みが高速なページを構築し、[レイアウトシフト](https://vercel.com/blog/how-core-web-vitals-affect-seo)を排除できます。

### データフェッチ・ストラテジー

ニーズに応じて、Next.js ではページやコンポーネントごとにデータフェッチ・ストラテジーを選ぶことができます。ビルド時、サーバー上のリクエスト時、またはクライアント上でデータを取得することを選択できます。たとえば、CMS からデータを取得してブログ投稿をビルド時にレンダリングし、それを CDN 上で効率的にキャッシュできます。

### Middleware

[Next.js の Middleware](/docs/app-router/building-your-application/routing/middleware)を使用すると、リクエストが完了する前にサーバー上でコードを実行できます。これは、ユーザーの認証が必要なページにアクセスしたとき、認証されていないコンテンツのフラッシュを避けるためにログインページへリダイレクトする場合などに特に便利です。Middleware は、実験的機能の実装や[国際化](/docs/app-router/building-your-application/routing/internationalization)にも役立ちます。

### ビルドインの最適化

[画像](/docs/app-router/building-your-application/optimizing/images)、[フォント](/docs/app-router/building-your-application/optimizing/fonts)、および[サードパーティのスクリプト](/docs/app-router/building-your-application/optimizing/scripts)は、アプリケーションのパフォーマンスに大きな影響を及ぼすことがよくあります。Next.js には、それらを自動的に最適化するためのビルトインのコンポーネントがあります。

## 移行手順

移行の目標は、できるだけ早く、Next.js アプリケーションとして動作させ、その後、Next.js の機能を段階的に採用することです。
まず、既存の Router を移行せずに純粋なクライアントサイドアプリケーション（SPA）として維持することから始めます。これにより、移行プロセス中で問題に遭遇する可能性を最小限に抑え、マージコンフリクトを減らすことができます。

### ステップ1: Next.js の依存関係のインストール

最初に行うべきことは、`next` を依存関係としてインストールすることです:

```bash title="Terminal"
npm install next@latest
```

### ステップ2: Next.js の設定ファイルの作成

プロジェクトのルートに `next.config.mjs` を作成します。このファイルには、[Next.js の設定オプション](/docs/app-router/api-reference/next-config-js)が含まれます。

```js title="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // シングルページアプリケーション（SPA）を出力します。
  distDir: './dist', // ビルド出力ディレクトリを `./dist/` に変更します。
}

export default nextConfig
```

> **Good to know:** Next.js の設定ファイルには、`.js` もしくは `.mjs` を使用できます。

### ステップ3: TypeScript 設定の更新

TypeScript を使用している場合、`tsconfig.json` ファイルを次のように更新して、Next.js との互換性を確保します:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "strictNullChecks": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "./dist/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

TypeScript の設定についての詳細は、[Next.js のドキュメント](/docs/app-router/building-your-application/configuring/typescript#typescriptプラグイン)で見つけることができます。

### ステップ4: ルートレイアウトの作成

Next.js の[App Router](/docs/app-router) アプリケーションには、アプリケーション内のすべてのページをラップする[ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)ファイルが含まれていなければなりません。このファイルは、`app` ディレクトリのトップレベルで定義されます。

CRA アプリケーションでルートレイアウトファイルにもっとも近いものは、`<html>`、`<head>`、および `<body>` タグを含む `index.html` ファイルです。

このステップでは、`index.html` ファイルをルートレイアウトファイルに変換します:

1. `src` ディレクトリ内に新しい `app` ディレクトリを作成します
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

> **Good to know**: レイアウトファイルには `.js`, `.jsx`, `.tsx` の拡張子が使用できます。

<!-- textlint-disable -->
3. `index.html` ファイルの内容を先ほど作成した `<RootLayout>` コンポーネントにコピーし、`body.div#root` と `body.script` タグを `<div id="root">{children}</div>` に置き換えます:
<!-- textlint-enable -->

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
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

> **Good to know**: [マニフェストファイル](/docs/app-router/api-reference/file-conventions/metadata)、favicon以外のアイコン、および [テストの設定](/docs/app-router/building-your-application/testing)を今回は無視しますが、必要な場合、Next.js はこれらのオプションもサポートしています。

4. Next.js はデフォルトで [meta charset](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset) と [meta viewport](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) タグを含んでいるため、これらを `<head>` から安全に削除できます:

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

<!-- textlint-disable -->
5. `favicon.ico`, `icon.png`, `robots.txt` などの[メタデータファイル](/docs/app-router/building-your-application/optimizing/metadata#ファイルベースのメタデータ) は、それらを `app` ディレクトリのトップレベルに配置する限り、アプリケーションの `<head>` タグに自動的に追加されます。[サポートされる全ファイル](/docs/app-router/building-your-application/optimizing/metadata#ファイルベースのメタデータ) を `app` ディレクトリに移動した後、それらの `<link>` タグを安全に削除できます:
<!-- textlint-enable -->

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

6. 最後に、[メタデータ API](/docs/app-router/building-your-application/optimizing/metadata) を使用して、最終的な `<head>` タグを Next.js で管理できます。最終的なメタデータ情報をエクスポートする [`metadata` オブジェクト](/docs/app-router/api-reference/functions/generate-metadata#metadata-オブジェクト) に移動します:

```tsx title="app/layout.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
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

上記の変更により、`index.html` 内ですべてを宣言することから、フレームワークに内蔵された Next.js の規約ベースのアプローチ（
[メタデータ API](/docs/app-router/building-your-application/optimizing/metadata)）に移行されました。このアプローチにより、ページの SEO と Web 共有性をより簡単に向上させることができます。

### ステップ 5: エントリーポイントページの作成

Next.js では、アプリケーションのエントリーポイントを `page.tsx` ファイルで宣言します。CRA でのもっとも近いファイルは `src/index.tsx` ファイルです。このステップでは、アプリケーションのエントリーポイントを設定します。

1. **`app` ディレクトリ内に `[[...slug]]` ディレクトリを作成します。**

このガイドでは、まず Next.js を SPA（Single Page Application）として設定することを目指しています。そのため、アプリケーションの可能なすべてのルートをキャッチするために、`app` ディレクトリ内に新しい `[[...slug]]` ディレクトリを作成する必要があります。

このディレクトリは [オプションのキャッチオール Segment](/docs/app-router/building-your-application/routing/dynamic-routes#オプションのキャッチオール-segment) と呼ばれます。Next.js はファイルシステムベースの Router を使用しており、[ディレクトリはルートを定義](/docs/app-router/building-your-application/routing/defining-routes#ルートの作成) します。この特殊なディレクトリは、アプリケーションのすべてのルートを含む `page.tsx` ファイルに直接することを保証します。

2. **`app/[[...slug]]` ディレクトリ内に以下の内容で新しい `page.tsx` ファイルを作成します:**

```tsx title="app/[[...slug]]/page.tsx"
import '../../src/index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // このコンテンツは更新します
}
```

> **Good to know**: ページファイルには `.js`, `.jsx`, `.tsx` の拡張子が使用できます。

このファイルは[Server Components](/docs/app-router/building-your-application/rendering/server-components)です。`next build`を実行すると、ファイルは静的アセットとして事前にレンダリングされます。動的なコードを_必要としません_。

このファイルは、グローバルCSSをインポートし、[`generateStaticParams`](/docs/app-router/api-reference/functions/generate-static-params)に対して、`/`でのインデックスルートのみを生成することを伝えます。

それでは、クライアントのみで実行される CRA アプリケーションの残りの部分を移動しましょう。

```tsx title="app/[[...slug]]/client.tsx"
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../src/App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

このファイルは[Client Components](/docs/app-router/building-your-application/rendering/client-components)で、`'use client'`ディレクティブによって定義されています。Client Component は、クライアントへ送信される前にサーバー上でHTMLに[事前レンダリング](/docs/app-router/building-your-application/rendering/client-components#client-components-はどのようにレンダリングされるのか)されます。

クライアントのみのアプリケーションを開始したいのであれば、`App` コンポーネントから事前レンダリングを無効にするように Next.js を設定できます。

```tsx
const App = dynamic(() => import('../../App'), { ssr: false })
```

新しいコンポーネントを使用するようにエントリポイントページを更新してください。

```tsx title="app/[[...slug]]/page.tsx"
import '../../src/index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

### ステップ 6: 静的画像インポートの更新

Next.js は CRA とは少し異なり、静的画像インポートを扱います。CRAでは、画像ファイルをインポートすると、その公開 URL が文字列として返されます。

```tsx title="App.tsx"
import image from './img.png'

export default function App() {
  return <img src={image} />
}
```

Next.js での静的画像インポートはオブジェクトを返し、Next.js の[`<Image>` コンポーネント](/docs/app-router/api-reference/components/image)で直接使用するか、またはオブジェクトの`src`プロパティを既存の`<img>`タグで使用できます。

`<Image>` コンポーネントには[自動で画像最適化](/docs/app-router/building-your-application/optimizing/images)される利点があります。`<Image>` コンポーネントは、画像の寸法に基づいて生成された `<img>` の `width` と `height` 属性を自動的に設定します。これにより、画像が読み込まれる際のレイアウトシフトが防止されます。しかし、これは、その他の寸法が `auto` にスタイルされていない画像がアプリケーションに含まれている場合、問題を引き起こす可能性があります。`auto` にスタイルされていない場合、寸法は `<img>` の寸法属性の値がデフォルトになり、画像が歪んで見える可能性があります。

`<img>` タグを保持することで、アプリケーションの変更を最小限に抑え、上記の問題を防ぐことができます。その後、[ローダーを設定する](/docs/app-router/building-your-application/optimizing/images#loaders)、または自動的な画像最適化を持つデフォルトの Next.js サーバーに移行することにより、画像を最適化するために `<Image>` コンポーネントへの移行を選択できます。

1. **`/public` からインポートされた画像の絶対インポートパスを、相対インポートに変換します:**

```tsx
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

1. **画像オブジェクトではなく、`src` プロパティを `<img>` タグに渡します:**

```tsx
// Before
<img src={logo} />

// After
<img src={logo.src} />
```

または、ファイル名に基づいて画像アセットの公開 URL を参照できます。例えば、`public/logo.png` はアプリケーションの `/logo.png` で画像を提供し、これが `src` の値になります。

> **注意:** TypeScriptを使用している場合、`src`
> プロパティにアクセスする際に型エラーが発生する可能性があります。今のところそれらは無視しても大丈夫です。このガイドの最後に修正されます。

### ステップ 7: 環境変数の移行

Next.jsはCRAと同様に、`.env`
[環境変数](/docs/app-router/building-your-application/configuring/environment-variables)をサポートしています。

主な違いは、クライアント側で環境変数を公開するために使用されるプレフィックスです。`REACT_APP_`プレフィックスを持つすべての環境変数を`NEXT_PUBLIC_`に変更します。

### ステップ 8: `package.json`のスクリプトの更新

アプリケーションを実行し、Next.js への移行が成功したかどうかをテストする準備が整いました。しかし、それを行う前に、`package.json` の`scripts` を Next.js 関連のコマンドに更新し、`.next` と `next-env.d.ts` を `.gitignore` に追加する必要があります:

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

これで、`npm run dev` を実行し、[`http://localhost:3000`](http://localhost:3000) を開くと、アプリケーションが Next.js 上で実行されているのが確認できます。

> **例:** CRA アプリケーションを Next.js に移行した実際の例については、[このリポジトリ](https://github.com/vercel/cra-to-next)を確認してください。

### ステップ 9: クリーンアップ

これで、Create React App に関連するアーティファクトからコードベースをクリーンアップする準備ができました:

- `src/index.tsx` を削除
- `public/index.html` を削除
- `reportWebVitals` の設定を削除
- CRAの依存関係（`react-scripts`）をアンインストール

## バンドラーの互換性

Create React App と Next.js は、どちらもデフォルトで webpack を使用してバンドリングします。

CRA アプリケーションを Next.js へ移行する際に、移行したいカスタムの webpack 設定があるかもしれません。Next.jsは[カスタムの webpack 設定](/docs/app-router/api-reference/next-config-js/webpack)をサポートしています。

さらに、`next dev --turbo` を通じて [Turbopack](/docs/app-router/api-reference/next-config-js/turbo) をサポートし、ローカル開発のパフォーマンスを向上させます。Turbopack は、互換性と段階的な採用のためにいくつかの [webpack ローダー](/docs/app-router/api-reference/next-config-js/turbo)もサポートしています。

## 次のステップ

計画通りに進んだ場合、シングルページアプリケーションとして実行される機能的な Next.js アプリケーションが手元にあります。まだ Next.js の多くの利点を活用していませんが、次に何をするべきかを目的として段階的な変更を加え始めることができます:

- React Router から [Next.js App Router](/docs/app-router/building-your-application/routing) への移行を検討し、次の機能を得ます:
  - 自動コード分割
  - [ストリーミングサーバーレンダリング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)
  - [React Server Components](/docs/app-router/building-your-application/rendering/server-components)
- [`<Image>` コンポーネント](/docs/app-router/building-your-application/optimizing/images)を使って画像を最適化します
- [`next/font`](/docs/app-router/building-your-application/optimizing/fonts) を使ってフォントを最適化します
- [`<Script>` コンポーネント](/docs/app-router/building-your-application/optimizing/scripts)を使ってサードパーティスクリプトを最適化します
- [ESLintの設定を更新](/docs/app-router/building-your-application/configuring/eslint)して Next.js ルールをサポートします

> **Good to know:** 静的エクスポートは現在、`useParams` フックの使用を[サポートしていません](https://github.com/vercel/next.js/issues/54393)。