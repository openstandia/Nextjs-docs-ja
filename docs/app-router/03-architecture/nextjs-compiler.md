---
title: Next.js コンパイラ
description: Rust で書かれた Next.js コンパイラは Next.jsアプリケーションを変換し最小化します
---

[SWC](https://swc.rs/) を使って Rust で書かれた Next.js コンパイラは、Next.js が JavaScript コードを変換し、最小化することを可能にします。
これは、個々のファイルのための Babel と、出力バンドルのミニ化のための Terser を置き換えるものです。

Next.js コンパイラを使ったコンパイルは Babel の 17 倍速く、Next.js バージョン 12 からデフォルトで有効になっています。
既存の Babel コンフィギュレーションがある場合、または[サポートされていない機能](#サポートされていない機能)を使用している場合、アプリケーションは Next.js コンパイラをオプトアウトし、引き続き Babel を使用します。

## なぜ SWC なのか

[SWC](https://swc.rs/) は、次世代の高速開発者ツールのための拡張可能な Rust ベースのプラットフォームです。

SWC は、コンパイル、最小化、バンドルなどに使用でき、拡張できるように設計されています。
SWC は、コード変換（組み込みまたはカスタム）を実行するために呼び出すことができます。
これらの変換の実行は、Next.js のような高レベルのツールを介して行われます。

私たちが SWC を選んだ理由はいくつかあります:

- **拡張性**: SWC は、ライブラリをフォークしたり、設計上の制約を回避したりすることなく、Next.js の内部で Crate として使用できます。
- **パフォーマンス**: SWC に切り替えることで、Next.js の ファストリフレッシュを～3倍、ビルドを～5倍高速化することができました。
- **WebAssembly**: Rust の WASM サポートは、あらゆるプラットフォームをサポートし、Next.js の開発をあらゆる場所で行うために不可欠です。
- **コミュニティ**: Rust のコミュニティとエコシステムは素晴らしく、今も成長を続けています。

## サポートされている機能

### Styled Components

`babel-plugin-styled-components` を Next.js コンパイラに移植する作業を行います。

まず、`npm install next@latest` で Next.js を最新バージョンにアップデートします。次に `next.config.js` ファイルを更新します:

```js title="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

高度な使用例では、スタイル付きコンポーネントのコンパイル用に個別のプロパティを設定できます。

> 注: `minify`、`transpileTemplateLiterals`、`pure` はまだ実装されていません。進捗状況は[こちら](https://github.com/vercel/next.js/issues/30802)で確認できます。`ssr` と `displayName` は、Next.js で `styled-components` を使用するための主な設定です。

```js title="next.config.js"
module.exports = {
  compiler: {
    // オプションの詳細についてはhttps://styled-components.com/docs/tooling#babel-plugin を参照してください。
    styledComponents: {
      // 開発環境ではデフォルトで有効ですが、本番環境ではファイルサイズを小さくするために無効にします。
      // これを設定すると全ての環境のデフォルトが上書きされます。
      displayName?: boolean,
      // デフォルトは true です。
      ssr?: boolean,
      // デフォルトは true です。
      title?: boolean,
      // デフォルトは空です。
      topLevelImportPaths?: string[],
      // デフォルトは ["index"] です。
      meaninglesstitles?: string[],
      // デフォルトは true です。
      cssProp?: boolean,
      // デフォルトは空です。
      namespace?: string,
      // まだサポートされていません。
      minify?: boolean,
      // まだサポートされていません。
      transpileTemplateLiterals?: boolean,
      // まだサポートされていません。
      pure?: boolean,
    },
  },
}
```

### Jest

Next.js コンパイラはテストをトランスパイルし、Jest と Next.js の設定を簡素化します:

- `.css`、`.module.css` (およびその `.scss` variants)、画像のインポートの自動モック
- SWCを使った `transform` の自動セットアップ
- `.env` (およびすべての variants ) を `process.env` にロード
- テストの解決とトランスフォームから `node_modules` を無視
- テスト解決から `.next` を無視
- 実験的なSWCトランスフォームを有効にするフラグの `next.config.js` を読込

まず、`npm install next@latest` で Next.js を最新バージョンにアップデートします。次に、`jest.config.js` ファイルを更新します:

```js title="jest.config.js"
const nextJest = require('next/jest')

// next.config.js と .env ファイルの読み込みを可能にする Next.js アプリへのパスを提供します。
const createJestConfig = nextJest({ dir: './' })

// Jestに渡したいカスタム設定
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfig は、next/jest が非同期で Next.js の設定を読み込めるようにするために、このようにエクスポートされます。
module.exports = createJestConfig(customJestConfig)
```

### Relay

[Relay](https://relay.dev/) のサポートを有効にします:

```js title="next.config.js"
module.exports = {
  compiler: {
    relay: {
      // relay.config.js と一致する必要があります。
      src: './',
      artifactDirectory: './__generated__',
      language: 'typescript',
      eagerEsModules: false,
    },
  },
}
```

> **Good to know**: Next.js では、`pages` ディレクトリにある JavaScript ファイルはすべてルートとみなされます。そのため、`relay-compiler` の場合は、ページの外で `artifactDirectory` の設定を指定する必要があります。そうしないと、`relay-compiler` は `__generated__` ディレクトリのソースファイルの隣にファイルを生成し、このファイルがルートとみなされ、プロダクションビルドが壊れてしまいます。

### React Properties の削除

JSX プロパティを削除できるようにします。これはテストによく使われます。`babel-plugin-react-remove-properties` に似ています。

デフォルトの正規表現 `^data-test` にマッチするプロパティを削除します:

```js title="next.config.js"
module.exports = {
  compiler: {
    reactRemoveProperties: true,
  },
}
```

カスタムプロパティを削除するには、以下のように設定します:

```js title="next.config.js"
module.exports = {
  compiler: {
    // ここで定義された正規表現は Rust で処理されるため、以下の構文とは異なります。
    // JavaScriptの `RegExp`s とは構文が異なります。https://docs.rs/regex を参照してください。
    reactRemoveProperties: { properties: ['^data-custom$'] },
  },
}
```

### Console の削除

この変換により、アプリケーションコード (`node_modules` ではありません) 内のすべての `console.*` 呼び出しを削除できます。
`babel-plugin-transform-remove-console` に似ています。

すべての `console.*` 呼び出しを削除します:

```js title="next.config.js"
module.exports = {
  compiler: {
    removeConsole: true,
  },
}
```

`console.error` 以外の `console.* `出力を削除します:

```js title="next.config.js"
module.exports = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
}
```

### Legacy Decorators

Next.js は、`jsconfig.json` または `tsconfig.json` の `experimentalDecorators`を自動的に検出します。
Legacy Decorators は、`mobx` のような古いバージョンのライブラリでよく使われます。

このフラグは、既存のアプリケーションとの互換性のためだけにサポートされています。新しいアプリケーションで Legacy Decorators を使うことはお勧めしません。

まず、`npm install next@latest` で Next.js を最新バージョンにアップデートします。次に、`jsconfig.json` または `tsconfig.json` ファイルを更新します:

```js
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### importSource

Next.js は、`jsconfig.json` または `tsconfig.json` 内の `jsxImportSource` を自動的に検出し、それを適用します。
これは、[Theme UI](https://theme-ui.com) のようなライブラリでよく使われます。

まず、`npm install next@latest` で Next.js を最新バージョンにアップデートします。次に、`jsconfig.json` または `tsconfig.json` ファイルを更新します:

```js
{
  "compilerOptions": {
    "jsxImportSource": "theme-ui"
  }
}
```

### Emotion

`@emotion/babel-plugin` を Next.js コンパイラに移植します。

まず、`npm install next@latest` で Next.js を最新バージョンにアップデートします。次に、`next.config.js` ファイルを更新します:

```js title="next.config.js"

module.exports = {
  compiler: {
    emotion: boolean | {
      // デフォルトはtrueです。ビルドタイプがproductionの場合は無効になります。
      sourceMap?: boolean,
      // デフォルトは 'dev-only' です。
      autoLabel?: 'never' | 'dev-only' | 'always',
      // デフォルトは '[local]' です。
      // 許可されている値: `[local]`、`[title]`、`[dirname]`
      // このオプションは autoLabel が 'dev-only'または'always'の場合にのみ機能します。
      // これにより、結果のラベルの書式を定義することができます。
      // フォーマットは文字列で定義され、変数部分は角括弧 [] で囲まれます。
      // 例えば labelFormat："my-classname--[local]"、ここで[local]は結果が代入される変数名に置き換えられます。
      labelFormat?: string,
      // デフォルトは undefined です。
      // このオプションを使うと、コンパイラがどの import を見て何をトランスフォームすべきかを判断するかを指定できます。
      // Emotion のエクスポートを再エクスポートする場合でも、トランスフォームを使用できます。
      importMap?: {
        [packageName: string]: {
          [exportName: string]: {
            canonicalImport?: [string, string],
            styledBaseImport?: [string, string],
          }
        }
      },
    },
  },
}
```

### Minification

Next.js の swc コンパイラーは、v13 からデフォルトで minification に使われています。これは Terser の 7 倍高速です。

何らかの理由でTerserがまだ必要な場合は、このように設定できます。

```js title="next.config.js"
module.exports = {
  swcMinify: false,
}
```

### Module Transpilation

Next.js は、ローカルパッケージ（ monorepos など）や外部依存関係（ `node_modules` ）から、依存関係を自動的にトランスパイルしてバンドルすることができます。
これは `next-transpile-modules` パッケージを置き換えるものです。

```js title="next.config.js"
module.exports = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}
```

### Modularize Imports

このオプションは、Next.js 13.5 の [`optimizePackageImports`](/docs/app-router/api-reference/next-config-js/optimizePackageImports) に取って代わられました。インポートパスを手動で設定する必要のない新しいオプションを使うようにアップグレードすることをお勧めします。

## 実験的な機能

### SWC トレースプロファイリング

SWC の内部変換トレースを Chromium の[トレースイベントフォーマット]((https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview?mode=html#%21=)として生成することができます。

```js title="next.config.js"
module.exports = {
  experimental: {
    swcTraceProfiling: true,
  },
}
```

有効にすると、swc は `.next/` の下に `swc-trace-profile-${timestamp}.json` という名前のトレースを生成します。
Chromium のトレースビューア(chrome://tracing/, https://ui.perfetto.dev/ )、または互換性のある flamegraph ビューア (https://www.speedscope.app/ )で、生成されたトレースを読み込んで可視化することができます。

### SWC プラグイン（実験的）

swc の transform は、wasm で書かれた SWC の実験的なプラグインサポートを使用して、変換の動作をカスタマイズするように設定することができます。

```js title="next.config.js"
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'plugin',
        {
          ...pluginOptions,
        },
      ],
    ],
  },
}
```

`swcPlugins` はプラグインを設定するためのタプルの配列を受け付けます。
プラグインのタプルはプラグインへのパスとプラグイン設定のためのオブジェクトを含みます。
プラグインへのパスは npm モジュールパッケージ名か、.wasm バイナリ自身への絶対パスです。

## サポートされていない機能

アプリケーションに `.babelrc` ファイルがある場合、Next.js は自動的に個々のファイルの変換に Babel を使用するようにフォールバックします。
これにより、カスタム Babel プラグインを活用する既存のアプリケーションとの後方互換性が保証されます。

カスタム Babel 設定を使用している場合は、[設定を共有してください](https://github.com/vercel/next.js/discussions/30174)。
私たちは、将来的にプラグインをサポートするだけでなくできるだけ多くの一般的に使用される Babel 変換を移植するために取り組んでいます。

## バージョン履歴

| Version   | Changes                                                                                                                                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.1.0` | [Module Transpilation](https://nextjs.org/blog/next-13-1#built-in-module-transpilation-stable) と [Modularize Imports](https://nextjs.org/blog/next-13-1#import-resolution-for-smaller-bundles) が安定版になりました。 |
| `v13.0.0` | SWC Minifier がデフォルトになりました。                                                                                                                                                                                |
| `v12.3.0` | SWC Minifier が[安定版](https://nextjs.org/blog/next-12-3#swc-minifier-stable)になりました。                                                                                                                           |
| `v12.2.0` | [SWC プラグイン](#swc-プラグイン実験的) サポートが実験的に追加されました。                                                                                                                                             |
| `v12.1.0` | Styled Components、Jest、Relay、Remove React Properties、Legacy Decorators、Remove Console、および jsxImportSource のサポートを追加しました。                                                                          |
| `v12.0.0` | Next.js コンパイラが[導入されました](https://nextjs.org/blog/next-12)。                                                                                                                                                |
