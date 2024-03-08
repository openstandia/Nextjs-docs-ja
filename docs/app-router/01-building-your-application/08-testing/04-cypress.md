---
title: Cypress
sidebar_label: Cypress
description: エンドツーエンド（E2E）とコンポーネントテストのために Next.js で Cypress をセットアップする方法を学びます。
---

[Cypress](https://www.cypress.io/) は**エンドツーエンド（E2E）**や**コンポーネントテスト**に使われるテストランナーです。このページでは、Next.js を使って Cypress をセットアップし、最初のテストを書く方法を紹介します。

> **Warning:**
>
> - **コンポーネントテスト**では、[Next.js バージョン 14](https://github.com/cypress-io/cypress/issues/28185) と `Async` Server Components をサポートしていません。これらの問題は現在追跡中です。現時点では、コンポーネントテストは Next.js バージョン 13 で動作し、`Async` Server Components の E2E テストを推奨します。
> - Cypress は現在、[TypeScript バージョン 5](https://github.com/cypress-io/cypress/issues/27731) の `moduleResolution: "bundler"` をサポートしていません。この問題は現在追跡中です。

## クイックスタート

[with-cypress example](https://github.com/vercel/next.js/tree/canary/examples/with-cypress) で `create-next-app` を使えば、すぐに始めることができます。

```bash title="Terminal"
npx create-next-app@latest --example with-cypress with-cypress-app
```

## 手動セットアップ

Cypress を手動でセットアップするには、dev dependencies に `cypress` をインストールします:

```bash title="Terminal"
npm install -D cypress
# or
yarn add -D cypress
# or
pnpm install -D cypress
```

cypress の `open` コマンドを `package.json` の scripts フィールドに追加します:

```json title="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "cypress:open": "cypress open"
  }
}
```

Cypress を初めて実行し、Cypress テストスイートを開きます:

```bash title="Terminal"
npm run cypress:open
```

**E2E テスト**および/または**コンポーネント テスト**の設定を選択できます。これらのオプションのいずれかを選択すると、プロジェクトに `cypress.config.js` ファイルと `cypress` フォルダが自動的に作成されます。

## 最初の Cypress テストを作成する

`cypress.config.js` ファイルに以下の設定があることを確認します:

```ts title="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

```js title="cypress.config.js"
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

次に、2 つの新しい Next.js ファイルを作成します:

```jsx title="app/page.js"
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

```jsx title="app/about/page.js"
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

ナビゲーションが正しく動作していることを確認するためのテストを追加します:

```js title="cypress/e2e/app.cy.js"
describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="about"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/about')

    // The new page should contain an h1 with "About"
    cy.get('h1').contains('About')
  })
})
```

### E2E テストを実行する

Cypress は、アプリケーションをナビゲートするユーザーをシミュレートします。これには、Next.js サーバーが動作している必要があります。アプリケーションの動作をより忠実に再現するために、プロダクションコードに対してテストを実行することをお勧めします。

`npm run build && npm run start` を実行して Next.js アプリケーションをビルドし、別のターミナルウィンドウで `npm run cypress:open` を実行して Cypress を起動し、E2E テストスイートを実行します。

> **Good to know:**
>
> - `cypress.config.js` 設定ファイルに `baseUrl: 'http://localhost:3000'`を追加することで、`cy.visit("http://localhost:3000/")`の代わりに `cy.visit("/")`を使用することができます。
> - また、`start-server-and-test` パッケージをインストールすると、Next.js 本番サーバーを Cypress と連携して実行できます。インストール後、`"start-server-and-test start http://localhost:3000 cypress"`を `package.json` の scripts フィールドに追加します。変更後はアプリケーションを再ビルドしてください。

## 最初の Cypress コンポーネントテストの作成

コンポーネント・テストは、アプリケーション全体をバンドルしたりサーバーを起動したりすることなく、特定のコンポーネントをビルドしてマウントします。

Cypress アプリで**コンポーネントテスト**を選択し、フロントエンド フレームワークとして **Next.js** を選択します。プロジェクトに `cypress/component` フォルダーが作成され、`cypress.config.js` ファイルがコンポーネントテストを有効にするように更新されます。

`cypress.config.js` ファイルが以下の設定になっていることを確認します:

```ts title="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

```js title="cypress.config.js"
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

前のセクションと同じコンポーネントを想定して、コンポーネントが期待される出力をレンダリングしていることを検証するテストを追加します:

```tsx title="cypress/component/about.cy.tsx"
import Page from '../../app/page'

describe('<Page />', () => {
  it('should render and display expected content', () => {
    // Mount the React component for the Home page
    cy.mount(<Page />)

    // The new page should contain an h1 with "Home"
    cy.get('h1').contains('Home')

    // Validate that a link with the expected URL is present
    // Following the link is better suited to an E2E test
    cy.get('a[href="/about"]').should('be.visible')
  })
})
```

> **Good to know**:
>
> - Cypress は現在、`Async` Server Components のコンポーネントテストをサポートしていません。E2E テストを使用することをお勧めします。
> - コンポーネントテストは Next.js サーバーを必要としないため、サーバーが利用可能であることに依存する`<Image />`のような機能は、そのままでは機能しない可能性があります。

### コンポーネントテストの実行する

ターミナルで `npm run cypress:open` を実行して、Cypress を起動し、コンポーネントテストスイートを実行します。

## 継続的インテグレーション（CI）

インタラクティブなテストに加えて、CI 環境に適した `cypress run` コマンドを使用してヘッドレスで Cypress を実行することもできます：

```json title="package.json"
{
  "scripts": {
    //...
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:headless": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "component": "cypress open --component",
    "component:headless": "cypress run --component"
  }
}
```

サ Cypress と継続的インテグレーションについては、以下のリソースで詳しく学ぶことができます:

- [Next.js with Cypress example](https://github.com/vercel/next.js/tree/canary/examples/with-cypress)
- [Cypress Continuous Integration Docs](https://docs.cypress.io/guides/continuous-integration/introduction)
- [Cypress GitHub Actions Guide](https://on.cypress.io/github-actions)
- [Official Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Cypress Discord](https://discord.com/invite/cypress)
