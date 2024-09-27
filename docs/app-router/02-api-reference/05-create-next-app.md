---
title: create-next-app
description: create-next-app を使って、Next.js アプリを一つのコマンドで作成します。
---

Next.js を使い始めるもっとも簡単な方法は、`create-next-app`を使うことです。この CLI ツールを使うと、Next.js アプリケーションのビルドをすばやく開始できます。

デフォルトの Next.js テンプレートを使っても、[公式の Next.js サンプル](https://github.com/vercel/next.js/tree/canary/examples)を使っても、新しいアプリケーションを作成できます。

### 対話的なプロジェクトの作成

`create-next-app`を実行することで、対話的に新しいプロジェクトを作成できます：

```bash title="Terminal"
npx create-next-app@latest
```

```bash title="Terminal"
yarn create next-app
```

```bash title="Terminal"
pnpm create next-app
```

```bash title="Terminal"
bunx create-next-app
```

```bash title="Terminal"
What is your project named?  my-app
Would you like to use TypeScript?  No / Yes
Would you like to use ESLint?  No / Yes
Would you like to use Tailwind CSS?  No / Yes
Would you like to use `src/` directory?  No / Yes
Would you like to use App Router? (recommended)  No / Yes
Would you like to customize the default import alias?  No / Yes
```

プロンプトに回答していくと、答えに応じて正しい設定で新しいプロジェクトが作成されます。

### 非対話的なプロジェクトの作成

コマンドライン引数を渡して、新しいプロジェクトの非対話的なセットアップもできます。

さらに、デフォルトのオプションの前に`--no-`を付けることで、デフォルトのオプションを無効にできます（例：`--no-eslint`）。

```bash title="Terminal"
Usage: create-next-app <project-directory> [options]

Options:
  -V, --version                        output the version number
  --ts, --typescript

    Initialize as a TypeScript project. (default)

  --js, --javascript

    Initialize as a JavaScript project.

  --tailwind

    Initialize with Tailwind CSS config. (default)

  --eslint

    Initialize with ESLint config.

  --app

    Initialize as an App Router project.

  --src-dir

    Initialize inside a `src/` directory.

  --import-alias <alias-to-configure>

    Specify import alias to use (default "@/*").

  --use-npm

    Explicitly tell the CLI to bootstrap the app using npm

  --use-pnpm

    Explicitly tell the CLI to bootstrap the app using pnpm

  --use-yarn

    Explicitly tell the CLI to bootstrap the app using Yarn

  --use-bun

    Explicitly tell the CLI to bootstrap the app using Bun

  -e, --example [name]|[github-url]

    An example to bootstrap the app with. You can use an example name
    from the official Next.js repo or a public GitHub URL. The URL can use
    any branch and/or subdirectory

  --example-path <path-to-example>

    In a rare case, your GitHub URL might contain a branch name with
    a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
    In this case, you must specify the path to the example separately:
    --example-path foo/bar

  --reset-preferences

    Explicitly tell the CLI to reset any stored preferences

  -h, --help                           output usage information
```

### Create Next App を使う理由

`create-next-app`を使うと、新しい Next.js アプリを数秒で作成できます。Next.js の開発者によって公式にメンテナンスされており、さまざまな利点があります：

- **インタラクティブな体験**：`npx create-next-app@latest`を（引数なしで）実行すると、プロジェクトのセットアップをガイドするインタラクティブなエクスペリエンスが起動します
- **依存関係ゼロ**：プロジェクトの初期化はわずか 1 秒で完了します。Create Next App には依存関係がありません
- **オフラインサポート**：Create Next App は、オフラインであることを自動的に検出し、ローカルパッケージのキャッシュを使用してプロジェクトを開始します
<!-- textlint-disable -->
- **サンプルのサポート**：Create Next App は、Next.js のサンプル集（例： `npx create-next-app --example api-routes`）または任意の公開 GitHub リポジトリを使用してアプリケーションを開始できます
<!-- textlint-enable -->
- **テスト済み**：このパッケージは Next.js のモノレポの一部であり、Next.js 自身と同じ統合テストスイートを使ってテストされています
