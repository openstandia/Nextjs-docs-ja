---
title: ESLint
description: Next.jsはデフォルトで統合されたESLintの体験を提供しています。これらの適合性ルールは、Next.jsを最適な方法で利用するのに役立ちます。
---

Next.js は、デフォルトで統合された [ESLint](https://eslint.org/) の体験を提供しています。`package.json` に `next lint` をスクリプトとして追加します:

```json title="package.json"
{
  "scripts": {
    "lint": "next lint"
  }
}
```

次に、`npm run lint`または`yarn lint`を実行します:

```bash title="Terminal"
yarn lint
```

まだアプリケーションで ESLint が設定されていない場合は、インストールと設定プロセスのガイドが始まります。

```bash title="Terminal"
yarn lint
```

> 以下のようなプロンプトが表示されます:
>
> ? How would you like to configure ESLint?
>
> ❯ Strict (recommended)
> Base
> Cancel

次の3つのオプションから1つを選択できます:

- **Strict**: Next.js のベースとなる ESLint 設定と、より厳格な[Core Web Vitals ルールセット](#core-web-vitals)が含まれます。ESLint のセットアップをはじめて行う開発者に推奨される設定です。
  ```json title=".eslintrc.json"
  {
    "extends": "next/core-web-vitals"
  }
  ```
- **Base**: Next.js のベースとなる ESLint 設定が含まれます。

  ```json title=".eslintrc.json"
  {
    "extends": "next"
  }
  ```

<!-- textlint-disable -->

- **Cancel**: ESLint の設定は何も含まれません。自身でカスタムの ESLint 設定する場合にのみ、このオプションを選択してください。
<!-- textlint-enable -->

<!-- textlint-disable -->

上2つの設定オプションのいずれかが選択された場合、Next.jsは自動的に`eslint`と`eslint-config-next`をアプリケーションの依存関係としてインストールし、選択した設定を含む`.eslintrc.json`ファイルをプロジェクトのルートに作成します。

<!-- textlint-enable -->

これで、エラーを検出するために ESLint を実行するたびに`next lint`を実行できます。ESLint がセットアップされると、すべてのビルド（`next build`）でも自動的に実行されます。エラーはビルドに失敗しますが、警告は失敗しません。

> `next build`中に ESLint を実行したくない場合は、[ESLintを無視する](/docs/app-router/api-reference/next-config-js/eslint)を参照してください。

開発中に直接コードエディターで警告とエラーを表示するために、適切な[インテグレーション](https://eslint.org/docs/user-guide/integrations#editors)を推奨します。

## ESLint Config

デフォルトの設定（`eslint-config-next`）には、Next.js で最適な Lint 体験を初期状態で持つために必要なすべてが含まれています。アプリケーションでまだ ESLint が設定されていない場合、この設定と一緒に`next lint`を使用して ESLint をセットアップすることを推奨します。

> `eslint-config-next`を他の ESLint の設定と一緒に使用したい場合は、[追加の設定](#追加の設定)セクションを参照して、衝突を引き起こさずにそれを行う方法を学んでください。

下記の ESLint プラグインから推奨されるルールセットはすべて`eslint-config-next`内で使用されています:

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

この設定は `next.config.js` の設定より優先されます。

## ESLint Plugin

Next.js では ESLint プラグイン、[`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next) を提供しており、ベースの設定内にすでにバンドルされています。Next.js アプリケーション内で一般的な問題や問題を検出できます。全ルールセットは以下のとおりです:

✅ 推奨設定では有効

|       | ルール                                                                                                                                     | 説明                                                                                                                          |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
|   ✅   | [@next/next/google-font-display](https://nextjs.org/docs/messages/google-font-display)                                                     | Google Fontsとのfont-displayの挙動を指定します                                                                                |
|   ✅   | [@next/next/google-font-preconnect](https://nextjs.org/docs/messages/google-font-preconnect)                                               | Google Fontsとの`preconnect`の使用を確認します                                                                                |
|   ✅   | [@next/next/inline-script-id](https://nextjs.org/docs/messages/inline-script-id)                                                           | インラインコンテンツに対する`next/script`コンポーネントの`id`属性を指定します                                                 |
|   ✅   | [@next/next/next-script-for-ga](https://nextjs.org/docs/messages/next-script-for-ga)                                                       | Google Analyticsのインラインスクリプトを使用する際には`next/script`コンポーネントを優先します                                 |
|   ✅   | [@next/next/no-assign-module-variable](https://nextjs.org/docs/messages/no-assign-module-variable)                                         | `module`変数への代入を防止します                                                                                              |
|   ✅   | [@next/next/no-async-client-component](https://nextjs.org/docs/messages/no-async-client-component)                                         | Client Componentが非同期関数であることを防止します                                                                            |
|   ✅   | [@next/next/no-before-interactive-script-outside-document](https://nextjs.org/docs/messages/no-before-interactive-script-outside-document) | `pages/_document.js`の外部で`next/script`の`beforeInteractive`戦略の使用を防止します                                          |
|   ✅   | [@next/next/no-css-tags](https://nextjs.org/docs/messages/no-css-tags)                                                                     | 手動のスタイルシートタグの使用を防止します                                                                                    |
|   ✅   | [@next/next/no-document-import-in-page](https://nextjs.org/docs/messages/no-document-import-in-page)                                       | `pages/_document.js`以外での`next/document`のインポートを防止します                                                           |
|   ✅   | [@next/next/no-duplicate-head](https://nextjs.org/docs/messages/no-duplicate-head)                                                         | `pages/_document.js`での`<Head>`の重複使用を防止します                                                                        |
|   ✅   | [@next/next/no-head-element](https://nextjs.org/docs/messages/no-head-element)                                                             | `<head>`要素の使用を防止します                                                                                                |
|   ✅   | [@next/next/no-head-import-in-document](https://nextjs.org/docs/messages/no-head-import-in-document)                                       | `pages/_document.js`での`next/head`の使用を防止します                                                                         |
|   ✅   | [@next/next/no-html-link-for-pages](https://nextjs.org/docs/messages/no-html-link-for-pages)                                               | 内部のNext.jsページに移動するための`<a>`要素の使用を防止します                                                                |
|   ✅   | [@next/next/no-img-element](https://nextjs.org/docs/messages/no-img-element)                                                               | LCPが遅くなるか、帯域幅が高くなる可能性があるため、`<img>`要素の使用を防止します                                              |
|   ✅   | [@next/next/no-page-custom-font](https://nextjs.org/docs/messages/no-page-custom-font)                                                     | ページ限定のカスタムフォントの使用を防止します                                                                                |
|   ✅   | [@next/next/no-script-component-in-head](https://nextjs.org/docs/messages/no-script-component-in-head)                                     | `next/head`コンポーネント内での`next/script`の使用を防止します                                                                |
|   ✅   | [@next/next/no-styled-jsx-in-document](https://nextjs.org/docs/messages/no-styled-jsx-in-document)                                         | `pages/_document.js`での`styled-jsx`の使用を防止します                                                                        |
|   ✅   | [@next/next/no-sync-scripts](https://nextjs.org/docs/messages/no-sync-scripts)                                                             | 同期スクリプトの使用を防止します                                                                                              |
|   ✅   | [@next/next/no-title-in-document-head](https://nextjs.org/docs/messages/no-title-in-document-head)                                         | `next/document`からの`Head`コンポーネントと一緒に使用される`<title>`の使用を防止します                                        |
|   ✅   | @next/next/no-typos                                                                                                                        | [Next.jsのfetch関数](https://nextjs.org/docs/pages/building-your-application/data-fetching)内の一般的なタイプミスを防止します |
|   ✅   | [@next/next/no-unwanted-polyfillio](https://nextjs.org/docs/messages/no-unwanted-polyfillio)                                               | Polyfill.ioからの重複したポリフィルの使用を防止します                                                                         |

アプリケーションですでに ESLint が設定されている場合、`eslint-config-next` を含めるのではなく、このプラグインから直接拡張することを推奨します。詳細については、[推奨されるプラグインのルールセット](#推奨されるプラグインのルールセット)を参照してください。

### カスタム設定

#### `rootDir`

<!-- textlint-disable -->
`eslint-plugin-next` をモノレポなど、Next.js がルートディレクトリにインストールされていないプロジェクトで使用している場合、`.eslintrc` の `settings` プロパティを使用して `eslint-plugin-next` にNext.jsのアプリケーションがどこにあるかを伝えることができます:
<!-- textlint-enable -->

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

`rootDir`はパス（相対または絶対）、glob（例えば `"packages/*/"`）、またはパスあるいは glob の配列を指定できます。

## カスタムディレクトリとファイルの Lint

デフォルトでは、Next.js は `pages/`、`app/`、`components/`、`lib/`、および`src/`ディレクトリ内のすべてのファイルで ESLint を実行します。しかし、`next.config.js`の`eslint`設定の`dirs`オプションを使用して、本番ビルドでどのディレクトリを対象にするかを指定できます:

```js title="next.config.js"
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], // 本番ビルド (next build) の間は、'pages' と 'utils' ディレクトリでのみ ESLint を実行します
  },
}
```

同様に、`next lint` に対して `--dir` フラグと `--file` フラグを使用して特定のディレクトリやファイルをリントできます:

```bash title="Terminal"
next lint --dir pages --dir utils --file bar.js
```

## キャッシング

パフォーマンス向上のため、ESLint が処理したファイルの情報はデフォルトでキャッシュされます。これは `.next/cache` または定義した[ビルドディレクトリ](/docs/app-router/api-reference/next-config-js/distDir)に格納されます。もし1つのソースファイルの内容以上に依存する ESLint ルールを含めており、キャッシュを無効にする必要がある場合は、`next lint`に`--no-cache`フラグを使用してください。

```bash title="Terminal"
next lint --no-cache
```

## ルールの無効化

サポートされているプラグイン（`react`、`react-hooks`、`next`）によって提供される任意のルールを変更・無効化したい場合、`.eslintrc`の`rules`プロパティを直接使用して変更できます:

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

`next/core-web-vitals` ルールセットは、`next lint` が最初に実行され、**strict** オプションが選択されたとき有効なります。

```json title=".eslintrc.json"
{
  "extends": "next/core-web-vitals"
}
```

`next/core-web-vitals`は、デフォルトでは警告となる数個のルールを、[Core Web Vitals](https://web.dev/vitals/)に影響する場合はエラーとするように`eslint-plugin-next`を更新します。

> 新しいアプリケーションを [Create Next App](/docs/app-router/api-reference/create-next-app) でビルドした場合、`next/core-web-vitals` エントリーポイントは自動的に含まれます。

## 他のツールとの使用

### Prettier

ESLintにはコードのフォーマット指定ルールも含まれていますが、すでに設定されている [Prettier](https://prettier.io/) と競合する可能性があります。そこで、ESLint と Prettier を一緒に動かすため、 ESLint の設定に[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)を含めることを推奨します。

まず、依存関係をインストールします:

```bash title="Terminal"
npm install --save-dev eslint-config-prettier

yarn add --dev eslint-config-prettier

pnpm add --save-dev eslint-config-prettier

bun add --dev eslint-config-prettier
```

次に、既存の ESLint の設定に `prettier` を追加します:

```json title=".eslintrc.json"
{
  "extends": ["next", "prettier"]
}
```

### lint-staged

`next lint` を [lint-staged](https://github.com/okonet/lint-staged) と同時に使い、ステージングされた git ファイル上でリンターを走らせたい場合があります。`--file` フラグの使用を明示するためにプロジェクト・ルートの `.lintstagedrc.js` ファイルに以下の内容を追加する必要があります。

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

### 推奨されるプラグインのルールセット

すでに ESLint がアプリケーションに設定されていて、以下の条件のうち1つ以上に当てはまる場合:

- 以下のプラグインのうち 1 つ以上がすでにインストールされている（`airbnb`や`react-app`などの別の設定を介してインストールされている場合も含む）:
  - `react`
  - `react-hooks`
  - `jsx-a11y`
  - `import`
- Babel が Next.js 内で設定されている方法と異なる特定の `parserOptions` が定義されている（Next.js の[Babelの設定をカスタマイズ](https://nextjs.org/docs/pages/building-your-application/configuring/babel)していない限り非推奨です）
- Node.js と `eslint-plugin-import`がインストールされている、あるいは TypeScript [リゾルバ](https://github.com/benmosher/eslint-plugin-import#resolvers)がインポートを処理するように定義されている

[`eslint-config-next`](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js) 内で上記のプロパティが設定された方法を優先する場合、上記設定のどれかを削除してください。または、直接 Next.js ESLint プラグインから拡張することを推奨します:

```js
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

プラグインは `next lint` を実行せずに通常通りプロジェクトへインストールできます:

```bash title="Terminal"
npm install --save-dev @next/eslint-plugin-next

yarn add --dev @next/eslint-plugin-next

pnpm add --save-dev @next/eslint-plugin-next

bun add --dev @next/eslint-plugin-next
```

これにより、同じプラグインやパーサーを複数の設定からインポートして生じる可能性のある衝突やエラーを避けることができます。

### 追加の設定

すでに別のESLintの設定を使用しており、`eslint-config-next`を含めたい場合、例えば以下のように、他の設定の後で最後に拡張されるよう設定してください:

```json title=".eslintrc.json"
{
  "extends": ["eslint:recommended", "next"]
}
```

`next`設定では`parser`、`plugins`、`settings`プロパティのデフォルト値の設定をすでに処理しています。使用ケースに応じてこれらのプロパティを手動で再宣言する必要はありません。

それ以外の共有設定を含める場合は、**これらのプロパティが上書きや修正されないように注意する必要があります**。そうでなければ、`next` 設定と同じ動作を共有する設定を削除するか、上記で述べたように Next.js ESLint プラグインから直接拡張することを推奨します。
