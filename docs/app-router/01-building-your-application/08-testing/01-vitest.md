---
title: Vitest
nav_title: Vitest
description: ユニットテストのために Next.js で Vitest をセットアップする方法を学びます。
---

Vite と React Testing Library は、ユニットテストのためによく一緒に使われます。このガイドでは、Next.js で Vitest をセットアップし、最初のテストを書く方法を紹介します。

> **Good to know:** `Async` Server Components は React エコシステムにとって新しいものであるため、Vitest では現在サポートしていません。同期 Server Components と Client Components の**ユニットテスト**を実行することはできますが、`非同期`コンポーネントの **E2E テスト**を使用することをお勧めします。

## クイックスタート

Next.js の [with-vitest](https://github.com/vercel/next.js/tree/canary/examples/with-vitest) サンプルで `create-next-app` を使えば、すぐに使い始めることができます：

```bash title="Terminal"
npx create-next-app@latest --example with-vitest with-vitest-app
```

## 手動セットアップ

Vitest を手動でセットアップするには、`vitest` と以下のパッケージを dev dependencies としてインストールしてください：

```bash title="Terminal"
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
# or
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react
# or
pnpm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
# or
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

プロジェクトのルートに `vitest.config.ts|js` ファイルを作成し、以下のオプションを追加します：

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```

Vitest の設定の詳細については、[Vitest Configuration docs](https://vitest.dev/config/#configuration) を参照してください。

次に、`package.json` に `test` スクリプトを追加します：

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest"
  }
}
```

`npm run test` を実行すると、Vitest はデフォルトでプロジェクトの変更を**監視**します。

## 最初の Vitest ユニットテストを作成する

まず、`<Page />` コンポーネントが正常にレンダリングするかどうかをチェックするテストを作成することで、すべてが機能していることを確認してください：

```tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```tsx title="__tests__/page.test.tsx"
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

> **Good to know**: 上記の例では、一般的な`__tests__`の規約を使用していますが、テストファイルを `app` router 内に配置することもできます。

## テストを実行する

そして、以下のコマンドを実行してテストを実行します：

```bash title="Terminal"
npm run test
# or
yarn test
# or
pnpm test
# or
bun test
```

## 追加資料

以下の資料が役に立つかもしれませんのでご参照ください：

- [Next.js with Vitest example](https://github.com/vercel/next.js/tree/canary/examples/with-vitest)
- [Vitest Docs](https://vitest.dev/guide/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
