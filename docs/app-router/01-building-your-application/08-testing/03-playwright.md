---
title: Playwright
sidebar_label: Playwright
description: エンドツーエンド（E2E）テストのために Next.js で Playwright をセットアップする方法を学びます。
---

Playwright は、Chromium、Firefox、WebKit を単一の API で自動化できるテストフレームワークです。**E2E（エンドツーエンド）テスト**を記述するために使用できます。このガイドでは、Next.js で Playwright をセットアップし、最初のテストを書く方法を紹介します。

## クイックスタート

一番早く始めるには、`create-next-app` を [with-playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)と一緒に使うことです。これで、Playwright が設定された Next.js プロジェクトが作成されます。

```bash title="Terminal"
npx create-next-app@latest --example with-playwright with-playwright-app
```

## 手動セットアップ

Playwright をインストールするには、以下のコマンドを実行します:

```bash title="Terminal"
npm init playwright
# or
yarn create playwright
# or
pnpm create playwright
```

`playwright.config.ts` ファイルの追加など、プロジェクト用に Playwright をセットアップして設定するための一連のプロンプトが表示されます。ステップバイステップのガイドについては、[Playwright インストールガイド](https://playwright.dev/docs/intro#installation)を参照してください。

## 最初の Playwright E2E テストを作成する

2 つの 新しい Next.js のページを作成します:

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

```tsx title="app/about/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  )
}
```

次に、ナビゲーションが正しく動作していることを確認するためのテストを追加します:

```ts title="tests/example.spec.ts"
import { test, expect } from '@playwright/test'

test('should navigate to the about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  // Find an element with the text 'About' and click on it
  await page.click('text=About')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:3000/about')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h1')).toContainText('About')
})
```

> **Good to know**:
>
> `playwright.config.ts` [設定ファイル](https://playwright.dev/docs/test-configuration)に [`"baseURL":"http://localhost:3000"`](https://playwright.dev/docs/api/class-testoptions#test-options-base-url) を追加すれば、`page.goto("http://localhost:3000/")`の代わりに `page.goto("/")`を使うことができます。

### Playwright のテストを実行する

Playwright は、3 つのブラウザ（Chromium、 Firefox、Webkit）を使ってアプリケーションをナビゲートするユーザをシミュレートします。このためには、Next.js サーバーが動作している必要があります。アプリケーションの動作をより忠実に再現するために、実運用コードに対してテストを実行することをお勧めします。

`npm run build` と `npm run start` を実行し、別のターミナルウィンドウで `npx playwright test` を実行して Playwright テストを実行します。

> **Good to know**: または、[webServer](https://playwright.dev/docs/test-webserver/) 機能を使って、Playwright に開発サーバーを起動させ、完全に利用可能になるまで待つこともできます。

### 継続的インテグレーション（CI）で Playwright を実行する

Playwright はデフォルトで[ヘッドレスモード](https://playwright.dev/docs/ci#running-headed)でテストを実行します。Playwright の依存関係をすべてインストールするには、`npx playwright install-deps` を実行します。

Playwright と継続的インテグレーションについては、以下のリソースを参照してください:

- [Next.js with Playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)
- [Playwright on your CI provider](https://playwright.dev/docs/ci)
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
