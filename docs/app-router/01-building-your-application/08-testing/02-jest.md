---
title: Jest
sidebar_label: Jest
description: ユニットテストとスナップショットテストのために、Next.js で Jest をセットアップする方法を学びます。
---

Jest と React Testing Library は、**ユニットテスト**や**スナップショットテスト**によく使われます。このガイドでは、Next.js で Jest をセットアップし、最初のテストを書く方法を紹介します。

> **Good to know:** `Async` Server Components は React エコシステムにとって新しいものなので、Jest は現在サポートしていません。同期 Server Components と Client Components の**ユニットテスト**を実行することはできますが、`Async` Components の**E2E テスト**を使用することをお勧めします。

## クイックスタート

Next.js の [with-jest](https://github.com/vercel/next.js/tree/canary/examples/with-jest) サンプルで `create-next-app` を使えば、すぐに使い始めることができます：

```bash title="Terminal"
npx create-next-app@latest --example with-jest with-jest-app
```

## 手動セットアップ

[Next.js 12](https://nextjs.org/blog/next-12) のリリース以降、Next.js には Jest 用のビルトイン設定が追加されました。

Jest を設定するには、`jest` と以下のパッケージを dev dependencies としてインストールしてください：

```bash title="Terminal"
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# or
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# or
pnpm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

以下のコマンドを実行して、基本的な Jest の設定ファイルを生成します：

```bash title="Terminal"
npm init jest@latest
# or
yarn create jest@latest
# or
pnpm create jest@latest
```

これは、自動的に `jest.config.ts|js` ファイルを作成するなど、プロジェクト用に Jest をセットアップするための一連のプロンプトを表示します。

`next/jest` を使うように設定ファイルを更新してください。このトランスフォーマーには、Jest が Next.js で動作するために必要な設定オプションがすべて含まれています：

```ts title="jest.config.ts"
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

内部では`next/jest` が Jest を自動的に設定します：

- [Next.js コンパイラ](/docs/app-router/architecture/nextjs-compiler)を使用した `transform` の設定
- スタイルシート（`.css`、`.module.css`、およびそれらの scss variants）、画像インポート、[`next/font`](/docs/app-router/building-your-application/optimizing/fonts) の自動モック化
- `.env`（およびすべての variants）の `process.env` へのロード
- テストの解決と変換から`node_modules` を無視する。
- テスト解決から`.next` を無視する
- SWC トランスフォームを有効にするフラグの `next.config.js` の読み込み

> **Good to know**: 環境変数を直接テストするには、別のセットアップスクリプトまたは `jest.config.ts` ファイルに手動でロードします。詳細については、[環境変数のテスト](/docs/app-router/building-your-application/configuring/environment-variables#test-environment-variables)を参照してください。

## オプション：絶対インポートとモジュール・パス・エイリアスのハンドリング

プロジェクトが[モジュールパスのエイリアス](/docs/app-router/building-your-application/configuring/absolute-imports-and-module-aliases)を使用している場合、`jsconfig.json` ファイルの paths オプションと `jest.config.js` ファイルの `moduleNameMapper` オプションをマッチさせることで、インポートを解決するように Jest を設定する必要があります。

```json title="tsconfig.json or jsconfig.json"
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": "./",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```js title="jest.config.js"
moduleNameMapper: {
  // ...
  '^@/components/(.*)$': '<rootDir>/components/$1',
}
```

## オプション：custom matchers で Jest を拡張する

`testing-library/jest-dom` には、`.toBeInTheDocument()` のような便利な [custom matchers](https://github.com/testing-library/jest-dom#custom-matchers) のセットが含まれています。Jest の設定ファイルに次のオプションを追加することで、 すべてのテストに対して custom matchers をインポートすることができます：

```ts title="jest.config.ts"
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
```

次に、`jest.setup.ts` の中に、以下の import を追加します：

```ts title="jest.setup.ts"
import '@testing-library/jest-dom'
```

> **Good to know:**[`extend-expect` は `v6.0` で削除された](https://github.com/testing-library/jest-dom/releases/tag/v6.0.0)ので、バージョン 6 以前の `@testing-library/jest-dom` を使用している場合は、代わりに `@testing-library/jest-dom/extend-expect` をインポートする必要があります。

各テストの前にさらにセットアップオプションを追加する必要がある場合は、上記の `jest.setup.js` ファイルに追加することができます。

## `package.json` に `test` スクリプトを追加する

最後に、`package.json` ファイルに Jest `test` スクリプトを追加します：

```json title="package.json" highlight={6-7}
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

`jest --watch` は、ファイルが変更されたときにテストを再実行します。その他の Jest CLI オプションについては、 [Jest Docs](https://jestjs.io/docs/cli#reference) を参照してください。

### 最初のテストを作成する

これでプロジェクトはテストを実行する準備ができました。プロジェクトのルートディレクトリに `__tests__` というフォルダを作成します。

例えば、`<Page />`コンポーネントが見出しのレンダリングに成功したかどうかをチェックするテストを追加することができます：

```jsx title="app/page.js
import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```jsx title="__tests__/page.test.jsx"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

オプションで、[スナップショットテスト](https://jestjs.io/docs/snapshot-testing)を追加して、コンポーネントの予期せぬ変更を追跡しておきます：

```jsx title="__tests__/snapshot.js"
import { render } from '@testing-library/react'
import Page from '../app/page'

it('renders homepage unchanged', () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})
```

## テストを実行する

以下のコマンドを実行してテストを実行します：

```bash title="Terminal"
npm run test
# or
yarn test
# or
pnpm test
```

## 追加資料

さらに詳しい情報については、以下の資料が役立ちます：

- [Next.js with Jest example](https://github.com/vercel/next.js/tree/canary/examples/with-jest)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Playground](https://testing-playground.com/) - 要素を一致させるために、良いテストプラクティスを使用します。
