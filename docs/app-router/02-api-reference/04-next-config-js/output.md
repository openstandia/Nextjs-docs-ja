---
title: output
description: Next.jsは、アプリケーションの簡単なデプロイを可能にするために、自動的に各ページが必要とするファイルをトレースします。こちらでその仕組みを学びましょう。
sidebar_position: 21
---

ビルド中、Next.jsは各ページとその依存関係を自動的にトレースし、実運用バージョンのアプリケーションをデプロイするために必要なすべてのファイルを特定します。

この機能により、デプロイのサイズを大幅に削減できます。以前は、Docker でデプロイする場合、`next start` を実行するためにパッケージの `dependencies` からすべてのファイルをインストールする必要がありました。
Next.js 12からは、`.next/` ディレクトリの Output File Tracing を活用して、必要なファイルだけを含めることができます。

さらに、様々な問題を引き起こし不必要な重複を生み出す可能性のある、非推奨の `serverless` ターゲットの必要性もなくなります。

## 仕組み

`next build` では、Next.js は [`@vercel/nft`](https://github.com/vercel/nft)を使用して、`import`、`require`、および `fs` の使用状況を静的に分析し、ページが読み込む可能性のあるすべてのファイルを決定します。

Next.jsの本番サーバーも、必要なファイルをトレースして `.next/next-server.js.nft.json` に出力します。

`.next` 出力ディレクトリに出力された `.nft.json` ファイルを活用するには、各トレースで `.nft.json` ファイルに相対するファイルのリストを読み、デプロイ場所にコピーします。

## トレースしたファイルを自動的にコピーする

Next.js は、`node_modules` 内の選択されたファイルを含め、本番デプロイに必要なファイルのみをコピーする `standalone` フォルダを自動的に作成することができます。

この自動コピーを利用するには、`next.config.js` で有効にします:

```js title="next.config.js"
module.exports = {
  output: 'standalone',
}
```

これにより、`.next/standalone` にフォルダが作成され、`node_modules` をインストールすることなく単独でデプロイできるようになります。

さらに、`next start` の代わりに使用できる最小限の `server.js` ファイルも出力されます。
この最小限のサーバーは、デフォルトでは `public` フォルダや `.next/static` フォルダをコピーしません。
これらのフォルダはCDNによって処理されるのが理想的ですが、手動で `standalone/public` フォルダや `standalone/.next/static` フォルダにコピーすることもできます。
その後、`server.js` ファイルはこれらを自動で提供します。

> **Good to know**:
>
> - プロジェクトが特定のポートまたはホスト名をリッスンする必要がある場合は、`server.js` を実行する前に `PORT` または `HOSTNAME` 環境変数を定義することができます。例えば、`http://0.0.0.0:8080` でサーバーを起動するには、`PORT=8080 HOSTNAME=0.0.0.0 node server.js` を実行します。
> - デフォルトの `loader` で[画像最適化](/docs/app-router/building-your-application/optimizing/images)を使用するプロジェクトの場合、依存関係として `sharp` をインストールする必要があります:

```bash title="Terminal"
npm i sharp
```

```bash title="Terminal"
yarn add sharp
```

```bash title="Terminal"
pnpm add sharp
```

```bash title="Terminal"
bun add sharp
```

## 注意事項

- モノレポセットアップでのトレースでは、デフォルトでプロジェクトディレクトリがトレースに使用されます。`next build packages/web-app` の場合、`packages/web-app` がトレースルートになり、そのフォルダの外にあるファイルはインクルードされません。このフォルダ外のファイルを含めるには、`next.config.js` で `experimental.outputFileTracingRoot` を設定します。

```js title="packages/web-app/next.config.js"
module.exports = {
  experimental: {
    // これは、2つ上のディレクトリにあるmonorepoベースのファイルを含む。
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}
```

- Next.js が必要なファイルをインクルードできなかったり、誤って未使用のファイルをインクルードしたりする場合があります。そのような場合は、`next.config.js` でそれぞれ `experimental.outputFileTracingExcludes` と `experimental.outputFileTracingIncludes` を利用できます。各configは、特定のページにマッチさせるためのキーとして [minimatch globs](https://www.npmjs.com/package/minimatch) を持つオブジェクトを受け入れ、トレースにインクルードまたは除外するためにプロジェクトのルートからの相対グロブを持つ配列の値を受け入れます。

```js title="next.config.js"
module.exports = {
  experimental: {
    outputFileTracingExcludes: {
      '/api/hello': ['./un-necessary-folder/**/*'],
    },
    outputFileTracingIncludes: {
      '/api/another': ['./necessary-folder/**/*'],
    },
  },
}
```

- 現在のところ、Next.js は生成された `.nft.json` ファイルに対して何もしません。このファイルは、たとえば [Vercel](https://vercel.com) などのデプロイメントプラットフォームで読み込んで、最小限のデプロイメントを作成する必要があります。将来のリリースでは、これらの `.nft.json` ファイルを利用する新しいコマンドを予定しています。

## 実験的 `turbotrace`

依存関係のトレースは、非常に複雑な計算と分析を必要とするため、時間がかかることがあります。私たちは、JavaScriptの実装に代わる、より高速でスマートなものとして、Rustで `turbotrace` を作成しました。

これを有効にするには、`next.config.js` に以下の設定を追加します:

```js title="next.config.js"
module.exports = {
  experimental: {
    turbotrace: {
      // turbotrace のログレベルを制御します。デフォルトは `error`です。
      logLevel?:
      | 'bug'
      | 'fatal'
      | 'error'
      | 'warning'
      | 'hint'
      | 'note'
      | 'suggestions'
      | 'info',
      // turbotrace のログに解析の詳細を含めるかどうかを制御します。デフォルトは`false`です。
      logDetail?: boolean
      // すべてのログメッセージを無制限に表示する turbotraceは、デフォルトでは各カテゴリに対して1つのログメッセージしか表示しません。
      logAll?: boolean
      // コンテキストディレクトリの外にある turbotrace ファイルのコンテキストディレクトリをトレースしないように制御します。
      // `experimental.outputFileTracingRoot` を設定すると `experimental.outputFileTracingRoot` とこのオプションの両方が設定されている場合、
      // `experimental.turbotrace.contextDirectory` が使用されます。
      contextDirectory?: string
      // コード中に `process.cwd()` 式がある場合、このオプションを設定することで、トレース中に `process.cwd()` の値を `turbotrace` に伝えることができます。
      // 例えば、require(process.cwd() + '/package.json')はrequire('/path/to/cwd/package.json')としてトレースされます。
      processCwd?: string
      // turbotrace` の最大メモリ使用量を `MB` 単位で指定します。デフォルトは `6000` です。
      memoryLimit?: number
    },
  },
}
```
