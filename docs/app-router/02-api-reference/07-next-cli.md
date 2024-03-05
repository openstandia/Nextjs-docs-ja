---
title: Next.js CLI
description: Next.js CLIは、アプリケーションの開始、ビルド、およびエクスポートを行うことができる便利なツールです。詳細については、こちらをご覧ください。
---

Next.js CLI を使用して、アプリケーションの起動、ビルド、エクスポートができます。

利用可能な CLI コマンドのリストを取得するには、プロジェクトディレクトリ内で次のコマンドを実行します：

```bash title="Terminal"
npx next -h
```

[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)は npm 5.2 以上で動作します）

以下のように出力されます：

```bash title="Ternmial"
Usage
  $ next <command>

Available commands
  build, start, export, dev, lint, telemetry, info

Options
  --version, -v   Version number
  --help, -h      Displays this message

For more information run a command with the --help flag
  $ next build --help
```

次のコマンドには任意の[Node.js への引数](https://nodejs.org/api/cli.html#cli_node_options_options)を渡すことができます：

```bash title="Terminal"
NODE_OPTIONS='--throw-deprecation' next
NODE_OPTIONS='-r esm' next
NODE_OPTIONS='--inspect' next
```

> **Good to know**: コマンドなしで`next`を実行することは、`next dev`を実行することと同じです。

## Build

`next build`はアプリケーションの最適化されたプロダクション・ビルドを作成します。出力には各ルートに関する情報が表示されます。

- **Size** - クライアントサイドのページへ移動するときにダウンロードされるアセットの数。各ルートのサイズには依存するコードのみが含まれる
- **First Load JS** - サーバーからページへアクセスしたときにダウンロードされたアセットの数。他のモジュールで共有される JS の量は別の指標として表示される

これらの値は両方とも**gzip で圧縮されています**。最初の負荷は緑、黄色、赤で示されます。パフォーマンス重視のアプリケーションでは緑を目指しましょう。

`next build`で、`--profile`フラグを使用して React のプロダクション用のプロファイリングを有効にできます。これには[Next.js 9.5 以降](https://nextjs.org/blog/next-9-5)が必要です：

```bash title="Ternminal"
next build --profile
```

その後は、開発時と同じようにプロファイラーを使うことができます。

`next build`で`--debug`フラグを使用すると、より詳細な出力を有効にできます。これには Next.js 9.5.3 以降が必要です：

```bash title="Ternminal"
next build --debug
```

このフラグを有効にすると、ビルド時にリライト、リダイレクト、ヘッダーなどの追加の出力が表示されます。

## Development

`next dev`は、ホット・リロード、エラーレポートなどを備えた開発モードでアプリケーションを起動します。

アプリケーションはデフォルトでは``で起動します。デフォルトのポートは`-p`で変更できます：

```bash title="Terminal"
PORT=4000 npx next dev
```

> **Good to know**: HTTP サーバーの起動は、他のコードが初期化される前に行われるため、`.env`で`PORT`を設定することはできません。

またホスト名をデフォルトの`0.0.0.0`とは異なるものに設定できます。これは、ネットワーク上の他のデバイスからアプリケーションを利用するのに便利です。デフォルトのホスト名は`-H`で変更できます：

```bash title="Terminal"
npx next dev -H 192.168.1.2
```

## Production

`next start`はプロダクション・モードでアプリケーションを起動します。アプリケーションは、まず`next build`でコンパイルする必要があります。

アプリケーションはデフォルトでは``で起動します。デフォルトのポートは`-p`フラグで変更できます：

```bash title="Terminal"
npx next start -p 4000
```

または環境変数`PORT`を使用します：

```bash title="Terminal"
PORT=4000 npx next start
```

> **Good to know**:
>
> - HTTP サーバーの起動は、他のコードが初期化される前に行われるため、`.env`で`PORT`を設定することはできません
> - `next start`は`output: 'standalone'`または`output：'export'`と一緒に使用できません

### キープアライブ・タイムアウト

<!-- textlint-disable -->

Next.js をダウンストリームのプロキシ（たとえば AWS ELB/ALB のようなロードバランサ）の背後にデプロイする場合、Next.js の基礎となる HTTP サーバーの[keep-alive-timeouts](https://nodejs.org/api/http.html#http_server_keepalivetimeout)を、ダウンストリームのプロキシのタイムアウトよりも大きく設定することが重要です。そうしないと、ある TCP 接続でキープアライブ・タイムアウトに達すると、Node.js はダウンストリームのプロキシに通知することなく、その接続を直ちに終了してしまいます。この結果、Node.js がすでに終了したコネクションを再利用しようとすると、必ずプロキシエラーが発生します。

<!-- textlint-enable -->

プロダクション用の Next.js サーバーのタイムアウト値を設定するには、`next start`に`--keepAliveTimeout`（ミリ秒）を渡します：

```bash title="Terminal"
npx next start --keepAliveTimeout 70000
```

## Lint

`next lint`は `pages/`、`app/`、`components/`、`lib/`、`src/`ディレクトリにあるすべてのファイルに対して ESLint を実行します。また ESLint がまだアプリケーションに設定されていない場合、必要な依存関係をインストールするためのガイド付きセットアップを提供します。

もし、他のディレクトリを lint したい場合は、`-dir`フラグで指定できます：

```bash title="Terminal"
next lint --dir utils
```

## テレメトリー（Telemetry）

Next.js は、一般的な使用状況に関する**完全に匿名の**テレメトリーデータを収集します。この匿名プログラムへの参加は任意であり、情報を共有したくない場合はオプトアウトできます。

テレメトリーの詳細については、[こちらのドキュメントを参照してください](https://nextjs.org/telemetry/)。

## Next Info

`next info`は、Next.js のバグを報告するために使用できる、システムに関する情報を表示します。OS のプラットフォーム/アーキテクチャ/バージョン、バイナリ（Node.js、npm、Yarn、pnpm）、npm パッケージのバージョン（`next`、`react`、`react-dom`）が含まれます。

プロジェクトのルート・ディレクトリで以下を実行します：

```bash title="Terminal"
next info
```

以下のような情報が出力されます：

```bash title="Terminal"

    Operating System:
      Platform: linux
      Arch: x64
      Version: #22-Ubuntu SMP Fri Nov 5 13:21:36 UTC 2021
    Binaries:
      Node: 16.13.0
      npm: 8.1.0
      Yarn: 1.22.17
      pnpm: 6.24.2
    Relevant packages:
      next: 12.0.8
      react: 17.0.2
      react-dom: 17.0.2
```

この情報を GitHub Issues に貼り付けてください。

インストールの問題を診断するために、`next info --verbose`を実行すると、システムと Next.js 関連パッケージのインストールに関する追加情報を表示できます。
