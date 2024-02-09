---
title: ESLint
description: Next.jsはデフォルトで統合されたESLint体験を提供します。これらのコンフォーマンスルールは、Next.jsを最適な方法で使用するのに役立ちます。
---

Next.jsはデフォルトで統合された[ESLint](https://eslint.org/)体験を提供しています。`package.json`に`next lint`というスクリプトを追加してください：

```json title="package.json"
{
  "scripts": {
    "lint": "next lint"
  }
}
```

その後、`npm run lint`または`yarn lint`を実行してください：

```bash title="Terminal"
yarn lint
```

もしすでにESLintがアプリケーションに設定されていない場合は、インストールと設定のプロセスについて案内されます。

```bash title="Terminal"
yarn lint
```

> 以下のようなプロンプトが表示されます：
>
> ? How would you like to configure ESLint?
>
> ❯ Strict (recommended)  
> Base  
> Cancel

次の3つのオプションのいずれかを選択できます：

- **Strict**: Next.jsの基本的なESLint設定に、より厳密な[Core Web Vitals ルールセット](#core-web-vitals)が含まれています。これは、はじめてESLintを設定する開発者に推奨される設定です

  ```json title=".eslintrc.json"
  {
    "extends": "next/core-web-vitals"
  }
  ```

- **Base**: Next.jsの基本的なESLint設定が含まれています

  ```json title=".eslintrc.json"
  {
    "extends": "next"
  }
  ```

- **Cancel**: 任意のESLint設定は含まれません。独自のカスタムESLint設定を設定する予定の場合にのみ、このオプションを選択してください

<!-- textlint-disable -->

2つの設定のうちいずれかが選択されると、`eslint`と`eslint-config-next`を依存関係のインストールとプロジェクトルートに`.eslintrc.json`が作成され、選択した設定が含まれるようになります。

<!-- textlint-enable -->

ESLintを実行してエラーをキャッチしたい場合は、`next lint`コマンドを実行できます。ESLintが設定された後は、ビルド（`next build`）ごとに自動的に実行されます。エラーはビルドを失敗させ、警告は失敗させません。

> `next build`中に ESLint を実行したくない場合は、[ESLintを無視する](/docs/app-router/api-reference/next-config-js/eslint)を参照してください。

開発中に警告やエラーをコードエディタで直接表示するため、適切に[統合](https://eslint.org/docs/user-guide/integrations#editors)することをお勧めします。

## ESLintの設定

デフォルトの設定（`eslint-config-next`）には、Next.jsで最適な初期設定のリンティング体験に必要なすべてが含まれています。アプリケーションでまだESLintを設定していない場合は、この設定とともに`next lint`を使用してESLintを設定することをお勧めします。

> `eslint-config-next`を他のESLint設定と併用したい場合は、[追加の設定](#カスタム設定)セクションを参照して、衝突を引き起こさずに行う方法を学びましょう。

次のESLintプラグインの推奨ルールセットは、すべて`eslint-config-next`内で使用されています：

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

これは`next.config.js`の設定より優先されます。

## ESLint プラグイン

Next.jsは、アプリケーションの一般的な問題を検出できるESLintプラグイン[`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)を提供しています。ルールは以下のとおりです。

✅ 推奨設定で有効化されています

|     | ルール                                                                                                                     | 説明                                                                                                               |
| :-: | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ✅  | [@next/next/google-font-display](/docs/app-router/google-font-display)                                                     | Google Fontsでのfont-displayの挙動を強制します。                                                                   |
| ✅  | [@next/next/google-font-preconnect](/docs/app-router/google-font-preconnect)                                               | Google Fontsで`preconnect`が使用されていることを保証します。                                                       |
| ✅  | [@next/next/inline-script-id](/docs/app-router/inline-script-id)                                                           | インラインコンテンツを含む`next/script`コンポーネントに`id`属性を強制します。                                      |
| ✅  | [@next/next/next-script-for-ga](/docs/app-router/next-script-for-ga)                                                       | Google Analyticsでインラインスクリプトを使用する場合は、`next/script`コンポーネントを使用することを推奨します。    |
| ✅  | [@next/next/no-assign-module-variable](/docs/app-router/no-assign-module-variable)                                         | `module`変数への代入を禁止します。                                                                                 |
| ✅  | [@next/next/no-async-client-component](/docs/app-router/no-async-client-component)                                         | Client Componentを非同期関数にすることを防止します。                                                               |
| ✅  | [@next/next/no-before-interactive-script-outside-document](/docs/app-router/no-before-interactive-script-outside-document) | `pages/_document.js`の外で`next/script`の`beforeInteractive`ストラテジーを使用することを防止します。               |
| ✅  | [@next/next/no-css-tags](/docs/app-router/no-css-tags)                                                                     | 手動でスタイルシートタグの使用を防止します。                                                                       |
| ✅  | [@next/next/no-document-import-in-page](/docs/app-router/no-document-import-in-page)                                       | `pages/_document.js`の外で`next/document`のインポートを防止します。                                                |
| ✅  | [@next/next/no-duplicate-head](/docs/app-router/no-duplicate-head)                                                         | `pages/_document.js`での`<Head>`の重複使用を防止します。                                                           |
| ✅  | [@next/next/no-head-element](/docs/app-router/no-head-element)                                                             | `<head>`要素の使用を防止します。                                                                                   |
| ✅  | [@next/next/no-head-import-in-document](/docs/app-router/no-head-import-in-document)                                       | `pages/_document.js`での`next/head`の使用を防止します。                                                            |
| ✅  | [@next/next/no-html-link-for-pages](/docs/app-router/no-html-link-for-pages)                                               | 内部のNext.jsページにアクセスするための`<a>`要素の使用を防止します。                                               |
| ✅  | [@next/next/no-img-element](/docs/app-router/no-img-element)                                                               | LCPの低下と帯域幅の増加のため`<img>`要素の使用を防止します。                                                       |
| ✅  | [@next/next/no-page-custom-font](/docs/app-router/no-page-custom-font)                                                     | ページ専用のカスタムフォントを防止します。                                                                         |
| ✅  | [@next/next/no-script-component-in-head](/docs/app-router/no-script-component-in-head)                                     | `next/head`コンポーネント内での`next/script`の使用を防止します。                                                   |
| ✅  | [@next/next/no-styled-jsx-in-document](/docs/app-router/no-styled-jsx-in-document)                                         | `pages/_document.js`での`styled-jsx`の使用を防止します。                                                           |
| ✅  | [@next/next/no-sync-scripts](/docs/app-router/no-sync-scripts)                                                             | 同期スクリプトを防止します。                                                                                       |
| ✅  | [@next/next/no-title-in-document-head](/docs/app-router/no-title-in-document-head)                                         | `next/document`の`Head`コンポーネントでの`<title>`の使用を防止します。                                             |
| ✅  | @next/next/no-typos                                                                                                        | [Next.jsのデータフェッチ関数](/docs/pages/building-your-application/data-fetching)でのよくあるタイポを防止します。 |
| ✅  | [@next/next/no-unwanted-polyfillio](/docs/app-router/no-unwanted-polyfillio)                                               | Polyfill.ioからの重複したポリフィルの使用を防止します。                                                            |

すでにアプリケーションでESLintを設定している場合は、`eslint-config-next`を含めるのではなく、直接このプラグインを拡張することをおすすめします。詳しくは、[Recommended Plugin Ruleset](#recommended-plugin-ruleset)を参照してください。

### カスタム設定

#### `rootDir`

もし`eslint-plugin-next`を、Next.jsがルートディレクトリにインストールされていない（つまり、monorepoの場合）プロジェクトで使用している場合、`.eslintrc`の`settings`プロパティを使用して、`eslint-plugin-next`にNext.jsアプリケーションの場所を教えることができます。

```json title=".eslintrc.json"
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

`rootDir`は、パス（相対パスまたは絶対パス）、グロブ（つまり、 `"packages/*/"`）、またはパスと/またはグロブの配列にできます。

## カスタムディレクトリとファイルのリント

デフォルトでは、Next.jsは`pages/`、`app/`、`components/`、`lib/`、および`src/`ディレクトリ内のすべてのファイルに対してESLintを実行します。ただし、本番ビルド（`next build`）中に使用するディレクトリを`next.config.js`の`eslint`構成の`dirs`オプションで指定できます。

```js title="next.config.js"
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], // 本番ビルド（next build）中に 'pages' ディレクトリと 'utils' ディレクトリのみでESLintを実行する
  },
}
```

同様に、`next lint`で特定のディレクトリとファイルのリントを行うために `--dir` および `--file` オプションが使用できます。

```bash title="Terminal"
next lint --dir pages --dir utils --file bar.js
```

## キャッシュ

ESLintで処理されたファイルの情報は、デフォルトでキャッシュされ、パフォーマンスが向上します。これは`.next/cache`に保存されるか、定義された[ビルドディレクトリ](/docs/app/api-reference/next-config-js/distDir)に保存されます。単一のソースファイルの内容を超えるESLintルールが含まれており、キャッシュを無効にする必要がある場合は、`next lint`に`--no-cache`フラグを使用してください。

`Terminal`ブロック：

```bash title="Terminal"
next lint --no-cache
```

## ルールの無効化

サポートされているプラグイン（`react`、`react-hooks`、`next`）が提供するルールを変更または無効化したい場合は、`.eslintrc`の`rules`プロパティを直接変更できます。

`.eslintrc.json`:

```json title=".eslintrc.json"
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### Core Web Vitals

`next lint`がはじめて実行され、**strict**オプションが選択された場合、`next/core-web-vitals`ルールセットが有効になります。

`.eslintrc.json`:

```json title=".eslintrc.json"
{
  "extends": "next/core-web-vitals"
}
```

`next/core-web-vitals`は、[Create Next App](/docs/app/api-reference/create-next-app)で構築された新しいアプリケーションに自動的に追加されるエントリポイントです。

## 他のツールとの使用方法

### Prettier

ESLintにはコードのフォーマットルールも含まれており、既存の[Prettier](https://prettier.io/)のセットアップと競合することがあります。ESLintとPrettierが連携するために、ESLintの構成に[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)を追加することをおすすめします。

まず、依存関係をインストールします。

`Terminal`ブロック：

```bash title="Terminal"
npm install --save-dev eslint-config-prettier

yarn add --dev eslint-config-prettier

pnpm add --save-dev eslint-config-prettier

bun add --dev eslint-config-prettier
```

次に、既存のESLint構成に`prettier`を追加します。

`.eslintrc.json`:

```json title=".eslintrc.json"
{
  "extends": ["next", "prettier"]
}
```

### lint-staged

[lint-staged](https://github.com/okonet/lint-staged)と`next lint`を組み合わせて、ステージングされたgitファイル上でリンタを実行したい場合は、プロジェクトのルートにある`.lintstagedrc.js`ファイルに以下を追加する必要があります。これにより、`--file`フラグの使用を指定します。

`.lintstagedrc.js`:

```js title=".lintstagedrc.js"
const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## 既存の設定の移行

### 推奨されるプラグインの規則セット

すでにアプリケーションでESLintが設定されており、次のいずれかの条件が当てはまる場合は、以下をお勧めします。

- すでに以下のプラグインがインストールされている場合（個別にインストールされているか、`airbnb`や`react-app`などの異なる設定を通じてインストールされている場合）：
  - `react`
  - `react-hooks`
  - `jsx-a11y`
  - `import`
- BabelがNext.js内でどのように構成されているかとは異なる特定の`parserOptions`が定義されている場合（これは[カスタムのBabel設定](/docs/pages/building-your-application/configuring/babel)をしている場合を除き、推奨されません）
- `eslint-plugin-import`がNode.jsおよび/またはTypeScriptの[resolvers](https://github.com/benmosher/eslint-plugin-import#resolvers)がインストールされ、importを処理するために定義されている場合

その場合は、これらの設定を削除するか、[`eslint-config-next`](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js)によって設定されたプロパティの方法が好みの場合は、直接Next.js ESLintプラグインを拡張することをお勧めします。

```js
module.exports = {
  extends: [
    // ...
    'plugin:@next/next/recommended',
  ],
}
```

プラグインは通常のようにプロジェクトにインストールできます。`next lint`を実行する必要はありません。

```bash title="Terminal"
npm install --save-dev @next/eslint-plugin-next

yarn add --dev @next/eslint-plugin-next

pnpm add --save-dev @next/eslint-plugin-next

bun add --dev @next/eslint-plugin-next
```

これにより、複数の設定で同じプラグインやパーサーをインポートした場合に発生する衝突やエラーのリスクがなくなります。

### 追加の設定

独立したESLintの設定をすでに使用しており、`eslint-config-next`を含めたい場合は、他の設定の後に最後に拡張するようにしてください。例えば：

```json title=".eslintrc.json"
{
  "extends": ["eslint:recommended", "next"]
}
```

`next`の設定はすでに`parser`、`plugins`、`settings`プロパティのデフォルト値を設定しています。特定の設定が必要な場合を除いて、これらのプロパティを手動で再宣言する必要はありません。

他の共有設定を含める場合は、**これらのプロパティが上書きまたは変更されないようにする必要があります**。それ以外の場合は、上記のように`next`設定と同じ振る舞いを共有するものは削除するか、Next.js ESLintプラグインから直接拡張することをお勧めします。
